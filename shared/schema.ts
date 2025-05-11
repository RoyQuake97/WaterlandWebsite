import { pgTable, text, serial, integer, boolean, date, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Room types enum
export const roomTypeEnum = pgEnum("room_type", ["junior", "twin", "ambassador"]);

// Room schema
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  type: roomTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  maxAdults: integer("max_adults").notNull(),
  maxChildren: integer("max_children").notNull(),
  imageUrl: text("image_url").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

// Reservation schema
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  roomType: roomTypeEnum("room_type").notNull(),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  adults: integer("adults").notNull(),
  children: integer("children").notNull(),
  specialRequests: text("special_requests"),
  isPaid: boolean("is_paid").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  numberOfRooms: integer("number_of_rooms").default(1).notNull(),
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
  isPaid: true,
});

// Event inquiry schema
export const eventInquiries = pgTable("event_inquiries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  eventType: text("event_type").notNull(),
  eventDate: date("event_date").notNull(),
  numberOfGuests: integer("number_of_guests").notNull(),
  message: text("message"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventInquirySchema = createInsertSchema(eventInquiries).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Job application schema
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  position: text("position").notNull(),
  coverLetter: text("cover_letter"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Contact message schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

// Site settings schema
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  announcementText: text("announcement_text"),
  showAnnouncement: boolean("show_announcement").default(true).notNull(),
  openingHours: text("opening_hours").default("10:00 AM - 7:00 PM").notNull(),
  generalTicketPrice: integer("general_ticket_price").default(20).notNull(),
  vipTicketPrice: integer("vip_ticket_price").default(25).notNull(),
  juniorRoomPrice: integer("junior_room_price").default(250).notNull(),
  twinRoomPrice: integer("twin_room_price").default(300).notNull(),
  ambassadorRoomPrice: integer("ambassador_room_price").default(350).notNull(),
  isHiringActive: boolean("is_hiring_active").default(true).notNull(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type EventInquiry = typeof eventInquiries.$inferSelect;
export type InsertEventInquiry = z.infer<typeof insertEventInquirySchema>;

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Newsletter subscribers schema
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  createdAt: true,
  isActive: true,
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
