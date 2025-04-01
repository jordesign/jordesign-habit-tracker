import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  format,
  isWithinInterval,
  eachMonthOfInterval
} from 'date-fns';
import { PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';

interface SelectMetricViewProps {
  metricName: string;
  metricDescription?: string;
  options: string[];
  entries: Array<{
    date: Date;
    value: string;
    note?: string;
  }>;
}

type Period = 'MONTH' | 'QUARTER' | 'YEAR';
type ViewMode = 'PIE' | 'TIME';

// Generate consistent colors for options
const generateColors = (count: number) => {
  const baseColors = [
    '#2563eb', // blue-600
    '#16a34a', // green-600
    '#dc2626', // red-600
    '#9333ea', // purple-600
    '#ea580c', // orange-600
    '#0891b2', // cyan-600
    '#4f46e5', // indigo-600
    '#be123c', // rose-600
  ];

  // For more than 8 options, generate additional colors by adjusting lightness
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  const colors = [...baseColors];
  while (colors.length < count) {
    const index = colors.length % baseColors.length;
    const hslColor = baseColors[index];
    // Add variations of the base colors
    colors.push(hslColor + '99'); // More transparent version
  }
  return colors;
};

export const SelectMetricView: React.FC<SelectMetricViewProps> = ({
  metricName,
  metricDescription,
  options,
  entries
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('MONTH');
  const [viewMode, setViewMode] = useState<ViewMode>('PIE');
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const colors = useMemo(() => generateColors(options.length), [options]);

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

  // Process data for visualizations
  const { pieData, timeData, totalEntries } = useMemo(() => {
    const filteredEntries = entries.filter(entry =>
      isWithinInterval(entry.date, dateRange)
    );

    // Calculate overall distribution
    const distribution = options.reduce((acc, option) => {
      const count = filteredEntries.filter(entry => entry.value === option).length;
      acc[option] = count;
      return acc;
    }, {} as Record<string, number>);

    const pieData = options.map(option => ({
      name: option,
      value: distribution[option] || 0,
      percentage: (distribution[option] || 0) / filteredEntries.length * 100
    }));

    // Calculate time-based distribution
    const months = eachMonthOfInterval(dateRange);
    const timeData = months.map(month => {
      const monthEntries = filteredEntries.filter(entry =>
        isWithinInterval(entry.date, {
          start: startOfMonth(month),
          end: endOfMonth(month)
        })
      );

      const monthData: any = {
        month: format(month, 'MMM yyyy'),
      };

      options.forEach(option => {
        monthData[option] = monthEntries.filter(entry => 
          entry.value === option
        ).length;
      });

      return monthData;
    });

    return {
      pieData,
      timeData,
      totalEntries: filteredEntries.length
    };
  }, [entries, dateRange, options]);

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-gray-600">
          Count: {data.value}
        </p>
        <p className="text-gray-600">
          Percentage: {data.percentage.toFixed(1)}%
        </p>
      </div>
    );
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
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setViewMode('PIE')}
              className={`p-2 rounded ${
                viewMode === 'PIE'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PieChartIcon size={20} />
            </button>
            <button
              onClick={() => setViewMode('TIME')}
              className={`p-2 rounded ${
                viewMode === 'TIME'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChartIcon size={20} />
            </button>
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
      </div>

      {/* Distribution Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Total Entries</div>
          <div className="text-2xl font-semibold text-gray-900">
            {totalEntries}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Unique Options</div>
          <div className="text-2xl font-semibold text-gray-900">
            {options.length}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Most Common</div>
          <div className="text-2xl font-semibold text-gray-900">
            {pieData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Period</div>
          <div className="text-2xl font-semibold text-gray-900">
            {dateRange.label}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          {viewMode === 'PIE' ? (
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  name
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return value ? (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                    >
                      {`${name} (${value})`}
                    </text>
                  ) : null;
                }}
                onMouseEnter={(_, index) => {
                  setSelectedSlice(pieData[index].name);
                }}
                onMouseLeave={() => {
                  setSelectedSlice(null);
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={colors[index % colors.length]}
                    opacity={selectedSlice === null || selectedSlice === entry.name ? 1 : 0.3}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {options.map((option, index) => (
                <Bar
                  key={option}
                  dataKey={option}
                  stackId="a"
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Option List */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pieData.map((option, index) => (
          <div
            key={option.name}
            className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3"
            onMouseEnter={() => setSelectedSlice(option.name)}
            onMouseLeave={() => setSelectedSlice(null)}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <div>
              <div className="font-medium text-gray-900">{option.name}</div>
              <div className="text-sm text-gray-500">
                {option.value} ({option.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 