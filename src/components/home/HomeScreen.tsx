import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Settings, BarChart3, Plus } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const [selectedDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/visualizations')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
          >
            <BarChart3 size={24} />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>
      <div className="bg-blue-100 p-4 rounded-lg">
        <p className="text-2xl">Test Content</p>
      </div>
      <button
        onClick={() => navigate('/metrics/new')}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}; 