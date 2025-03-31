import React, { useState } from 'react';
import { format, isToday, isFuture, isEqual } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { storageService } from '../../services/storage/StorageService';

interface DateNavigationProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export const DateNavigation: React.FC<DateNavigationProps> = ({
  selectedDate,
  onChange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Get dates that have entries
  const getDatesWithEntries = () => {
    // This is a simplified version - you might want to cache this or handle it differently
    const entries = storageService.getAllEntries();
    const datesWithEntries = new Set(
      entries.map(entry => format(new Date(entry.date), 'yyyy-MM-dd'))
    );
    return datesWithEntries;
  };

  const datesWithEntries = getDatesWithEntries();

  // Custom modifier to show dots under dates with entries
  const modifiers = {
    hasEntry: (date: Date) => 
      datesWithEntries.has(format(date, 'yyyy-MM-dd'))
  };

  // Custom styles for the calendar
  const modifiersStyles = {
    hasEntry: {
      textDecoration: 'underline',
      textDecorationColor: '#3b82f6',
      textDecorationThickness: '2px'
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        {/* Previous Day Button */}
        <button
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 1);
            onChange(newDate);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Previous day"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Date Display and Calendar Trigger */}
        <button
          onClick={() => setIsCalendarOpen(prev => !prev)}
          className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-lg"
        >
          <CalendarIcon size={20} className="text-gray-500" />
          <span className="font-medium">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
          </span>
        </button>

        {/* Next Day Button (disabled for future dates) */}
        <button
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 1);
            if (!isFuture(newDate)) {
              onChange(newDate);
            }
          }}
          disabled={isFuture(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
          className={`p-2 rounded-lg ${
            isFuture(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100'
          }`}
          aria-label="Next day"
        >
          <ChevronRight size={20} />
        </button>

        {/* Today Button (only shown if not on today) */}
        {!isToday(selectedDate) && (
          <button
            onClick={() => onChange(new Date())}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            Today
          </button>
        )}
      </div>

      {/* Calendar Popup */}
      {isCalendarOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date && !isFuture(date)) {
                onChange(date);
                setIsCalendarOpen(false);
              }
            }}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            disabled={[
              { after: new Date() }
            ]}
            showOutsideDays
            className="custom-day-picker"
          />
        </div>
      )}

      {/* Backdrop for closing calendar */}
      {isCalendarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsCalendarOpen(false)}
        />
      )}
    </div>
  );
}; 