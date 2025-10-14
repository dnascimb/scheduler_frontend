import React, { useState, useEffect } from 'react';
import { Service, StaffMember, TimeSlot } from '../types';
import { servicesApi, staffApi, appointmentsApi, clientsApi } from '../services/api';
import { mockBusiness } from '../services/mockData';
import { formatDate, formatTime } from '../utils/dateUtils';

export const ClientBooking: React.FC = () => {
  const [step, setStep] = useState<'service' | 'datetime' | 'info' | 'confirm'>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  useEffect(() => {
    loadServices();
    loadStaff();
  }, []);

  const loadServices = async () => {
    try {
      const data = await servicesApi.getServices(mockBusiness.id);
      setServices(data.filter(s => s.isActive));
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadStaff = async () => {
    try {
      const data = await staffApi.getStaff(mockBusiness.id);
      setStaff(data.filter(s => s.isActive));
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const loadAvailableSlots = async (date: Date, serviceId: string) => {
    try {
      setIsLoading(true);
      const slots = await appointmentsApi.getAvailableSlots(
        mockBusiness.id,
        serviceId,
        date
      );
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('datetime');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (selectedService) {
      loadAvailableSlots(date, selectedService.id);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('info');
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedSlot || !selectedDate) return;

    try {
      setIsLoading(true);

      // Create client
      const client = await clientsApi.createClient({
        name: clientInfo.name,
        email: clientInfo.email,
        phone: clientInfo.phone,
        notes: clientInfo.notes,
      });

      // Create appointment
      await appointmentsApi.createAppointment({
        businessId: mockBusiness.id,
        serviceId: selectedService.id,
        staffId: selectedSlot.staffId!,
        clientId: client.id,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: 'confirmed',
        notes: clientInfo.notes,
      });

      setIsBookingComplete(true);
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextSevenDays = () => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const groupSlotsByStaff = () => {
    const grouped: { [staffId: string]: TimeSlot[] } = {};
    availableSlots.filter(s => s.isAvailable).forEach(slot => {
      if (slot.staffId) {
        if (!grouped[slot.staffId]) {
          grouped[slot.staffId] = [];
        }
        grouped[slot.staffId].push(slot);
      }
    });
    return grouped;
  };

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked. A confirmation email has been sent to {clientInfo.email}.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
            <p className="text-sm text-gray-600 mb-1">Service</p>
            <p className="font-medium text-gray-900 mb-3">{selectedService?.name}</p>
            <p className="text-sm text-gray-600 mb-1">Date & Time</p>
            <p className="font-medium text-gray-900">
              {selectedDate && formatDate(selectedDate)}<br />
              {selectedSlot && formatTime(selectedSlot.startTime)}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-google-blue text-white rounded hover:bg-blue-600 transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">{mockBusiness.name}</h1>
          <p className="text-gray-600 mt-1">Book an appointment</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {['Service', 'Date & Time', 'Your Info', 'Confirm'].map((label, index) => {
              const stepNames = ['service', 'datetime', 'info', 'confirm'];
              const currentIndex = stepNames.indexOf(step);
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${isCompleted ? 'bg-google-blue text-white' : ''}
                        ${isActive ? 'bg-google-blue text-white' : ''}
                        ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-600' : ''}
                      `}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-google-blue' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Service Selection */}
        {step === 'service' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-google-blue hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{service.duration} minutes</span>
                    <span className="font-semibold text-gray-900">${service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date & Time Selection */}
        {step === 'datetime' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Select Date & Time</h2>
                <button
                  onClick={() => setStep('service')}
                  className="text-sm text-google-blue hover:underline"
                >
                  Change Service
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select a date</h3>
                <div className="grid grid-cols-7 gap-2">
                  {getNextSevenDays().map(date => {
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateSelect(date)}
                        className={`
                          p-3 rounded-lg border text-center transition-all
                          ${isSelected ? 'border-google-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <div className="text-xs text-gray-500">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          {date.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Available times</h3>
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading available slots...</div>
                  ) : (
                    <div>
                      {Object.entries(groupSlotsByStaff()).map(([staffId, slots]) => {
                        const staffMember = staff.find(s => s.id === staffId);
                        return (
                          <div key={staffId} className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">{staffMember?.name}</p>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                              {slots.slice(0, 12).map((slot, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSlotSelect(slot)}
                                  className="px-3 py-2 text-sm border border-gray-200 rounded hover:border-google-blue hover:bg-blue-50 transition-all"
                                >
                                  {formatTime(slot.startTime)}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Client Info */}
        {step === 'info' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={e => setClientInfo({ ...clientInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={clientInfo.notes}
                  onChange={e => setClientInfo({ ...clientInfo, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setStep('datetime')}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={!clientInfo.name || !clientInfo.email || !clientInfo.phone}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-google-blue rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {step === 'confirm' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Your Booking</h2>
            <div className="space-y-4 mb-6">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-medium text-gray-900">{selectedService?.name}</p>
                <p className="text-sm text-gray-600">{selectedService?.duration} minutes · ${selectedService?.price}</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {selectedDate && formatDate(selectedDate)}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedSlot && `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Information</p>
                <p className="font-medium text-gray-900">{clientInfo.name}</p>
                <p className="text-sm text-gray-600">{clientInfo.email}</p>
                <p className="text-sm text-gray-600">{clientInfo.phone}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('info')}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-google-blue rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
