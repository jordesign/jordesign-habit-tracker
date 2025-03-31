import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MetricForm } from './MetricForm';
import type { MetricType, ReportingPeriod } from '../../types/metrics';

export const AddMetricPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: {
    name: string;
    icon: string;
    type: MetricType;
    reportingPeriod: ReportingPeriod;
    unit?: string;
    minValue?: number;
    maxValue?: number;
    precision?: number;
    options?: string[];
  }) => {
    // TODO: Save metric using storage service
    console.log('Form submitted:', data);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Metric</h1>
      </div>
      
      <MetricForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}; 