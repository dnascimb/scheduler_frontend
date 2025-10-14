# Appointment Scheduler - Google Calendar Style

A modern, full-stack appointment booking system built for small businesses with Google Calendar-inspired design. Complete with React frontend, Express backend, PostgreSQL database, and JWT authentication.

Perfect for salons, spas, medical practices, consulting firms, and any service-based business that needs appointment scheduling.

## ✨ Features

### Business Dashboard (`/business`)
- **📅 Calendar Views**: Month, Week, and Day views with Google Calendar styling
- **🔐 Authentication**: Secure login with JWT tokens
- **✏️ Appointment Management**: View, edit, cancel, and manage all appointments in real-time
- **🔧 Settings Dashboard**: Comprehensive business configuration
  - General business information
  - Service management (add, edit, delete services)
  - Staff member management with individual availability schedules
  - Business hours configuration
- **👥 Staff Availability**: Each staff member can have unique working hours by day of week
- **🎨 Color Coding**: Visual service and staff identification with custom colors
- **💾 Real Database**: All data persists to PostgreSQL

### Client Booking Interface (`/book`)
- **📝 Multi-step Booking Flow**:
  1. Select a service
  2. Choose date and time
  3. Enter contact information
  4. Confirm booking
- **⏰ Real-time Availability**: Dynamic slot generation based on staff schedules and existing appointments
- **✅ Smart Scheduling**: Only shows available slots when staff members are working
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **💬 Booking Confirmation**: Clear confirmation screen with appointment details
- **🔄 Automatic Client Creation**: New clients are automatically created or existing clients are found

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router v7** for navigation
- **JWT Authentication** with localStorage persistence

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database operations
- **JWT** for authentication
- **bcryptjs** for password hashing

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or use Prisma dev database)

### Installation

**1. Clone and Navigate:**
```bash
cd appointment-scheduler
```

**2. Install Frontend Dependencies:**
```bash
npm install
```

**3. Install Backend Dependencies:**
```bash
cd ../backend
npm install
```

**4. Set Up Database:**
```bash
# Start Prisma development database
npx prisma dev

# In another terminal, run migrations
npx prisma migrate dev

# Seed the database with sample data
npm run prisma:seed
```

**5. Configure Environment Variables:**
```bash
# Backend .env file is already configured
# Update if needed: DATABASE_URL, JWT_SECRET, PORT, etc.
```

**6. Start Backend Server:**
```bash
npm run dev
# Backend runs on http://localhost:3001
```

**7. Start Frontend Server:**
```bash
cd ../appointment-scheduler
npm run dev
# Frontend runs on http://localhost:5174
```

### Demo Credentials

After seeding the database, you can log in with:
- **Email**: `owner@sunnyspasalon.com`
- **Password**: `demo123`

## Project Structure

### Frontend (`/appointment-scheduler`)
```
src/
├── components/
│   └── calendar/              # Calendar components
│       ├── Calendar.tsx       # Main calendar with view switching
│       ├── MonthView.tsx      # Month grid view
│       ├── WeekView.tsx       # Week timeline view
│       └── DayView.tsx        # Single day detailed view
├── contexts/
│   └── AuthContext.tsx        # Authentication state management
├── pages/
│   ├── Login.tsx              # Login page
│   ├── Register.tsx           # Registration page
│   ├── BusinessDashboard.tsx  # Business calendar/dashboard
│   ├── BusinessSettings.tsx   # Settings management
│   └── ClientBooking.tsx      # Client booking flow
├── services/
│   └── api.ts                 # API service layer
├── config/
│   └── api.ts                 # API configuration
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   └── dateUtils.ts           # Date manipulation utilities
└── App.tsx                    # Main app with routing
```

### Backend (`/backend`)
```
src/
├── controllers/               # Request handlers
│   ├── authController.ts      # Login, register, get user
│   ├── businessController.ts  # Business CRUD
│   ├── servicesController.ts  # Services CRUD
│   ├── staffController.ts     # Staff CRUD
│   ├── appointmentsController.ts  # Appointments + availability
│   └── clientsController.ts   # Clients CRUD
├── routes/                    # Route definitions
│   ├── auth.ts
│   ├── business.ts
│   ├── services.ts
│   ├── staff.ts
│   ├── appointments.ts
│   └── clients.ts
├── middleware/
│   └── auth.ts                # JWT authentication middleware
├── utils/                     # Utility functions
└── index.ts                   # Express app setup

prisma/
├── schema.prisma              # Database schema
├── migrations/                # Database migrations
└── seed.ts                    # Sample data seeding
```

## 🚀 Usage Guide

### Business Dashboard

**1. Login:**
- Navigate to http://localhost:5174
- Click "Business Dashboard" (redirects to login)
- Use demo credentials or register a new account

**2. View Appointments:**
- Calendar automatically loads with appointments from database
- Switch between Month, Week, and Day views
- Click any appointment to view details

**3. Edit Appointments:**
- Click on an appointment
- Click "Edit" button
- Modify service, staff, time, status, or notes
- Save - changes persist to database

**4. Manage Settings:**
- Click "Settings" in top navigation
- **General Tab**: Update business information
- **Services Tab**: Add, edit, or delete services
- **Staff Tab**: Manage staff members and their availability schedules
- **Hours Tab**: Set business operating hours

### Client Booking Flow

1. **Navigate to**: http://localhost:5174/book (while logged in)
2. **Select Service**: Choose from available services
3. **Pick Date & Time**:
   - Select a date
   - API fetches available slots based on staff availability
   - Choose a time slot
4. **Enter Information**: Provide contact details
5. **Confirm**: Review and confirm booking
6. **Success**: Appointment created in database

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user and business
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Business
- `GET /api/business` - Get business details (requires auth)
- `PUT /api/business` - Update business (requires auth)
- `PUT /api/business/hours` - Update business hours (requires auth)

### Services
- `GET /api/services` - List services (requires auth)
- `POST /api/services` - Create service (requires auth)
- `PUT /api/services/:id` - Update service (requires auth)
- `DELETE /api/services/:id` - Delete service (requires auth)

### Staff
- `GET /api/staff` - List staff members (requires auth)
- `POST /api/staff` - Create staff member (requires auth)
- `PUT /api/staff/:id` - Update staff member (requires auth)
- `DELETE /api/staff/:id` - Delete staff member (requires auth)

### Appointments
- `GET /api/appointments` - List appointments (requires auth)
- `GET /api/appointments/available-slots` - Get available time slots (requires auth)
- `POST /api/appointments` - Create appointment (requires auth)
- `PUT /api/appointments/:id` - Update appointment (requires auth)
- `DELETE /api/appointments/:id` - Cancel appointment (requires auth)

### Clients
- `GET /api/clients` - List clients (requires auth)
- `POST /api/clients` - Create client (requires auth)
- `PUT /api/clients/:id` - Update client (requires auth)
- `DELETE /api/clients/:id` - Delete client (requires auth)

## Database Schema

The PostgreSQL database includes:
- **Users**: Business owners with authentication
- **Businesses**: Business information and settings
- **BusinessHours**: Operating hours per day of week
- **Services**: Bookable services with pricing
- **StaffMembers**: Staff with individual availability
- **StaffAvailability**: Working hours per staff member
- **Clients**: Customers who book appointments
- **Appointments**: Bookings with full relationships
- **AppointmentStatus**: Enum (PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)

See `backend/prisma/schema.prisma` for complete schema.

## 🎯 Key Features

### Smart Availability System
- Staff members have individual availability schedules
- Appointment slots only show when staff are working
- Real-time conflict detection prevents double-booking
- Buffer time between appointments
- Configurable slot duration

### Authentication & Security
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Token persistence in localStorage
- Automatic token refresh on page reload

### Real-time Updates
- All changes immediately reflected in UI
- Database persistence for all operations
- Soft deletes for services and staff (mark as inactive)
- Complete audit trail with created/updated timestamps

## Development

### Frontend Development
```bash
cd appointment-scheduler
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Database Management
```bash
# Open Prisma Studio (visual database editor)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database and reseed
npx prisma migrate reset
npm run prisma:seed
```

## Building for Production

### Frontend
```bash
cd appointment-scheduler
npm run build
# Deploy dist/ folder to Vercel, Netlify, etc.
```

### Backend
```bash
cd backend
npm run build
# Deploy to Heroku, Railway, Render, etc.
```

### Environment Variables for Production

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret for JWT signing
- `PORT` - Server port (default 3001)
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your frontend domain for CORS

**Frontend:**
- `VITE_API_URL` - Your backend API URL (update in `src/config/api.ts`)

## 🔮 Future Enhancements

Potential features to add:
- Email/SMS notifications for appointments
- Payment integration (Stripe, Square)
- Recurring appointments
- Multi-business/multi-location support
- Calendar export (iCal format)
- Client portal with appointment history
- Staff performance analytics
- Waitlist management
- Automated reminder system
- Review and rating system
- Mobile app (React Native)
- Google Calendar integration

## Troubleshooting

### Database Connection Issues
- Ensure Prisma dev server is running: `npx prisma dev`
- Check `DATABASE_URL` in `.env`

### Authentication Issues
- Verify `JWT_SECRET` is set in backend `.env`
- Check token in browser localStorage
- Token expires after 7 days

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Update CORS configuration in `backend/src/index.ts`

## License

MIT

## Documentation

- [Backend API Documentation](../backend/README.md)
- [Claude Code Session Notes](./CLAUDE.md)
- [Prisma Schema](../backend/prisma/schema.prisma)

## Support

For issues or questions, please open an issue in the repository.
