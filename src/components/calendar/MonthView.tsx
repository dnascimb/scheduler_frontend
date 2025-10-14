import React from 'react';
import { CalendarEvent } from '../../types';
import { getMonthDays, isSameMonth, isToday, isSameDay } from '../../utils/dateUtils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const days = getMonthDays(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.startTime), date));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map(day => (
          <div
            key={day}
            className="px-2 py-3 text-xs font-medium text-gray-600 text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: '1fr' }}>
        {days.map((date, index) => {
          const dayEvents = getEventsForDay(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              className={`
                border-b border-r border-gray-200 p-2 cursor-pointer
                hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
              `}
              onClick={() => onDateClick(date)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-sm font-medium
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                    ${isTodayDate ? 'bg-google-blue text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}
                  `}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80"
                    style={{
                      backgroundColor: event.color + '20',
                      borderLeft: `3px solid ${event.color}`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {new Date(event.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-1.5">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
