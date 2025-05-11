# Waterland Resort & Waterpark Architecture

## 1. Overview

The Waterland Resort & Waterpark website is a full-stack web application designed to provide information about the resort, allow customers to make hotel reservations, check waterpark details, and manage the resort administration. The architecture follows a modern client-server approach with a clear separation between the frontend and backend components while sharing types and schemas.

The application is built with a React frontend using Tailwind CSS for styling and an Express.js backend providing a REST API. Data is persisted in a PostgreSQL database using Drizzle ORM for database access and schema management.

## 2. System Architecture

### High-Level Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

```
/
├── client/             # Frontend React application
├── server/             # Backend Express.js application
├── shared/             # Shared types and schemas
├── dist/               # Build output directory
```

### Frontend Architecture

The frontend is built with React and uses a component-based architecture. Key technologies include:

- **React**: UI rendering library
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library based on Radix UI
- **React Query**: Data fetching and state management
- **React Hook Form**: Form validation and handling
- **Wouter**: Lightweight router for navigation
- **Framer Motion**: Animation library

The frontend is built with Vite and follows a modular approach with reusable components.

### Backend Architecture

The backend uses Express.js to provide a RESTful API. Key technologies include:

- **Express.js**: Web server framework
- **Drizzle ORM**: Database ORM for type-safe database access
- **PostgreSQL**: Relational database for persistent storage
- **Express Session**: Session-based authentication
- **Twilio API**: For WhatsApp notifications

The server handles requests from the client, performs database operations, and sends notifications for new reservations.

### Database Architecture

The database is PostgreSQL with the schema defined using Drizzle ORM. Key entities include:

- **Users**: Admin user accounts for system access
- **Rooms**: Hotel room information
- **Reservations**: Customer booking details
- **Event Inquiries**: Customer inquiries about hosting events
- **Job Applications**: Applications for job positions
- **Contact Messages**: General contact form submissions
- **Site Settings**: Configuration settings for the website

## 3. Key Components

### Frontend Components

1. **Pages**: 
   - Home: Landing page with video hero section
   - Waterpark: Information about water attractions
   - Hotel: Room listings and booking form
   - Menu: Restaurant and bar menus
   - Events: Event venue information and inquiry form
   - Careers: Job listings and application form
   - Contact: Contact information and messaging form
   - Admin: Administration interface with dashboard, reservations, and settings

2. **UI Components**:
   - Shadcn UI components providing consistent design
   - Custom components like `VideoHero`, `RoomCard`, `BookingForm`
   - Shared components for layout and navigation
   - Weather widget showing current water temperature

3. **State Management**:
   - React Query for server state management
   - React Hook Form for form state
   - Local state for UI interactions

### Backend Components

1. **API Routes**:
   - Authentication endpoints for admin login
   - CRUD operations for reservations, rooms, and other entities
   - Admin-only routes protected by authentication middleware
   - Public routes for retrieving information and submitting forms

2. **Services**:
   - Storage service for database operations
   - Notification service for WhatsApp alerts
   - Calendar service for generating iCalendar events

3. **Middleware**:
   - Authentication middleware
   - Request logging middleware
   - Session management

### Shared Components

1. **Database Schema**:
   - Zod validators integrated with Drizzle ORM
   - Type definitions shared between frontend and backend
   - Enums for consistent field values (e.g., room types)

## 4. Data Flow

### Reservation Flow

1. User navigates to the Hotel page
2. User views available room types and pricing
3. User fills out the booking form with personal details and dates
4. Form is validated on the client side before submission
5. Request is sent to the backend API endpoint
6. Server validates the submission and creates a reservation in the database
7. WhatsApp notification is sent to the resort management
8. Confirmation is sent back to the user with booking details
9. Optional iCalendar file is generated for the user to add to their calendar

### Admin Management Flow

1. Admin logs in through the login page
2. Authentication is validated on the server against stored credentials
3. Session is created and maintained for subsequent requests
4. Admin can view and manage reservations through the admin interface
5. Changes to reservations or settings are sent to the API
6. Server updates the database and returns confirmation

## 5. External Dependencies

### Frontend Dependencies

- **React and React DOM**: UI library
- **Radix UI**: Unstyled, accessible components
- **Tailwind CSS**: Utility CSS framework
- **Tanstack Query**: Data fetching and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Framer Motion**: Animation library
- **Wouter**: Routing library
- **Lucide Icons**: Icon library

### Backend Dependencies

- **Express**: Web framework
- **Drizzle ORM**: Database ORM
- **PostgreSQL**: Database driver (via Neon Serverless)
- **bcrypt**: Password hashing
- **express-session**: Session management
- **Twilio**: WhatsApp notification service
- **ics**: iCalendar generation

## 6. Deployment Strategy

The application is designed for deployment on the Replit platform with specific configuration for production deployment:

### Development Environment

- Uses `tsx` for TypeScript execution in development
- Vite provides development server with hot module replacement
- In-memory session store for authentication

### Production Build Process

1. Vite builds the frontend assets
2. esbuild bundles the server code
3. Combined assets are placed in the `dist` directory

### Production Deployment

- Express serves static assets from the `dist/public` directory
- Server runs in production mode with optimized settings
- Configured for auto-scaling deployment on Replit

### Database Management

- Uses Neon Serverless PostgreSQL for database access
- Drizzle ORM manages database schema and migrations
- Environment variables configure database connection

## 7. Authentication and Security

### Authentication Strategy

The application uses session-based authentication for admin users:

1. Admin credentials are stored in the database with hashed passwords
2. Login form posts credentials to the server
3. Server validates credentials and creates a session
4. Session ID is stored in a cookie
5. Subsequent requests include the session cookie
6. Server validates the session on restricted endpoints
7. Logout endpoint destroys the session

### Security Considerations

- Passwords are hashed using bcrypt
- Session middleware with secure settings
- Input validation using Zod schemas
- Protected routes with authentication middleware
- CSRF protection via same-site cookies

## 8. Notification System

The application includes a WhatsApp notification system for new reservations:

1. Twilio API is used to send WhatsApp messages
2. Notifications include reservation details formatted for readability
3. System gracefully degrades if notifications fail
4. Configuration via environment variables
5. Support for sandbox mode during development

This feature provides immediate alerts to resort management when new bookings are made, improving response time and customer service.