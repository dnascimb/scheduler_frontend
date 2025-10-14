# Claude Code Session Documentation

This document provides context about how this appointment scheduler was built and how to work with it using Claude Code.

## Project Overview

This is a Google Calendar-style appointment booking system built for small businesses. It was created using Claude Code in a single session, focusing on best practices for React, TypeScript, and modern web development.

## Architecture Decisions

### Technology Stack
- **React 18 + TypeScript**: Chosen for type safety and modern React features
- **Vite**: Fast development server and build tool
- **Tailwind CSS v3**: Utility-first CSS with Google Calendar color palette
- **React Router v7**: Client-side routing for multiple pages
- **Mock API Layer**: Simulates backend calls with realistic delays

### Project Structure
```
src/
├── components/
│   └── calendar/          # Reusable calendar components
├── pages/                 # Full page components
│   ├── BusinessDashboard  # Main business interface
│   ├── BusinessSettings   # Configuration interface
│   └── ClientBooking      # Client-facing booking flow
├── services/
│   ├── api.ts            # API abstraction layer
│   └── mockData.ts       # Sample business data
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Key Features Implemented

### 1. Calendar System
- **Three View Types**: Month, Week, and Day views
- **Event Rendering**: Smart positioning and color coding
- **Navigation**: Date navigation with Today button
- **Click Handling**: Click events for time slots and appointments

### 2. Business Management
- **Settings Page**: Tabbed interface for configuration
  - General business info
  - Service management (CRUD operations)
  - Staff management with availability
  - Business hours per day
- **Staff Availability**: Each staff member has unique working hours by day of week
- **Color Coding**: Visual identification for services and staff

### 3. Appointment Management
- **View**: Click appointments to see details
- **Edit**: Full editing modal with:
  - Service selection (auto-updates duration)
  - Staff assignment
  - Date/time modification
  - Status updates
  - Notes
- **Cancel**: Soft delete with status change

### 4. Client Booking Flow
- **Multi-step Process**: Service → Date/Time → Info → Confirmation
- **Smart Availability**: Only shows slots when:
  - Staff member is working
  - No existing appointment conflicts
  - Within business hours
- **Real-time Calculation**: Dynamic slot generation

## Working with This Codebase

### Adding New Features

**To add a new service:**
1. Go to `/business/settings`
2. Click the Services tab
3. Click "+ Add Service"
4. Fill in details and save

**To add a new staff member:**
1. Go to `/business/settings`
2. Click the Staff Members tab
3. Click "+ Add Staff Member"
4. Set their availability schedule

**To modify mock data:**
Edit `src/services/mockData.ts`:
- `mockBusiness`: Business configuration
- `mockAppointments`: Pre-generated appointments
- `mockClients`: Sample client data

### Connecting to a Real Backend

Replace the mock API in `src/services/api.ts`:

```typescript
// Before (Mock)
export const appointmentsApi = {
  getAppointments: async (...) => {
    await delay(300);
    return mockAppointments.filter(...);
  }
}

// After (Real API)
export const appointmentsApi = {
  getAppointments: async (businessId, startDate, endDate) => {
    const response = await fetch(`/api/appointments?businessId=${businessId}&start=${startDate}&end=${endDate}`);
    return response.json();
  }
}
```

### TypeScript Types

All types are defined in `src/types/index.ts`:
- `Business`: Main business entity
- `Service`: Bookable service with duration and price
- `StaffMember`: Staff with availability schedule
- `Appointment`: Booking record
- `Client`: Customer information
- `BusinessHours`: Operating hours per day
- `StaffAvailability`: Working hours per staff member

### Date Utilities

`src/utils/dateUtils.ts` provides:
- `getMonthDays()`: Generate calendar grid
- `getWeekDays()`: Get week date range
- `formatDate()`, `formatTime()`: Display formatting
- `isSameDay()`, `isToday()`: Date comparisons
- `timeStringToDate()`: Convert time strings to dates
- `getTimeSlots()`: Generate available time slots

## Known Patterns

### State Management
- Uses React `useState` for local state
- No global state management (Redux, Zustand) needed for this scope
- API calls trigger re-fetches to update UI

### Form Handling
- Direct state updates with `onChange` handlers
- No form library (Formik, React Hook Form) for simplicity
- Validation is minimal (can be enhanced)

### Modal Pattern
```typescript
const [isEditing, setIsEditing] = useState(false);
const [editingItem, setEditingItem] = useState<Item | null>(null);

// Open modal
setEditingItem(item);
setIsEditing(true);

// Close modal
setIsEditing(false);
setEditingItem(null);
```

### API Call Pattern
```typescript
const handleSave = async () => {
  try {
    await api.update(id, data);
    loadData(); // Refresh
    closeModal();
    alert('Success!');
  } catch (error) {
    console.error(error);
    alert('Failed!');
  }
};
```

## Styling Conventions

### Tailwind Classes
- Consistent spacing: `px-4 py-2` for buttons
- Colors from `tailwind.config.js`:
  - `bg-google-blue`: Primary action buttons
  - `text-gray-600`: Secondary text
  - `border-gray-200`: Dividers
- Hover states: `hover:bg-blue-600`
- Transitions: `transition-colors`

### Component Layout
- Flexbox for layouts: `flex items-center justify-between`
- Grid for forms: `grid grid-cols-2 gap-4`
- Full-height containers: `h-screen` or `min-h-screen`

## Testing Approach

Currently no automated tests. To add testing:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Suggested test coverage:
1. Date utility functions
2. Calendar rendering with mock data
3. Booking flow validation
4. Staff availability calculations

## Performance Considerations

- Calendar views can render many DOM elements
- Consider virtualization for large month views
- Memo-ize expensive calculations
- Lazy load calendar components if needed

## Deployment

**Build for production:**
```bash
npm run build
```

**Deploy to:**
- Vercel: `vercel deploy`
- Netlify: Drag & drop `dist` folder
- AWS S3 + CloudFront: Upload `dist` to S3
- Any static hosting service

**Environment Variables:**
Create `.env` for API endpoints:
```
VITE_API_URL=https://your-api.com
```

## Common Issues & Solutions

### TypeScript Strict Mode
The project uses relaxed TypeScript settings. To enable strict mode:
1. Update `tsconfig.app.json`
2. Add `import type` for type-only imports
3. Fix `noUnusedLocals` warnings

### Tailwind Not Working
1. Check `tailwind.config.js` content paths
2. Ensure `@tailwind` directives in `index.css`
3. Restart dev server

### Date Issues
- All dates should be stored as Date objects
- Convert to/from ISO strings for API
- Use `dateUtils` for consistent formatting

## Next Steps for Development

1. **Authentication**: Add user login for business owners
2. **Database**: Connect to PostgreSQL/MongoDB
3. **Email**: Integrate SendGrid/AWS SES for notifications
4. **Payments**: Add Stripe for deposits/payments
5. **Mobile App**: Consider React Native version
6. **Testing**: Add unit and integration tests
7. **Analytics**: Track booking conversion rates

## Claude Code Tips

When working with Claude Code on this project:

- **Searching**: Use Grep tool to find where features are implemented
- **Editing**: Use Edit tool for targeted changes (preserves formatting)
- **Type Changes**: Update `src/types/index.ts` first, then fix errors
- **New Features**: Follow existing patterns (modal, API call, refresh)
- **Debugging**: Check browser console and Network tab for API calls

## Contact & Contribution

This project was built as a demonstration of modern React development practices. Feel free to:
- Fork and customize for your business
- Submit pull requests for improvements
- Open issues for bugs or feature requests
- Use as a learning resource

## License

MIT - Free to use and modify for any purpose.
