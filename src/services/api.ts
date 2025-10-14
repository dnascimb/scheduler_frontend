import { Business, Appointment, Service, StaffMember, Client, TimeSlot } from '../types';
import { mockBusiness, mockAppointments, mockClients } from './mockData';

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Business API
export const businessApi = {
  getBusiness: async (id: string): Promise<Business> => {
    await delay(300);
    return mockBusiness;
  },

  updateBusiness: async (id: string, data: Partial<Business>): Promise<Business> => {
    await delay(500);
    return { ...mockBusiness, ...data };
  },
};

// Services API
export const servicesApi = {
  getServices: async (businessId: string): Promise<Service[]> => {
    await delay(300);
    return mockBusiness.services;
  },

  createService: async (businessId: string, service: Omit<Service, 'id'>): Promise<Service> => {
    await delay(500);
    const newService = { ...service, id: `service-${Date.now()}` };
    return newService;
  },

  updateService: async (serviceId: string, data: Partial<Service>): Promise<Service> => {
    await delay(500);
    const service = mockBusiness.services.find(s => s.id === serviceId);
    if (!service) throw new Error('Service not found');
    return { ...service, ...data };
  },

  deleteService: async (serviceId: string): Promise<void> => {
    await delay(500);
  },
};

// Staff API
export const staffApi = {
  getStaff: async (businessId: string): Promise<StaffMember[]> => {
    await delay(300);
    return mockBusiness.staff;
  },

  createStaffMember: async (businessId: string, staff: Omit<StaffMember, 'id'>): Promise<StaffMember> => {
    await delay(500);
    const newStaff = { ...staff, id: `staff-${Date.now()}` };
    return newStaff;
  },

  updateStaffMember: async (staffId: string, data: Partial<StaffMember>): Promise<StaffMember> => {
    await delay(500);
    const staff = mockBusiness.staff.find(s => s.id === staffId);
    if (!staff) throw new Error('Staff member not found');
    return { ...staff, ...data };
  },

  deleteStaffMember: async (staffId: string): Promise<void> => {
    await delay(500);
  },
};

// Appointments API
export const appointmentsApi = {
  getAppointments: async (
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]> => {
    await delay(300);
    return mockAppointments.filter(
      apt => apt.startTime >= startDate && apt.startTime <= endDate
    );
  },

  getAppointment: async (appointmentId: string): Promise<Appointment> => {
    await delay(300);
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (!appointment) throw new Error('Appointment not found');
    return appointment;
  },

  createAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
    await delay(500);
    const newAppointment: Appointment = {
      ...appointment,
      id: `appointment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newAppointment;
  },

  updateAppointment: async (appointmentId: string, data: Partial<Appointment>): Promise<Appointment> => {
    await delay(500);
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (!appointment) throw new Error('Appointment not found');
    return { ...appointment, ...data, updatedAt: new Date() };
  },

  cancelAppointment: async (appointmentId: string): Promise<Appointment> => {
    await delay(500);
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (!appointment) throw new Error('Appointment not found');
    return { ...appointment, status: 'cancelled', updatedAt: new Date() };
  },

  getAvailableSlots: async (
    businessId: string,
    serviceId: string,
    date: Date,
    staffId?: string
  ): Promise<TimeSlot[]> => {
    await delay(300);

    const service = mockBusiness.services.find(s => s.id === serviceId);
    if (!service) return [];

    const staffMembers = staffId
      ? mockBusiness.staff.filter(s => s.id === staffId)
      : mockBusiness.staff.filter(s => service.staffIds.includes(s.id));

    const dayOfWeek = date.getDay();
    const slots: TimeSlot[] = [];

    staffMembers.forEach(staff => {
      const availability = staff.availability.find(a => a.dayOfWeek === dayOfWeek);
      if (!availability) return;

      const [startHour, startMinute] = availability.startTime.split(':').map(Number);
      const [endHour, endMinute] = availability.endTime.split(':').map(Number);

      let currentTime = new Date(date);
      currentTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(endHour, endMinute, 0, 0);

      while (currentTime < endTime) {
        const slotEnd = new Date(currentTime);
        slotEnd.setMinutes(slotEnd.getMinutes() + service.duration);

        if (slotEnd <= endTime) {
          const isBooked = mockAppointments.some(
            apt =>
              apt.staffId === staff.id &&
              apt.startTime <= currentTime &&
              apt.endTime > currentTime
          );

          slots.push({
            startTime: new Date(currentTime),
            endTime: slotEnd,
            isAvailable: !isBooked,
            staffId: staff.id,
          });
        }

        currentTime.setMinutes(currentTime.getMinutes() + mockBusiness.settings.slotDuration);
      }
    });

    return slots;
  },
};

// Clients API
export const clientsApi = {
  getClients: async (businessId: string): Promise<Client[]> => {
    await delay(300);
    return mockClients;
  },

  getClient: async (clientId: string): Promise<Client> => {
    await delay(300);
    const client = mockClients.find(c => c.id === clientId);
    if (!client) throw new Error('Client not found');
    return client;
  },

  createClient: async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    await delay(500);
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: new Date(),
    };
    return newClient;
  },

  updateClient: async (clientId: string, data: Partial<Client>): Promise<Client> => {
    await delay(500);
    const client = mockClients.find(c => c.id === clientId);
    if (!client) throw new Error('Client not found');
    return { ...client, ...data };
  },
};
