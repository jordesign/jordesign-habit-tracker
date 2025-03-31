import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DateSelector } from './DateSelector';
import { MetricGrid } from './MetricGrid';
import { Settings, BarChart3, Book } from 'lucide-react';
import { storageService } from '../../services/storage/StorageService';

export const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const metrics = storageService.getMetrics();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for smoother initialization
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="h-20 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/visualizations')}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Visualizations"
          >
            <BarChart3 size={24} />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-8">
        <DateSelector 
          selectedDate={selectedDate} 
          onChange={setSelectedDate} 
        />
      </div>

      {/* Journal Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/journal/${format(selectedDate, 'yyyy-MM-dd')}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg
                     text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          <Book size={20} />
          <span>View Journal</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <MetricGrid 
        metrics={metrics} 
        selectedDate={selectedDate} 
      />
    </div>
  );
}; 