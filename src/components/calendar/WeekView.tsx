import React from 'react';
import { CalendarEvent } from '../../types';
import { getWeekDays, getHourSlots, getDayName, isSameDay, isToday } from '../../utils/dateUtils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onTimeSlotClick,
  onEventClick,
}) => {
  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, date) && eventDate.getHours() === hour;
    });
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day headers */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="w-16 flex-shrink-0"></div>
        {weekDays.map((date, index) => {
          const isTodayDate = isToday(date);
          return (
            <div
              key={index}
              className="flex-1 text-center py-3 border-l border-gray-200"
            >
              <div className="text-xs text-gray-600 font-medium">
                {getDayName(date, true)}
              </div>
              <div
                className={`
                  text-2xl font-normal mt-1
                  ${isTodayDate ? 'bg-google-blue text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto' : 'text-gray-900'}
                `}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {hours.map(hour => (
            <div key={hour} className="flex h-16">
              {/* Hour label */}
              <div className="w-16 flex-shrink-0 pr-2 text-right">
                <span className="text-xs text-gray-500 -mt-3 inline-block">
                  {formatHour(hour)}
                </span>
              </div>

              {/* Day columns */}
              {weekDays.map((date, dayIndex) => {
                const dayEvents = getEventsForDayAndHour(date, hour);
                return (
                  <div
                    key={dayIndex}
                    className="flex-1 border-l border-b border-gray-200 relative cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onTimeSlotClick(date, hour)}
                  >
                    {/* Events in this time slot */}
                    {dayEvents.map(event => {
                      const startTime = new Date(event.startTime);
                      const endTime = new Date(event.endTime);
                      const durationMinutes = (endTime.getTime() - startTime.getTime()) / 60000;
                      const heightPercent = (durationMinutes / 60) * 100;
                      const offsetMinutes = startTime.getMinutes();
                      const topPercent = (offsetMinutes / 60) * 100;

                      return (
                        <div
                          key={event.id}
                          className="absolute inset-x-1 rounded px-1 py-0.5 text-xs overflow-hidden cursor-pointer hover:opacity-80"
                          style={{
                            backgroundColor: event.color,
                            top: `${topPercent}%`,
                            height: `${heightPercent}%`,
                            minHeight: '20px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                        >
                          <div className="text-white font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-white text-xs opacity-90 truncate">
                            {startTime.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
