# Waterland Resort & Waterpark Website

A fully responsive, dynamic website for Waterland Resort & Waterpark in Lebanon that allows for viewing resort information, making hotel reservations, checking waterpark details, and handling online payments.

## Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Hotel Booking System**: Online reservation system for hotel rooms
- **PostgreSQL Database**: Persistent data storage for all website content
- **Admin Panel**: Management interface for administrators
- **WhatsApp Notifications**: Real-time WhatsApp/SMS alerts for new reservations

## Technology Stack

- **Frontend**: React with Tailwind CSS and shadcn components
- **Backend**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with Passport.js
- **Notifications**: WhatsApp/SMS notifications via Twilio API

## Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Twilio account (for notifications)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/waterland
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token  
   TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
   RECIPIENT_WHATSAPP_NUMBER=recipient_phone_number
   ```
4. Push the database schema:
   ```
   npm run db:push
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Documentation

- [WhatsApp Notifications](./docs/WhatsAppNotifications.md)

## Admin Access

Default admin credentials:
- Username: admin
- Password: admin123

## License

This project is proprietary and confidential.