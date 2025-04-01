import React from 'react';
import { SelectMetricView } from './SelectMetricView';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const SelectMetricTest: React.FC = () => {
  const navigate = useNavigate();

  // Test data
  const options = ['Great', 'Good', 'Neutral', 'Poor', 'Bad'];
  const testEntries = Array.from({ length: 60 }, (_, i) => ({
    date: new Date(2024, 0, i + 1),
    value: options[Math.floor(Math.random() * options.length)],
    note: Math.random() > 0.8 ? 'Notable day' : undefined
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
        <h1 className="text-2xl font-bold text-gray-900">Select Metric View</h1>
      </div>

      <SelectMetricView
        metricName="Mood Tracking"
        metricDescription="Daily mood assessment"
        options={options}
        entries={testEntries}
      />
    </div>
  );
}; 