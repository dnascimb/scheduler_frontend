import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Business, Service, StaffMember, BusinessHours } from '../types';
import { businessApi, servicesApi, staffApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'general' | 'services' | 'staff' | 'hours';

export const BusinessSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [businessData, servicesData, staffData] = await Promise.all([
        businessApi.getBusiness(),
        servicesApi.getServices(),
        staffApi.getStaff(),
      ]);
      setBusiness(businessData);
      setServices(servicesData);
      setStaff(staffData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    if (!business) return;

    try {
      await businessApi.updateBusiness(business);

      // Save business hours if needed
      if (business.hours) {
        await businessApi.updateBusinessHours(business.hours);
      }

      setIsEditing(false);
      alert('Business information updated successfully!');
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Failed to update business information');
    }
  };

  const handleSaveService = async () => {
    if (!editingService) return;

    try {
      if (editingService.id.startsWith('new-')) {
        const { id, ...serviceData } = editingService;
        const newService = await servicesApi.createService(serviceData as any);
        setServices([...services, newService]);
      } else {
        const updated = await servicesApi.updateService(editingService.id, editingService);
        setServices(services.map(s => s.id === updated.id ? updated : s));
      }
      setEditingService(null);
      alert('Service saved successfully!');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await servicesApi.deleteService(serviceId);
      setServices(services.filter(s => s.id !== serviceId));
      alert('Service deleted successfully!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const handleSaveStaff = async () => {
    if (!editingStaff) return;

    try {
      if (editingStaff.id.startsWith('new-')) {
        const { id, ...staffData } = editingStaff;
        const newStaff = await staffApi.createStaffMember(staffData as any);
        setStaff([...staff, newStaff]);
      } else {
        const updated = await staffApi.updateStaffMember(editingStaff.id, editingStaff);
        setStaff(staff.map(s => s.id === updated.id ? updated : s));
      }
      setEditingStaff(null);
      alert('Staff member saved successfully!');
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member');
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await staffApi.deleteStaffMember(staffId);
      setStaff(staff.filter(s => s.id !== staffId));
      alert('Staff member deleted successfully!');
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff member');
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/business" className="text-google-blue hover:underline">
              ← Back to Dashboard
            </Link>
            <span className="text-gray-400">|</span>
            <h1 className="text-xl font-semibold text-gray-900">Business Settings</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {[
                { id: 'general', label: 'General Information', icon: '🏢' },
                { id: 'services', label: 'Services', icon: '💼' },
                { id: 'staff', label: 'Staff Members', icon: '👥' },
                { id: 'hours', label: 'Business Hours', icon: '🕐' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${activeTab === tab.id
                      ? 'bg-google-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* General Information Tab */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">General Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-google-blue text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveGeneral}
                        className="px-4 py-2 bg-google-blue text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={business.name}
                      onChange={e => setBusiness({ ...business, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={business.description}
                      onChange={e => setBusiness({ ...business, description: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={business.email}
                        onChange={e => setBusiness({ ...business, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={business.phone}
                        onChange={e => setBusiness({ ...business, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={business.address}
                      onChange={e => setBusiness({ ...business, address: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Services</h2>
                  <button
                    onClick={() => setEditingService({
                      id: `new-${Date.now()}`,
                      name: '',
                      description: '',
                      duration: 60,
                      price: 0,
                      color: '#1a73e8',
                      staffIds: [],
                      isActive: true,
                    })}
                    className="px-4 py-2 bg-google-blue text-white rounded hover:bg-blue-600"
                  >
                    + Add Service
                  </button>
                </div>

                <div className="space-y-4">
                  {services.map(service => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: service.color }}
                            />
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{service.duration} minutes</span>
                            <span>${service.price}</span>
                            <span className={service.isActive ? 'text-green-600' : 'text-red-600'}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingService(service)}
                            className="px-3 py-1 text-sm text-google-blue hover:bg-blue-50 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff Tab */}
            {activeTab === 'staff' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Staff Members</h2>
                  <button
                    onClick={() => setEditingStaff({
                      id: `new-${Date.now()}`,
                      name: '',
                      email: '',
                      phone: '',
                      role: '',
                      color: '#1a73e8',
                      availability: [],
                      isActive: true,
                    })}
                    className="px-4 py-2 bg-google-blue text-white rounded hover:bg-blue-600"
                  >
                    + Add Staff Member
                  </button>
                </div>

                <div className="space-y-4">
                  {staff.map(member => (
                    <div
                      key={member.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: member.color }}
                            >
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>{member.email}</p>
                            <p>{member.phone}</p>
                            <p className={member.isActive ? 'text-green-600' : 'text-red-600'}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                          {member.availability.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs font-medium text-gray-700 mb-1">Availability:</p>
                              <div className="flex flex-wrap gap-2">
                                {member.availability
                                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                                  .map((avail, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">
                                      {getDayName(avail.dayOfWeek).substring(0, 3)}: {avail.startTime} - {avail.endTime}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingStaff(member)}
                            className="px-3 py-1 text-sm text-google-blue hover:bg-blue-50 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Hours Tab */}
            {activeTab === 'hours' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Business Hours</h2>

                <div className="space-y-4">
                  {business.hours.map((hours, index) => (
                    <div key={hours.dayOfWeek} className="flex items-center space-x-4">
                      <div className="w-32">
                        <span className="font-medium text-gray-900">{getDayName(hours.dayOfWeek)}</span>
                      </div>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!hours.isClosed}
                          onChange={e => {
                            const newHours = [...business.hours];
                            newHours[index].isClosed = !e.target.checked;
                            setBusiness({ ...business, hours: newHours });
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600">Open</span>
                      </label>

                      {!hours.isClosed && (
                        <>
                          <input
                            type="time"
                            value={hours.openTime}
                            onChange={e => {
                              const newHours = [...business.hours];
                              newHours[index].openTime = e.target.value;
                              setBusiness({ ...business, hours: newHours });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.closeTime}
                            onChange={e => {
                              const newHours = [...business.hours];
                              newHours[index].closeTime = e.target.value;
                              setBusiness({ ...business, hours: newHours });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded"
                          />
                        </>
                      )}

                      {hours.isClosed && (
                        <span className="text-gray-500">Closed</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSaveGeneral}
                    className="px-6 py-2 bg-google-blue text-white rounded hover:bg-blue-600"
                  >
                    Save Hours
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingService.id.startsWith('new-') ? 'Add Service' : 'Edit Service'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingService.description}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={editingService.duration}
                    onChange={e => setEditingService({ ...editingService, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editingService.price}
                    onChange={e => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={editingService.color}
                  onChange={e => setEditingService({ ...editingService, color: e.target.value })}
                  className="w-full h-10 px-1 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingService.isActive}
                  onChange={e => setEditingService({ ...editingService, isActive: e.target.checked })}
                  className="rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEditingService(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                className="flex-1 px-4 py-2 bg-google-blue text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Edit Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingStaff.id.startsWith('new-') ? 'Add Staff Member' : 'Edit Staff Member'}
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingStaff.name}
                    onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={editingStaff.role}
                    onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingStaff.phone}
                    onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={editingStaff.color}
                    onChange={e => setEditingStaff({ ...editingStaff, color: e.target.value })}
                    className="w-full h-10 px-1 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    checked={editingStaff.isActive}
                    onChange={e => setEditingStaff({ ...editingStaff, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active</label>
                </div>
              </div>

              {/* Availability Schedule */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Weekly Availability</label>
                  <button
                    onClick={() => {
                      const newAvailability = [...editingStaff.availability];
                      // Add availability for the next available day
                      const existingDays = newAvailability.map(a => a.dayOfWeek);
                      const nextDay = [0, 1, 2, 3, 4, 5, 6].find(d => !existingDays.includes(d));
                      if (nextDay !== undefined) {
                        newAvailability.push({
                          dayOfWeek: nextDay,
                          startTime: '09:00',
                          endTime: '17:00',
                        });
                        setEditingStaff({ ...editingStaff, availability: newAvailability });
                      }
                    }}
                    className="text-sm text-google-blue hover:underline"
                  >
                    + Add Day
                  </button>
                </div>

                <div className="space-y-3">
                  {editingStaff.availability.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No availability set. Click "+ Add Day" to add working hours.</p>
                  ) : (
                    editingStaff.availability
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map((avail, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                          <select
                            value={avail.dayOfWeek}
                            onChange={e => {
                              const newAvailability = [...editingStaff.availability];
                              newAvailability[index].dayOfWeek = parseInt(e.target.value);
                              setEditingStaff({ ...editingStaff, availability: newAvailability });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded bg-white"
                          >
                            <option value={0}>Sunday</option>
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                          </select>

                          <input
                            type="time"
                            value={avail.startTime}
                            onChange={e => {
                              const newAvailability = [...editingStaff.availability];
                              newAvailability[index].startTime = e.target.value;
                              setEditingStaff({ ...editingStaff, availability: newAvailability });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded"
                          />

                          <span className="text-gray-500">to</span>

                          <input
                            type="time"
                            value={avail.endTime}
                            onChange={e => {
                              const newAvailability = [...editingStaff.availability];
                              newAvailability[index].endTime = e.target.value;
                              setEditingStaff({ ...editingStaff, availability: newAvailability });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded"
                          />

                          <button
                            onClick={() => {
                              const newAvailability = editingStaff.availability.filter((_, i) => i !== index);
                              setEditingStaff({ ...editingStaff, availability: newAvailability });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                  )}
                </div>

                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tip:</strong> Set specific hours for when this staff member is available to take appointments.
                    This ensures clients can only book during their working hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setEditingStaff(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStaff}
                className="flex-1 px-4 py-2 bg-google-blue text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
