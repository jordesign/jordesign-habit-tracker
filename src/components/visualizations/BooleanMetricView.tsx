import React, { useState, useMemo } from 'react';
import { 
  startOfMonth, endOfMonth, 
  startOfQuarter, endOfQuarter,
  startOfYear, endOfYear,
  eachDayOfInterval, format,
  isSameDay, isWithinInterval,
  addDays
} from 'date-fns';
import { ChevronDown, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface BooleanMetricViewProps {
  metricName: string;
  metricDescription?: string;
  entries: Array<{
    date: Date;
    value: boolean;
    note?: string;
  }>;
}

type Period = 'MONTH' | 'QUARTER' | 'YEAR';

export const BooleanMetricView: React.FC<BooleanMetricViewProps> = ({
  metricName,
  metricDescription,
  entries
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('MONTH');
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  // Get date range based on selected period
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'MONTH':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          label: format(now, 'MMMM yyyy')
        };
      case 'QUARTER':
        return {
          start: startOfQuarter(now),
          end: endOfQuarter(now),
          label: `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`
        };
      case 'YEAR':
        return {
          start: startOfYear(now),
          end: endOfYear(now),
          label: format(now, 'yyyy')
        };
    }
  }, [selectedPeriod]);

  // Generate days array and calculate statistics
  const { days, stats } = useMemo(() => {
    const daysInRange = eachDayOfInterval(dateRange);
    const completedDays = new Set(
      entries
        .filter(entry => 
          entry.value && 
          isWithinInterval(entry.date, dateRange)
        )
        .map(entry => format(entry.date, 'yyyy-MM-dd'))
    );

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let streakEnd = null;

    for (let i = daysInRange.length - 1; i >= 0; i--) {
      const day = daysInRange[i];
      const isCompleted = completedDays.has(format(day, 'yyyy-MM-dd'));

      if (isCompleted) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          streakEnd = day;
        }
      } else {
        currentStreak = 0;
      }
    }

    return {
      days: daysInRange,
      stats: {
        total: daysInRange.length,
        completed: completedDays.size,
        percentage: (completedDays.size / daysInRange.length) * 100,
        longestStreak,
        streakEnd
      }
    };
  }, [dateRange, entries]);

  // Get entry for a specific day
  const getEntryForDay = (day: Date) => 
    entries.find(entry => isSameDay(entry.date, day));

  // Determine if a day is part of a streak
  const isPartOfStreak = (day: Date) => {
    if (!stats.streakEnd) return false;
    const streakStart = addDays(stats.streakEnd, -(stats.longestStreak - 1));
    return isWithinInterval(day, { start: streakStart, end: stats.streakEnd });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{metricName}</h2>
          {metricDescription && (
            <p className="text-sm text-gray-500 mt-1">{metricDescription}</p>
          )}
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as Period)}
          className="appearance-none bg-white px-4 py-2 pr-8 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="MONTH">Month</option>
          <option value="QUARTER">Quarter</option>
          <option value="YEAR">Year</option>
        </select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Completion Rate</div>
          <div className="text-2xl font-semibold text-gray-900">
            {stats.percentage.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Completed Days</div>
          <div className="text-2xl font-semibold text-gray-900">
            {stats.completed}/{stats.total}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Longest Streak</div>
          <div className="text-2xl font-semibold text-gray-900">
            {stats.longestStreak} days
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Period</div>
          <div className="text-2xl font-semibold text-gray-900">
            {dateRange.label}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Labels */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs text-gray-500 text-center py-2">
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map(day => {
          const entry = getEntryForDay(day);
          const isStreak = isPartOfStreak(day);
          
          return (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className="relative aspect-square"
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div
                className={`
                  w-full h-full rounded-lg flex items-center justify-center
                  ${entry?.value
                    ? isStreak
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-400'}
                  ${hoveredDay && isSameDay(day, hoveredDay)
                    ? 'ring-2 ring-offset-2 ring-blue-500'
                    : ''}
                `}
              >
                {entry?.value ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <XCircle size={20} />
                )}
              </div>

              {/* Tooltip */}
              {hoveredDay && isSameDay(day, hoveredDay) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                  <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 shadow-lg">
                    <div className="font-medium">
                      {format(day, 'MMMM d, yyyy')}
                    </div>
                    <div>
                      {entry?.value ? 'Completed' : 'Not Completed'}
                    </div>
                    {entry?.note && (
                      <div className="text-gray-300 text-xs mt-1">
                        {entry.note}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 