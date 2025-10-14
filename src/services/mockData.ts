import { Business, Appointment, Service, StaffMember, Client } from '../types';

// Mock business data
export const mockBusiness: Business = {
  id: 'business-1',
  name: 'Sunny Spa & Wellness',
  description: 'Your premier destination for relaxation and beauty services',
  email: 'info@sunnyspa.com',
  phone: '(555) 123-4567',
  address: '123 Wellness Ave, Beauty City, BC 12345',
  hours: [
    { dayOfWeek: 0, openTime: '10:00', closeTime: '18:00', isClosed: false },
    { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00', isClosed: false },
    { dayOfWeek: 5, openTime: '09:00', closeTime: '21:00', isClosed: false },
    { dayOfWeek: 6, openTime: '10:00', closeTime: '18:00', isClosed: false },
  ],
  services: [
    {
      id: 'service-1',
      name: 'Deep Tissue Massage',
      description: 'Therapeutic massage targeting deep muscle layers',
      duration: 60,
      price: 120,
      color: '#1a73e8',
      staffIds: ['staff-1', 'staff-2'],
      isActive: true,
    },
    {
      id: 'service-2',
      name: 'Swedish Massage',
      description: 'Relaxing full-body massage',
      duration: 60,
      price: 100,
      color: '#34a853',
      staffIds: ['staff-1', 'staff-2'],
      isActive: true,
    },
    {
      id: 'service-3',
      name: 'Facial Treatment',
      description: 'Rejuvenating facial with organic products',
      duration: 45,
      price: 85,
      color: '#fbbc04',
      staffIds: ['staff-3'],
      isActive: true,
    },
    {
      id: 'service-4',
      name: 'Manicure & Pedicure',
      description: 'Complete nail care treatment',
      duration: 90,
      price: 75,
      color: '#ea4335',
      staffIds: ['staff-3'],
      isActive: true,
    },
    {
      id: 'service-5',
      name: 'Hot Stone Therapy',
      description: 'Massage using heated stones',
      duration: 75,
      price: 140,
      color: '#9334e6',
      staffIds: ['staff-1'],
      isActive: true,
    },
  ],
  staff: [
    {
      id: 'staff-1',
      name: 'Maria Rodriguez',
      email: 'maria@sunnyspa.com',
      phone: '(555) 123-4568',
      role: 'Licensed Massage Therapist',
      color: '#1a73e8',
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
      ],
      isActive: true,
    },
    {
      id: 'staff-2',
      name: 'James Chen',
      email: 'james@sunnyspa.com',
      phone: '(555) 123-4569',
      role: 'Licensed Massage Therapist',
      color: '#34a853',
      availability: [
        { dayOfWeek: 1, startTime: '12:00', endTime: '20:00' },
        { dayOfWeek: 2, startTime: '12:00', endTime: '20:00' },
        { dayOfWeek: 3, startTime: '12:00', endTime: '20:00' },
        { dayOfWeek: 4, startTime: '12:00', endTime: '20:00' },
        { dayOfWeek: 5, startTime: '12:00', endTime: '21:00' },
        { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
      ],
      isActive: true,
    },
    {
      id: 'staff-3',
      name: 'Sarah Johnson',
      email: 'sarah@sunnyspa.com',
      phone: '(555) 123-4570',
      role: 'Esthetician',
      color: '#fbbc04',
      availability: [
        { dayOfWeek: 0, startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '13:00', endTime: '21:00' },
        { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
      ],
      isActive: true,
    },
  ],
  settings: {
    bookingLeadTime: 2,
    cancellationPolicy: 'Free cancellation up to 24 hours before appointment',
    timeZone: 'America/New_York',
    slotDuration: 15,
    bufferTime: 15,
  },
};

// Generate mock appointments
const generateMockAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const today = new Date();

  // Create appointments for the next 30 days
  for (let dayOffset = -7; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);

    // Skip if weekend (for some variation)
    if (date.getDay() === 0 && Math.random() > 0.3) continue;

    // Add 2-5 appointments per day
    const appointmentsPerDay = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < appointmentsPerDay; i++) {
      const service = mockBusiness.services[Math.floor(Math.random() * mockBusiness.services.length)];
      const staff = mockBusiness.staff.find(s => s.id === service.staffIds[0]);

      if (!staff) continue;

      const hour = 9 + Math.floor(Math.random() * 9); // 9 AM to 6 PM
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + service.duration);

      appointments.push({
        id: `appointment-${appointments.length + 1}`,
        businessId: mockBusiness.id,
        serviceId: service.id,
        staffId: staff.id,
        clientId: `client-${Math.floor(Math.random() * 20) + 1}`,
        startTime,
        endTime,
        status: dayOffset < 0 ? 'completed' : 'confirmed',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return appointments.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

export const mockAppointments = generateMockAppointments();

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 234-5678',
    notes: 'Regular customer, prefers morning appointments',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'client-2',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 345-6789',
    notes: '',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'client-3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '(555) 456-7890',
    notes: 'Allergic to lavender oil',
    createdAt: new Date('2024-03-10'),
  },
];
