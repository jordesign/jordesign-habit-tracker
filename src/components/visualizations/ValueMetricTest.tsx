import React from 'react';
import { ValueMetricGraph } from './ValueMetricGraph';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ValueMetricTest: React.FC = () => {
  const navigate = useNavigate();

  // Generate test data with a slight upward trend and some variation
  const testEntries = Array.from({ length: 60 }, (_, i) => {
    const date = new Date(2024, 0, i + 1);
    const trend = i * 0.1; // Slight upward trend
    const variation = Math.sin(i * 0.3) * 5; // Sinusoidal variation
    const random = (Math.random() - 0.5) * 3; // Random noise
    
    return {
      date,
      value: 70 + trend + variation + random, // Base value of 70
      note: Math.random() > 0.8 ? 'Notable measurement' : undefined
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/visualizations')}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Value Metric Graph</h1>
      </div>

      <ValueMetricGraph
        metricName="Body Weight"
        metricDescription="Daily morning weight measurement"
        unit="kg"
        entries={testEntries}
      />
    </div>
  );
}; 