import React, { useState, useEffect } from 'react';
import { CalendarView, CalendarEvent, Appointment } from '../../types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { formatMonthYear, addMonths, addDays, getWeekDays } from '../../utils/dateUtils';

interface CalendarProps {
  appointments: Appointment[];
  services: any[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour?: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  appointments,
  services,
  onEventClick,
  onTimeSlotClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');

  // Convert appointments to calendar events
  const events: CalendarEvent[] = appointments.map(apt => {
    const service = services.find(s => s.id === apt.serviceId);
    return {
      id: apt.id,
      title: service?.name || 'Appointment',
      startTime: apt.startTime,
      endTime: apt.endTime,
      color: service?.color || '#1a73e8',
      appointment: apt,
    };
  });

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, -1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDateRangeText = () => {
    if (view === 'month') {
      return formatMonthYear(currentDate);
    } else if (view === 'week') {
      const weekDays = getWeekDays(currentDate);
      const start = weekDays[0];
      const end = weekDays[6];
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`;
    } else {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const handleDateClick = (date: Date) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(date);
    }
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(date, hour);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Today
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <h2 className="text-xl font-normal text-gray-900">
            {getDateRangeText()}
          </h2>
        </div>

        {/* View selector */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded p-1">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              view === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              view === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              view === 'day'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1 overflow-hidden">
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={onEventClick}
          />
        )}
        {view === 'week' && (
          <WeekView
            currentDate={currentDate}
            events={events}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={onEventClick}
          />
        )}
        {view === 'day' && (
          <DayView
            currentDate={currentDate}
            events={events}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={onEventClick}
          />
        )}
      </div>
    </div>
  );
};
