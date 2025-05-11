import {
  users, User, InsertUser,
  rooms, Room, InsertRoom,
  reservations, Reservation, InsertReservation,
  eventInquiries, EventInquiry, InsertEventInquiry,
  jobApplications, JobApplication, InsertJobApplication,
  contactMessages, ContactMessage, InsertContactMessage,
  siteSettings, SiteSettings, InsertSiteSettings,
  newsletterSubscribers, NewsletterSubscriber
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Define the storage interface for all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Room operations
  getAllRooms(): Promise<Room[]>;
  getRoomsByType(type: string): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<Room>): Promise<Room | undefined>;

  // Reservation operations
  getAllReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, reservation: Partial<Reservation>): Promise<Reservation | undefined>;
  deleteReservation(id: number): Promise<boolean>;

  // Event inquiry operations
  getAllEventInquiries(): Promise<EventInquiry[]>;
  getEventInquiry(id: number): Promise<EventInquiry | undefined>;
  createEventInquiry(inquiry: InsertEventInquiry): Promise<EventInquiry>;
  updateEventInquiry(id: number, inquiry: Partial<EventInquiry>): Promise<EventInquiry | undefined>;

  // Job application operations
  getAllJobApplications(): Promise<JobApplication[]>;
  getJobApplication(id: number): Promise<JobApplication | undefined>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: number, application: Partial<JobApplication>): Promise<JobApplication | undefined>;

  // Contact message operations
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: number, message: Partial<ContactMessage>): Promise<ContactMessage | undefined>;

  // Site settings operations
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings | undefined>;
  initializeSiteSettings(): Promise<SiteSettings>;

  // Newsletter operations
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
}

// Implement in-memory storage for MVP
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rooms: Map<number, Room>;
  private reservations: Map<number, Reservation>;
  private eventInquiries: Map<number, EventInquiry>;
  private jobApplications: Map<number, JobApplication>;
  private contactMessages: Map<number, ContactMessage>;
  private siteSettings: SiteSettings | undefined;

  private currentUserId: number;
  private currentRoomId: number;
  private currentReservationId: number;
  private currentEventInquiryId: number;
  private currentJobApplicationId: number;
  private currentContactMessageId: number;
  private currentSiteSettingsId: number;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.reservations = new Map();
    this.eventInquiries = new Map();
    this.jobApplications = new Map();
    this.contactMessages = new Map();

    this.currentUserId = 1;
    this.currentRoomId = 1;
    this.currentReservationId = 1;
    this.currentEventInquiryId = 1;
    this.currentJobApplicationId = 1;
    this.currentContactMessageId = 1;
    this.currentSiteSettingsId = 1;

    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$NlypKBR5iHqbGvGQAK2Dwe1ZK9q.WLJ9EXA1JKhuCMTMn0g9SsCPO", // "admin123"
      isAdmin: true
    });

    // Create default rooms
    this.createRoom({
      type: "junior",
      title: "Junior Room",
      description: "Comfortable room for 2 adults and 1 child with all basic amenities.",
      pricePerNight: 250,
      maxAdults: 2,
      maxChildren: 1,
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      isAvailable: true
    });

    this.createRoom({
      type: "twin",
      title: "Twin Room",
      description: "Spacious room with two double beds, perfect for families.",
      pricePerNight: 300,
      maxAdults: 2,
      maxChildren: 2,
      imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
      isAvailable: true
    });

    this.createRoom({
      type: "ambassador",
      title: "Ambassador Room",
      description: "Luxury room with premium amenities and extra space for larger families.",
      pricePerNight: 350,
      maxAdults: 2,
      maxChildren: 3,
      imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      isAvailable: true
    });

    // Initialize site settings
    this.initializeSiteSettings();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin || false 
    };
    this.users.set(id, user);
    return user;
  }

  // Room operations
  async getAllRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoomsByType(type: string): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(room => room.type === type);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.currentRoomId++;
    const room: Room = { ...insertRoom, id };
    this.rooms.set(id, room);
    return room;
  }

  async updateRoom(id: number, roomUpdate: Partial<Room>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;

    const updatedRoom = { ...room, ...roomUpdate };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  // Reservation operations
  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentReservationId++;
    const reservation: Reservation = { 
      ...insertReservation, 
      id, 
      isPaid: false, 
      createdAt: new Date() 
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async updateReservation(id: number, reservationUpdate: Partial<Reservation>): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;

    const updatedReservation = { ...reservation, ...reservationUpdate };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  async deleteReservation(id: number): Promise<boolean> {
    return this.reservations.delete(id);
  }

  // Event inquiry operations
  async getAllEventInquiries(): Promise<EventInquiry[]> {
    return Array.from(this.eventInquiries.values());
  }

  async getEventInquiry(id: number): Promise<EventInquiry | undefined> {
    return this.eventInquiries.get(id);
  }

  async createEventInquiry(insertInquiry: InsertEventInquiry): Promise<EventInquiry> {
    const id = this.currentEventInquiryId++;
    const inquiry: EventInquiry = { 
      ...insertInquiry, 
      id, 
      status: "new", 
      createdAt: new Date() 
    };
    this.eventInquiries.set(id, inquiry);
    return inquiry;
  }

  async updateEventInquiry(id: number, inquiryUpdate: Partial<EventInquiry>): Promise<EventInquiry | undefined> {
    const inquiry = this.eventInquiries.get(id);
    if (!inquiry) return undefined;

    const updatedInquiry = { ...inquiry, ...inquiryUpdate };
    this.eventInquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }

  // Job application operations
  async getAllJobApplications(): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values());
  }

  async getJobApplication(id: number): Promise<JobApplication | undefined> {
    return this.jobApplications.get(id);
  }

  async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const id = this.currentJobApplicationId++;
    const application: JobApplication = { 
      ...insertApplication, 
      id, 
      status: "new", 
      createdAt: new Date() 
    };
    this.jobApplications.set(id, application);
    return application;
  }

  async updateJobApplication(id: number, applicationUpdate: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const application = this.jobApplications.get(id);
    if (!application) return undefined;

    const updatedApplication = { ...application, ...applicationUpdate };
    this.jobApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Contact message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      isRead: false, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async updateContactMessage(id: number, messageUpdate: Partial<ContactMessage>): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;

    const updatedMessage = { ...message, ...messageUpdate };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Site settings operations
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return this.siteSettings;
  }

  async updateSiteSettings(settingsUpdate: Partial<SiteSettings>): Promise<SiteSettings | undefined> {
    if (!this.siteSettings) return undefined;

    this.siteSettings = { 
      ...this.siteSettings, 
      ...settingsUpdate 
    };

    return this.siteSettings;
  }

  async initializeSiteSettings(): Promise<SiteSettings> {
    if (this.siteSettings) return this.siteSettings;

    this.siteSettings = {
      id: this.currentSiteSettingsId++,
      announcementText: "Last Day of Season is September 15th! Book now to secure your spot.",
      showAnnouncement: true,
      openingHours: "10:00 AM - 7:00 PM",
      generalTicketPrice: 20,
      vipTicketPrice: 25,
      juniorRoomPrice: 250,
      twinRoomPrice: 300,
      ambassadorRoomPrice: 350,
      isHiringActive: true
    };

    return this.siteSettings;
  }
}

// Implement database storage for production
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        isAdmin: insertUser.isAdmin || false
      })
      .returning();
    return user;
  }

  // Room operations
  async getAllRooms(): Promise<Room[]> {
    return await db.select().from(rooms);
  }

  async getRoomsByType(type: string): Promise<Room[]> {
    return await db.select().from(rooms).where(eq(rooms.type, type as any));
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const [room] = await db
      .insert(rooms)
      .values(insertRoom)
      .returning();
    return room;
  }

  async updateRoom(id: number, roomUpdate: Partial<Room>): Promise<Room | undefined> {
    const [updatedRoom] = await db
      .update(rooms)
      .set(roomUpdate)
      .where(eq(rooms.id, id))
      .returning();
    return updatedRoom || undefined;
  }

  // Reservation operations
  async getAllReservations(): Promise<Reservation[]> {
    return await db.select().from(reservations);
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    const [reservation] = await db.select().from(reservations).where(eq(reservations.id, id));
    return reservation || undefined;
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const [reservation] = await db
      .insert(reservations)
      .values({
        ...insertReservation,
        isPaid: false,
        createdAt: new Date()
      })
      .returning();
    return reservation;
  }

  async updateReservation(id: number, reservationUpdate: Partial<Reservation>): Promise<Reservation | undefined> {
    const [updatedReservation] = await db
      .update(reservations)
      .set(reservationUpdate)
      .where(eq(reservations.id, id))
      .returning();
    return updatedReservation || undefined;
  }

  async deleteReservation(id: number): Promise<boolean> {
    const result = await db
      .delete(reservations)
      .where(eq(reservations.id, id))
      .returning({ id: reservations.id });
    return result.length > 0;
  }

  // Event inquiry operations
  async getAllEventInquiries(): Promise<EventInquiry[]> {
    return await db.select().from(eventInquiries);
  }

  async getEventInquiry(id: number): Promise<EventInquiry | undefined> {
    const [inquiry] = await db.select().from(eventInquiries).where(eq(eventInquiries.id, id));
    return inquiry || undefined;
  }

  async createEventInquiry(insertInquiry: InsertEventInquiry): Promise<EventInquiry> {
    const [inquiry] = await db
      .insert(eventInquiries)
      .values({
        ...insertInquiry,
        status: "new",
        createdAt: new Date()
      })
      .returning();
    return inquiry;
  }

  async updateEventInquiry(id: number, inquiryUpdate: Partial<EventInquiry>): Promise<EventInquiry | undefined> {
    const [updatedInquiry] = await db
      .update(eventInquiries)
      .set(inquiryUpdate)
      .where(eq(eventInquiries.id, id))
      .returning();
    return updatedInquiry || undefined;
  }

  // Job application operations
  async getAllJobApplications(): Promise<JobApplication[]> {
    return await db.select().from(jobApplications);
  }

  async getJobApplication(id: number): Promise<JobApplication | undefined> {
    const [application] = await db.select().from(jobApplications).where(eq(jobApplications.id, id));
    return application || undefined;
  }

  async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const [application] = await db
      .insert(jobApplications)
      .values({
        ...insertApplication,
        status: "new",
        createdAt: new Date()
      })
      .returning();
    return application;
  }

  async updateJobApplication(id: number, applicationUpdate: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const [updatedApplication] = await db
      .update(jobApplications)
      .set(applicationUpdate)
      .where(eq(jobApplications.id, id))
      .returning();
    return updatedApplication || undefined;
  }

  // Contact message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values({
        ...insertMessage,
        isRead: false,
        createdAt: new Date()
      })
      .returning();
    return message;
  }

  async updateContactMessage(id: number, messageUpdate: Partial<ContactMessage>): Promise<ContactMessage | undefined> {
    const [updatedMessage] = await db
      .update(contactMessages)
      .set(messageUpdate)
      .where(eq(contactMessages.id, id))
      .returning();
    return updatedMessage || undefined;
  }

  // Site settings operations
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const settings = await db.select().from(siteSettings).limit(1);
    return settings[0] || undefined;
  }

  async updateSiteSettings(settingsUpdate: Partial<SiteSettings>): Promise<SiteSettings | undefined> {
    // Find the first site settings record
    const existingSettings = await db.select().from(siteSettings).limit(1);

    if (existingSettings.length === 0) {
      return undefined;
    }

    const [updatedSettings] = await db
      .update(siteSettings)
      .set(settingsUpdate)
      .where(eq(siteSettings.id, existingSettings[0].id))
      .returning();

    return updatedSettings || undefined;
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  async initializeSiteSettings(): Promise<SiteSettings> {
    // Check if settings already exist
    const existingSettings = await db.select().from(siteSettings).limit(1);

    if (existingSettings.length > 0) {
      return existingSettings[0];
    }

    const defaultSettings = {
      announcementText: "Last Day of Season is September 15th! Book now to secure your spot.",
      showAnnouncement: true,
      openingHours: "10:00 AM - 7:00 PM",
      generalTicketPrice: 20,
      vipTicketPrice: 25,
      juniorRoomPrice: 250,
      twinRoomPrice: 300,
      ambassadorRoomPrice: 350,
      isHiringActive: true,
    };

    const [newSettings] = await db
      .insert(siteSettings)
      .values(defaultSettings)
      .returning();

    return newSettings;
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();