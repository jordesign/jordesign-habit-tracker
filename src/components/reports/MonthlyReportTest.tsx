import React from 'react';
import { MonthlyReport } from './MonthlyReport';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const MonthlyReportTest: React.FC = () => {
  const navigate = useNavigate();

  // Generate test data
  const testMetrics = [
    {
      id: '1',
      name: 'Daily Exercise',
      type: 'boolean' as const,
      description: '30 minutes of physical activity',
      entries: Array.from({ length: 60 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        value: Math.random() > 0.3
      }))
    },
    {
      id: '2',
      name: 'Weight',
      type: 'value' as const,
      description: 'Morning weight measurement',
      unit: 'kg',
      entries: Array.from({ length: 60 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        value: 70 + Math.sin(i * 0.1) * 2 + (Math.random() - 0.5)
      }))
    },
    {
      id: '3',
      name: 'Mood',
      type: 'select' as const,
      description: 'Daily mood tracking',
      entries: Array.from({ length: 60 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        value: ['Great', 'Good', 'Neutral', 'Poor'][Math.floor(Math.random() * 4)]
      }))
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/visualizations')}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Monthly Report Test</h1>
      </div>

      <MonthlyReport metrics={testMetrics} />
    </div>
  );
}; 