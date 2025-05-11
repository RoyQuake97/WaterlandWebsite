import type { Express } from "express";
import { z } from "zod";
import { insertNewsletterSubscriberSchema } from "@shared/schema";
import { storage } from "./storage";

export function registerNewsletterRoutes(app: Express) {
  app.post('/api/newsletter/signup', async (req, res) => {
  try {
    const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
    const subscriber = await storage.createNewsletterSubscriber(validatedData);
    res.status(201).json(subscriber);
  } catch (error) {
    console.error("Newsletter signup error:", error);
    res.status(400).json({ message: error instanceof Error ? error.message : "Invalid signup data" });
  }
  });
}

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertReservationSchema, 
  insertEventInquirySchema, 
  insertJobApplicationSchema, 
  insertContactMessageSchema,
  insertSiteSettingsSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";

// Extend Express Request type to include session
declare module "express-session" {
  interface SessionData {
    userId?: number;
    isAdmin?: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Register the reviews route for Google Maps reviews
  const { default: reviewsRouter } = await import('./routes/reviews');
  app.use('/api/reviews', reviewsRouter);

  // Register the Instagram feed route
  const { default: instagramRouter } = await import('./routes/instagram');
  app.use('/api/instagram', instagramRouter);

  // Set up session
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "waterland-secret-key",
    })
  );

  // Initialize site settings if they don't exist
  await storage.initializeSiteSettings();

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const requireAdmin = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId || !req.session.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

  // Login route
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session data
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;

      return res.status(200).json({ 
        id: user.id, 
        username: user.username, 
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout route
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Check auth status route
  app.get("/api/auth/status", (req: Request, res: Response) => {
    if (req.session.userId) {
      return res.status(200).json({ 
        isAuthenticated: true, 
        isAdmin: req.session.isAdmin || false
      });
    }
    return res.status(200).json({ 
      isAuthenticated: false,
      isAdmin: false  // Always include isAdmin property
    });
  });

  // Room routes
  app.get("/api/rooms", async (req: Request, res: Response) => {
    try {
      const rooms = await storage.getAllRooms();
      return res.status(200).json(rooms);
    } catch (error) {
      console.error("Get rooms error:", error);
      return res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  app.get("/api/rooms/:type", async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const rooms = await storage.getRoomsByType(type);
      return res.status(200).json(rooms);
    } catch (error) {
      console.error("Get rooms by type error:", error);
      return res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  app.patch("/api/rooms/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const roomId = parseInt(id);
      const roomUpdate = req.body;

      const updatedRoom = await storage.updateRoom(roomId, roomUpdate);

      if (!updatedRoom) {
        return res.status(404).json({ message: "Room not found" });
      }

      return res.status(200).json(updatedRoom);
    } catch (error) {
      console.error("Update room error:", error);
      return res.status(500).json({ message: "Failed to update room" });
    }
  });

  // Reservation routes
  app.post("/api/reservations", async (req: Request, res: Response) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validatedData);

      try {
        // Import the notification service - will try WhatsApp first, then SMS as fallback
        const { sendReservationNotification } = await import('./notifications');

        // If notification fails, we still want to create the reservation
        // so we'll handle this in a try/catch block
        const ownerPhoneNumber = process.env.RECIPIENT_WHATSAPP_NUMBER || process.env.TWILIO_WHATSAPP_NUMBER;

        if (ownerPhoneNumber) {
          // Send the notification to the resort owner/manager
          const notificationResult = await sendReservationNotification(reservation, ownerPhoneNumber);

          if (notificationResult.success) {
            console.log(`${notificationResult.method?.toUpperCase()} notification sent for reservation:`, reservation.id);
          } else {
            console.warn("Notification not sent:", notificationResult.message);
          }
        } else {
          console.warn("No recipient phone number configured for notifications");
        }
      } catch (notificationError) {
        // Log the error but don't fail the reservation creation
        console.error("Failed to send notification:", notificationError);
      }

      return res.status(201).json(reservation);
    } catch (error) {
      console.error("Create reservation error:", error);
      return res.status(400).json({ message: error instanceof Error ? error.message : "Invalid reservation data" });
    }
  });

  app.get("/api/reservations", requireAdmin, async (req: Request, res: Response) => {
    try {
      const reservations = await storage.getAllReservations();
      return res.status(200).json(reservations);
    } catch (error) {
      console.error("Get reservations error:", error);
      return res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Get reservation availability data (public endpoint for calendar UI)
  app.get("/api/reservations/availability", async (req: Request, res: Response) => {
    try {
      const reservations = await storage.getAllReservations();

      // Filter out sensitive guest information before sending to the client
      const availability = reservations.map(reservation => ({
        roomType: reservation.roomType,
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        numberOfRooms: reservation.numberOfRooms || 1
      }));

      console.log("Availability data sent:", availability.length, "reservations");
      return res.status(200).json(availability);
    } catch (error) {
      console.error("Get availability error:", error);
      return res.status(500).json({ message: "Failed to fetch reservation availability" });
    }
  });

  app.get("/api/reservations/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const reservationId = parseInt(id);

      const reservation = await storage.getReservation(reservationId);

      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      return res.status(200).json(reservation);
    } catch (error) {
      console.error("Get reservation error:", error);
      return res.status(500).json({ message: "Failed to fetch reservation" });
    }
  });

  app.patch("/api/reservations/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const reservationId = parseInt(id);
      const reservationUpdate = req.body;

      const updatedReservation = await storage.updateReservation(reservationId, reservationUpdate);

      if (!updatedReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      return res.status(200).json(updatedReservation);
    } catch (error) {
      console.error("Update reservation error:", error);
      return res.status(500).json({ message: "Failed to update reservation" });
    }
  });

  app.delete("/api/reservations/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const reservationId = parseInt(id);

      const success = await storage.deleteReservation(reservationId);

      if (!success) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Delete reservation error:", error);
      return res.status(500).json({ message: "Failed to delete reservation" });
    }
  });

  // Event inquiry routes
  app.post("/api/event-inquiries", async (req: Request, res: Response) => {
    try {
      const validatedData = insertEventInquirySchema.parse(req.body);
      const inquiry = await storage.createEventInquiry(validatedData);
      return res.status(201).json(inquiry);
    } catch (error) {
      console.error("Create event inquiry error:", error);
      return res.status(400).json({ message: error instanceof Error ? error.message : "Invalid event inquiry data" });
    }
  });

  app.get("/api/event-inquiries", requireAdmin, async (req: Request, res: Response) => {
    try {
      const inquiries = await storage.getAllEventInquiries();
      return res.status(200).json(inquiries);
    } catch (error) {
      console.error("Get event inquiries error:", error);
      return res.status(500).json({ message: "Failed to fetch event inquiries" });
    }
  });

  app.patch("/api/event-inquiries/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const inquiryId = parseInt(id);
      const inquiryUpdate = req.body;

      const updatedInquiry = await storage.updateEventInquiry(inquiryId, inquiryUpdate);

      if (!updatedInquiry) {
        return res.status(404).json({ message: "Event inquiry not found" });
      }

      return res.status(200).json(updatedInquiry);
    } catch (error) {
      console.error("Update event inquiry error:", error);
      return res.status(500).json({ message: "Failed to update event inquiry" });
    }
  });

  // Job application routes
  app.post("/api/job-applications", async (req: Request, res: Response) => {
    try {
      const validatedData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(validatedData);
      return res.status(201).json(application);
    } catch (error) {
      console.error("Create job application error:", error);
      return res.status(400).json({ message: error instanceof Error ? error.message : "Invalid job application data" });
    }
  });

  app.get("/api/job-applications", requireAdmin, async (req: Request, res: Response) => {
    try {
      const applications = await storage.getAllJobApplications();
      return res.status(200).json(applications);
    } catch (error) {
      console.error("Get job applications error:", error);
      return res.status(500).json({ message: "Failed to fetch job applications" });
    }
  });

  app.patch("/api/job-applications/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const applicationId = parseInt(id);
      const applicationUpdate = req.body;

      const updatedApplication = await storage.updateJobApplication(applicationId, applicationUpdate);

      if (!updatedApplication) {
        return res.status(404).json({ message: "Job application not found" });
      }

      return res.status(200).json(updatedApplication);
    } catch (error) {
      console.error("Update job application error:", error);
      return res.status(500).json({ message: "Failed to update job application" });
    }
  });

  // Contact message routes
  app.post("/api/contact-messages", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      return res.status(201).json(message);
    } catch (error) {
      console.error("Create contact message error:", error);
      return res.status(400).json({ message: error instanceof Error ? error.message : "Invalid contact message data" });
    }
  });

  app.get("/api/contact-messages", requireAdmin, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getAllContactMessages();
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Get contact messages error:", error);
      return res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.patch("/api/contact-messages/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const messageId = parseInt(id);
      const messageUpdate = req.body;

      const updatedMessage = await storage.updateContactMessage(messageId, messageUpdate);

      if (!updatedMessage) {
        return res.status(404).json({ message: "Contact message not found" });
      }

      return res.status(200).json(updatedMessage);
    } catch (error) {
      console.error("Update contact message error:", error);
      return res.status(500).json({ message: "Failed to update contact message" });
    }
  });

  // Newsletter subscribers routes
  app.get("/api/newsletter-subscribers", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      return res.status(200).json(subscribers);
    } catch (error) {
      console.error("Get newsletter subscribers error:", error);
      return res.status(500).json({ message: "Failed to fetch newsletter subscribers" });
    }
  });

  // Site settings routes
  app.get("/api/site-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();

      if (!settings) {
        return res.status(404).json({ message: "Site settings not found" });
      }

      return res.status(200).json(settings);
    } catch (error) {
      console.error("Get site settings error:", error);
      return res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  app.patch("/api/site-settings", requireAdmin, async (req: Request, res: Response) => {
    try {
      const settingsUpdate = req.body;

      const validatedData = insertSiteSettingsSchema.partial().parse(settingsUpdate);

      const updatedSettings = await storage.updateSiteSettings(validatedData);

      if (!updatedSettings) {
        return res.status(404).json({ message: "Site settings not found" });
      }

      return res.status(200).json(updatedSettings);
    } catch (error) {
      console.error("Update site settings error:", error);
      return res.status(500).json({ message: error instanceof Error ? error.message : "Failed to update site settings" });
    }
  });

  // Weather temperature endpoint for LiveInfoBar
  app.get("/api/wtemp", async (_req: Request, res: Response) => {
    try {
      const API_KEY = process.env.OPENWEATHER_API_KEY;

      if (!API_KEY) {
        console.warn("OPENWEATHER_API_KEY environment variable is not set");
        // Return mock data for development
        const temperature = Math.floor(Math.random() * (28 - 21 + 1)) + 21; // Random temp between 21-28°C
        return res.json({ c: temperature });
      }

      const lat = 34.3972;  // Coordinates for Zghartā, Lebanon
      const lon = 35.8947;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const temperature = Math.round(data.main.temp);

      return res.json({ c: temperature });
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching current temperature:', error);

      // Fallback to random temperature
      const temperature = Math.floor(Math.random() * (28 - 21 + 1)) + 21;
      return res.json({ c: temperature });
    }
  });

  // 3-Day Weather Forecast endpoint
  app.get("/api/weather/forecast", async (_req: Request, res: Response) => {
    try {
      const API_KEY = process.env.OPENWEATHER_API_KEY;

      if (!API_KEY) {
        console.warn("OPENWEATHER_API_KEY environment variable is not set");
        // Return mock data for development
        return res.json({
          forecast: [
            {
              date: new Date().toISOString().split('T')[0],
              day: 'Today',
              temp: 29,
              description: 'clear sky',
              icon: '01d'
            },
            {
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              day: 'Fri',
              temp: 27,
              description: 'few clouds',
              icon: '02d'
            },
            {
              date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
              day: 'Sat',
              temp: 24,
              description: 'light rain',
              icon: '10d'
            }
          ]
        });
      }

      const lat = 34.3972;  // Coordinates for Zghartā, Lebanon
      const lon = 35.8947;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=24`
      );

      if (!response.ok) {
        throw new Error(`Weather API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Process the data to get today + 2 days ahead
      // OpenWeatherMap returns forecast in 3-hour intervals
      // We'll take one reading per day (at noon)
      const forecastData = [];
      const processedDays = new Set();

      for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Skip if we already have this day
        if (processedDays.has(day)) continue;

        // Get the forecast for around noon (closest to 12:00)
        const hour = date.getHours();
        if (Math.abs(hour - 12) > 3 && processedDays.size < 3) continue;

        processedDays.add(day);

        forecastData.push({
          date: day,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });

        // Stop after we have 3 days
        if (forecastData.length >= 3) break;
      }

      res.json({ forecast: forecastData });
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching weather data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch weather data', 
        message: error.message || 'Unknown error occurred' 
      });
    }
  });

  return httpServer;
}