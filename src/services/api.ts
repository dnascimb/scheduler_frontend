import { Business, Appointment, Service, StaffMember, Client, TimeSlot } from '../types';
import { apiRequest } from '../config/api';

// Business API
export const businessApi = {
  getBusiness: async (): Promise<Business> => {
    return apiRequest<Business>('/business');
  },

  updateBusiness: async (data: Partial<Business>): Promise<Business> => {
    return apiRequest<Business>('/business', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateBusinessHours: async (hours: any[]): Promise<any> => {
    return apiRequest('/business/hours', {
      method: 'PUT',
      body: JSON.stringify({ hours }),
    });
  },
};

// Services API
export const servicesApi = {
  getServices: async (): Promise<Service[]> => {
    return apiRequest<Service[]>('/services');
  },

  createService: async (service: Omit<Service, 'id'>): Promise<Service> => {
    return apiRequest<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  },

  updateService: async (serviceId: string, data: Partial<Service>): Promise<Service> => {
    return apiRequest<Service>(`/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteService: async (serviceId: string): Promise<void> => {
    return apiRequest<void>(`/services/${serviceId}`, {
      method: 'DELETE',
    });
  },
};

// Staff API
export const staffApi = {
  getStaff: async (): Promise<StaffMember[]> => {
    return apiRequest<StaffMember[]>('/staff');
  },

  createStaffMember: async (staff: Omit<StaffMember, 'id'>): Promise<StaffMember> => {
    return apiRequest<StaffMember>('/staff', {
      method: 'POST',
      body: JSON.stringify(staff),
    });
  },

  updateStaffMember: async (staffId: string, data: Partial<StaffMember>): Promise<StaffMember> => {
    return apiRequest<StaffMember>(`/staff/${staffId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteStaffMember: async (staffId: string): Promise<void> => {
    return apiRequest<void>(`/staff/${staffId}`, {
      method: 'DELETE',
    });
  },
};

// Appointments API
export const appointmentsApi = {
  getAppointments: async (
    startDate?: Date,
    endDate?: Date
  ): Promise<Appointment[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    const query = params.toString() ? `?${params.toString()}` : '';
    const appointments = await apiRequest<any[]>(`/appointments${query}`);

    // Convert date strings to Date objects
    return appointments.map(apt => ({
      ...apt,
      startTime: new Date(apt.startTime),
      endTime: new Date(apt.endTime),
      createdAt: new Date(apt.createdAt),
      updatedAt: new Date(apt.updatedAt),
    }));
  },

  getAppointment: async (appointmentId: string): Promise<Appointment> => {
    const appointment = await apiRequest<any>(`/appointments/${appointmentId}`);
    return {
      ...appointment,
      startTime: new Date(appointment.startTime),
      endTime: new Date(appointment.endTime),
      createdAt: new Date(appointment.createdAt),
      updatedAt: new Date(appointment.updatedAt),
    };
  },

  createAppointment: async (appointment: {
    serviceId: string;
    staffId: string;
    clientId?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    startTime: Date;
    endTime: Date;
    notes?: string;
  }): Promise<Appointment> => {
    const created = await apiRequest<any>('/appointments', {
      method: 'POST',
      body: JSON.stringify({
        ...appointment,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
      }),
    });

    return {
      ...created,
      startTime: new Date(created.startTime),
      endTime: new Date(created.endTime),
      createdAt: new Date(created.createdAt),
      updatedAt: new Date(created.updatedAt),
    };
  },

  updateAppointment: async (appointmentId: string, data: Partial<Appointment>): Promise<Appointment> => {
    const updateData: any = { ...data };
    if (data.startTime) updateData.startTime = data.startTime.toISOString();
    if (data.endTime) updateData.endTime = data.endTime.toISOString();

    const updated = await apiRequest<any>(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    return {
      ...updated,
      startTime: new Date(updated.startTime),
      endTime: new Date(updated.endTime),
      createdAt: new Date(updated.createdAt),
      updatedAt: new Date(updated.updatedAt),
    };
  },

  cancelAppointment: async (appointmentId: string): Promise<Appointment> => {
    const cancelled = await apiRequest<any>(`/appointments/${appointmentId}`, {
      method: 'DELETE',
    });

    return {
      ...cancelled,
      startTime: new Date(cancelled.startTime),
      endTime: new Date(cancelled.endTime),
      createdAt: new Date(cancelled.createdAt),
      updatedAt: new Date(cancelled.updatedAt),
    };
  },

  getAvailableSlots: async (
    serviceId: string,
    staffId: string,
    date: Date
  ): Promise<string[]> => {
    const params = new URLSearchParams({
      serviceId,
      staffId,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
    });

    return apiRequest<string[]>(`/appointments/available-slots?${params.toString()}`);
  },
};

// Clients API
export const clientsApi = {
  getClients: async (): Promise<Client[]> => {
    const clients = await apiRequest<any[]>('/clients');
    return clients.map(client => ({
      ...client,
      createdAt: new Date(client.createdAt),
    }));
  },

  getClient: async (clientId: string): Promise<Client> => {
    const client = await apiRequest<any>(`/clients/${clientId}`);
    return {
      ...client,
      createdAt: new Date(client.createdAt),
    };
  },

  createClient: async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    const created = await apiRequest<any>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });

    return {
      ...created,
      createdAt: new Date(created.createdAt),
    };
  },

  updateClient: async (clientId: string, data: Partial<Client>): Promise<Client> => {
    const updated = await apiRequest<any>(`/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return {
      ...updated,
      createdAt: new Date(updated.createdAt),
    };
  },
};
