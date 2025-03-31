import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onChange }) => {
  const today = new Date();
  const dates = [-2, -1, 0, 1, 2].map(offset => addDays(selectedDate, offset));

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(addDays(selectedDate, -1))}
        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-2">
        {dates.map(date => (
          <button
            key={date.toISOString()}
            onClick={() => onChange(date)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${isSameDay(date, selectedDate)
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}
              ${isSameDay(date, today) && !isSameDay(date, selectedDate)
                ? 'border-primary-600'
                : ''}
            `}
          >
            <div className="text-xs uppercase">{format(date, 'EEE')}</div>
            <div>{format(date, 'd')}</div>
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange(addDays(selectedDate, 1))}
        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Next day"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}; 