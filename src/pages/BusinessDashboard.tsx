import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from '../components/calendar/Calendar';
import { CalendarEvent, Appointment } from '../types';
import { appointmentsApi, businessApi } from '../services/api';
import { mockBusiness } from '../services/mockData';

export const BusinessDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 60);

      const data = await appointmentsApi.getAppointments(
        mockBusiness.id,
        startDate,
        endDate
      );
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleCancelAppointment = async () => {
    if (!selectedEvent?.appointment) return;

    try {
      await appointmentsApi.cancelAppointment(selectedEvent.appointment.id);
      // Reload appointments
      loadAppointments();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleEditClick = () => {
    if (selectedEvent?.appointment) {
      setEditingAppointment({ ...selectedEvent.appointment });
      setIsEditing(true);
    }
  };

  const handleSaveAppointment = async () => {
    if (!editingAppointment) return;

    try {
      await appointmentsApi.updateAppointment(editingAppointment.id, editingAppointment);
      loadAppointments();
      setIsEditing(false);
      setEditingAppointment(null);
      setSelectedEvent(null);
      alert('Appointment updated successfully!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const getClientName = (appointment: Appointment) => {
    // In a real app, you'd fetch client data
    return `Client ${appointment.clientId.split('-')[1]}`;
  };

  const getStaffName = (staffId: string) => {
    const staff = mockBusiness.staff.find(s => s.id === staffId);
    return staff?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {mockBusiness.name}
            </h1>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">Business Dashboard</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/business/settings"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Settings
            </Link>
            <button className="px-4 py-2 text-sm font-medium text-white bg-google-blue rounded hover:bg-blue-600 transition-colors">
              + New Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Calendar
          appointments={appointments}
          services={mockBusiness.services}
          onEventClick={handleEventClick}
        />
      </div>

      {/* Appointment Details/Edit Modal */}
      {selectedEvent && selectedEvent.appointment && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(selectedEvent.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {new Date(selectedEvent.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    -{' '}
                    {new Date(selectedEvent.endTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{getClientName(selectedEvent.appointment)}</span>
                </div>

                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{getStaffName(selectedEvent.appointment.staffId)}</span>
                </div>

                {selectedEvent.appointment.notes && (
                  <div className="flex items-start text-sm">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>{selectedEvent.appointment.notes}</span>
                  </div>
                )}

                <div className="pt-2">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: selectedEvent.color + '20',
                      color: selectedEvent.color,
                    }}
                  >
                    {selectedEvent.appointment.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedEvent.appointment.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-google-blue rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleCancelAppointment}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {isEditing && editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Appointment</h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select
                    value={editingAppointment.serviceId}
                    onChange={e => {
                      const service = mockBusiness.services.find(s => s.id === e.target.value);
                      if (service) {
                        const endTime = new Date(editingAppointment.startTime);
                        endTime.setMinutes(endTime.getMinutes() + service.duration);
                        setEditingAppointment({
                          ...editingAppointment,
                          serviceId: e.target.value,
                          endTime,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {mockBusiness.services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.duration} min - ${service.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
                  <select
                    value={editingAppointment.staffId}
                    onChange={e => setEditingAppointment({ ...editingAppointment, staffId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {mockBusiness.staff.filter(s => s.isActive).map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingAppointment.startTime.toISOString().split('T')[0]}
                    onChange={e => {
                      const newDate = new Date(e.target.value);
                      const currentStart = new Date(editingAppointment.startTime);
                      newDate.setHours(currentStart.getHours(), currentStart.getMinutes());

                      const service = mockBusiness.services.find(s => s.id === editingAppointment.serviceId);
                      const endTime = new Date(newDate);
                      if (service) {
                        endTime.setMinutes(endTime.getMinutes() + service.duration);
                      }

                      setEditingAppointment({
                        ...editingAppointment,
                        startTime: newDate,
                        endTime,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editingAppointment.startTime.toTimeString().substring(0, 5)}
                    onChange={e => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const newStart = new Date(editingAppointment.startTime);
                      newStart.setHours(hours, minutes);

                      const service = mockBusiness.services.find(s => s.id === editingAppointment.serviceId);
                      const endTime = new Date(newStart);
                      if (service) {
                        endTime.setMinutes(endTime.getMinutes() + service.duration);
                      }

                      setEditingAppointment({
                        ...editingAppointment,
                        startTime: newStart,
                        endTime,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingAppointment.status}
                  onChange={e => setEditingAppointment({ ...editingAppointment, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingAppointment.notes}
                  onChange={e => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add any special notes or requirements..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-700">
                  <strong>Duration:</strong> {Math.round((editingAppointment.endTime.getTime() - editingAppointment.startTime.getTime()) / 60000)} minutes
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>End Time:</strong> {editingAppointment.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingAppointment(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAppointment}
                className="flex-1 px-4 py-2 bg-google-blue text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
