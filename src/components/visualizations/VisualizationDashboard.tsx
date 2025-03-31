import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  ChevronDown 
} from 'lucide-react';
import { 
  startOfMonth, endOfMonth, 
  startOfQuarter, endOfQuarter,
  startOfYear, endOfYear,
  format, eachDayOfInterval 
} from 'date-fns';
import { MetricType } from '../../types/metrics';

// Temporary dummy data
const DUMMY_METRICS = [
  {
    id: '1',
    name: 'Daily Exercise',
    type: MetricType.BOOLEAN,
  },
  {
    id: '2',
    name: 'Steps',
    type: MetricType.VALUE,
    unit: 'steps'
  },
  {
    id: '3',
    name: 'Mood',
    type: MetricType.SELECT,
    options: ['Great', 'Good', 'Okay', 'Bad']
  }
];

// Period selector options
const PERIODS = {
  MONTH: 'Month',
  QUARTER: 'Quarter',
  YEAR: 'Year'
} as const;

type Period = keyof typeof PERIODS;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const VisualizationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('MONTH');
  const metrics = DUMMY_METRICS;

  // Get date range based on selected period
  const getDateRange = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'MONTH':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          format: 'd'
        };
      case 'QUARTER':
        return {
          start: startOfQuarter(now),
          end: endOfQuarter(now),
          format: 'MMM d'
        };
      case 'YEAR':
        return {
          start: startOfYear(now),
          end: endOfYear(now),
          format: 'MMM'
        };
    }
  };

  const dateRange = getDateRange();

  // Group metrics by type
  const metricsByType = metrics.reduce((acc, metric) => {
    if (!acc[metric.type]) {
      acc[metric.type] = [];
    }
    acc[metric.type].push(metric);
    return acc;
  }, {} as Record<MetricType, typeof metrics>);

  // Get data for boolean metrics
  const getBooleanData = (metricId: string) => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1),
      value: Math.random() > 0.5
    }));
  };

  // Get data for value metrics
  const getValueData = (metricId: string) => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: format(new Date(2024, 0, i + 1), 'MMM d'),
      value: Math.floor(Math.random() * 10000)
    }));
  };

  // Get data for select metrics
  const getSelectData = (metricId: string) => {
    return [
      { name: 'Great', value: 10 },
      { name: 'Good', value: 15 },
      { name: 'Okay', value: 8 },
      { name: 'Bad', value: 3 }
    ];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Visualizations</h1>
        </div>

        {/* Period Selector */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as Period)}
            className="appearance-none bg-white px-4 py-2 pr-8 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(PERIODS).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <ChevronDown 
            size={20} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
          />
        </div>
      </div>

      {/* Metrics Sections */}
      <div className="space-y-8">
        {/* Boolean Metrics */}
        {metricsByType[MetricType.BOOLEAN]?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Completion Tracking</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {metricsByType[MetricType.BOOLEAN].map(metric => (
                <div key={metric.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium text-gray-900 mb-4">{metric.name}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={getBooleanData(metric.id)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(date, dateRange.format)}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date) => format(date, 'MMM d, yyyy')}
                        formatter={(value: boolean) => [value ? 'Completed' : 'Not Completed']}
                      />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Value Metrics */}
        {metricsByType[MetricType.VALUE]?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trends</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {metricsByType[MetricType.VALUE].map(metric => (
                <div key={metric.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium text-gray-900 mb-4">{metric.name}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={getValueData(metric.id)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Select Metrics */}
        {metricsByType[MetricType.SELECT]?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribution</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {metricsByType[MetricType.SELECT].map(metric => (
                <div key={metric.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium text-gray-900 mb-4">{metric.name}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getSelectData(metric.id)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {getSelectData(metric.id).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}; 