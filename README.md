# Appointment Scheduler - Google Calendar Style

A modern, Google Calendar-inspired appointment booking system built for small businesses. This application provides both a business dashboard for managing appointments and a client-facing booking interface.

Perfect for salons, spas, medical practices, consulting firms, and any service-based business that needs appointment scheduling.

## ✨ Features

### Business Dashboard (`/business`)
- **📅 Calendar Views**: Month, Week, and Day views with Google Calendar styling
- **✏️ Appointment Management**: View, edit, cancel, and manage all appointments
- **🔧 Settings Dashboard**: Comprehensive business configuration
  - General business information
  - Service management (add, edit, delete services)
  - Staff member management with individual availability schedules
  - Business hours configuration
- **👥 Staff Availability**: Each staff member can have unique working hours by day of week
- **🎨 Color Coding**: Visual service and staff identification with custom colors
- **⚡ Real-time Updates**: Mock API with realistic delays

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

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Mock API** with realistic data and delays

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd appointment-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5174
```

## Project Structure

```
src/
├── components/
│   ├── calendar/         # Calendar components (Month, Week, Day views)
│   │   ├── Calendar.tsx  # Main calendar component
│   │   ├── MonthView.tsx
│   │   ├── WeekView.tsx
│   │   └── DayView.tsx
│   ├── business/         # Business-specific components
│   ├── client/           # Client-specific components
│   └── shared/           # Shared components
├── pages/
│   ├── BusinessDashboard.tsx  # Business calendar/dashboard
│   └── ClientBooking.tsx      # Client booking flow
├── services/
│   ├── api.ts           # Mock API service layer
│   └── mockData.ts      # Sample business data
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   └── dateUtils.ts     # Date manipulation utilities
├── App.tsx              # Main app with routing
└── main.tsx             # App entry point
```

## 🚀 Usage Guide

### Business Dashboard (`/business`)

**Managing Appointments:**
- View appointments in Month, Week, or Day view
- Click on any appointment to view details
- Edit appointment details (service, staff, date, time, status, notes)
- Cancel appointments
- Navigate through dates using the calendar controls

**Accessing Settings:**
1. Click "Settings" in the top navigation
2. Configure your business:
   - **General**: Business name, contact info, address
   - **Services**: Add/edit services with duration, price, and color
   - **Staff**: Add staff members with individual availability schedules
   - **Hours**: Set business operating hours for each day

**Staff Availability Management:**
- Each staff member can have different working hours
- Set availability by day of week (e.g., Mon-Fri 9AM-5PM, Sat 10AM-2PM)
- Add multiple time blocks per staff member
- Clients can only book during staff working hours

### Client Booking (`/book`)
1. **Select Service**: Choose from available services with prices and durations
2. **Pick Date & Time**:
   - Select a date from the next 14 days
   - View available time slots organized by staff member
   - Slots automatically respect staff availability and existing bookings
3. **Enter Information**: Provide name, email, phone, and optional notes
4. **Confirm**: Review all details and confirm your appointment

## Mock Data

The application includes realistic mock data:
- **Business**: Sunny Spa & Wellness
- **Services**: 5 different services (massages, facials, nail care)
- **Staff**: 3 staff members with different schedules
- **Appointments**: Auto-generated appointments for the past week and next 30 days

## Customization

### Adding New Services
Edit `src/services/mockData.ts` to add services to the `mockBusiness.services` array.

### Modifying Business Hours
Update the `mockBusiness.hours` array in `src/services/mockData.ts`.

### Changing Colors
The app uses Google's color palette, defined in `tailwind.config.js`. Modify the `colors.google` section to change the color scheme.

## Backend Integration

This is a frontend-only implementation with a mock API. To connect to a real backend:

1. Replace the functions in `src/services/api.ts` with actual API calls
2. Update the API endpoints to match your backend
3. Remove the mock delay functions
4. Handle authentication and authorization as needed

## 🎯 Key Use Cases

This scheduler is ideal for:
- **Salons & Spas**: Different stylists/therapists with varying schedules
- **Medical Practices**: Multiple doctors/practitioners with different specialties
- **Consulting**: Individual consultants with unique availability
- **Fitness Studios**: Personal trainers with different time slots
- **Service Businesses**: Any business requiring staff-specific appointment booking

## 🔮 Future Enhancements

Potential features to add:
- Email/SMS notifications for appointments
- Calendar export (iCal format)
- Multi-business/multi-location support
- Payment integration (Stripe, Square)
- Recurring appointments
- Client history and notes
- Staff performance analytics and reports
- Waitlist management
- Online payment processing
- Custom appointment types and pricing
- Automated reminders
- Review and rating system

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to deploy to any static hosting service.

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
