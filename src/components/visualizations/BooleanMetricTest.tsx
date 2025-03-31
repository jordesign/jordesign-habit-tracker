import React from 'react';
import { BooleanMetricView } from './BooleanMetricView';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BooleanMetricTest: React.FC = () => {
  const navigate = useNavigate();

  // Test data
  const testEntries = Array.from({ length: 60 }, (_, i) => ({
    date: new Date(2024, 0, i + 1),
    value: Math.random() > 0.3,
    note: Math.random() > 0.7 ? 'Test note for this day' : undefined
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/visualizations')}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Boolean Metric View</h1>
      </div>

      <BooleanMetricView
        metricName="Daily Exercise"
        metricDescription="30 minutes of physical activity"
        entries={testEntries}
      />
    </div>
  );
}; 