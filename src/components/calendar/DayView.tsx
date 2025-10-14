import React from 'react';
import { CalendarEvent } from '../../types';
import { formatDate, isToday } from '../../utils/dateUtils';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onTimeSlotClick,
  onEventClick,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getHours() === hour;
    });
  };

  const isTodayDate = isToday(currentDate);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Date header */}
      <div className="flex items-center justify-center py-4 border-b border-gray-200 bg-white">
        <div className="text-center">
          <div className="text-sm text-gray-600 font-medium uppercase">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <div
            className={`
              text-4xl font-light mt-1
              ${isTodayDate ? 'text-google-blue' : 'text-gray-900'}
            `}
          >
            {currentDate.getDate()}
          </div>
          <div className="text-sm text-gray-600">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {hours.map(hour => {
            const hourEvents = getEventsForHour(hour);
            return (
              <div key={hour} className="flex h-20">
                {/* Hour label */}
                <div className="w-20 flex-shrink-0 pr-4 text-right">
                  <span className="text-xs text-gray-500 -mt-3 inline-block">
                    {formatHour(hour)}
                  </span>
                </div>

                {/* Events column */}
                <div
                  className="flex-1 border-l border-b border-gray-200 relative cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onTimeSlotClick(currentDate, hour)}
                >
                  {/* Events in this time slot */}
                  {hourEvents.map(event => {
                    const startTime = new Date(event.startTime);
                    const endTime = new Date(event.endTime);
                    const durationMinutes = (endTime.getTime() - startTime.getTime()) / 60000;
                    const heightPercent = (durationMinutes / 60) * 100;
                    const offsetMinutes = startTime.getMinutes();
                    const topPercent = (offsetMinutes / 60) * 100;

                    return (
                      <div
                        key={event.id}
                        className="absolute left-2 right-2 rounded px-3 py-2 cursor-pointer hover:opacity-80 shadow-sm"
                        style={{
                          backgroundColor: event.color,
                          top: `${topPercent}%`,
                          height: `${heightPercent}%`,
                          minHeight: '40px',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className="text-white font-medium truncate">
                          {event.title}
                        </div>
                        <div className="text-white text-sm opacity-90">
                          {startTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}{' '}
                          -{' '}
                          {endTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
