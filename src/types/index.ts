export interface Business {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  hours: BusinessHours[];
  services: Service[];
  staff: StaffMember[];
  settings: BusinessSettings;
}

export interface BusinessHours {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  isClosed: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  color: string; // hex color for calendar
  staffIds: string[]; // which staff can perform this service
  isActive: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  color: string; // hex color for calendar
  availability: StaffAvailability[];
  isActive: boolean;
}

export interface StaffAvailability {
  dayOfWeek: number;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface BusinessSettings {
  bookingLeadTime: number; // minimum hours in advance for booking
  cancellationPolicy: string;
  timeZone: string;
  slotDuration: number; // default slot duration in minutes
  bufferTime: number; // buffer between appointments in minutes
}

export interface Appointment {
  id: string;
  businessId: string;
  serviceId: string;
  staffId: string;
  clientId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: Date;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  staffId?: string;
}

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  color: string;
  appointment?: Appointment;
}
