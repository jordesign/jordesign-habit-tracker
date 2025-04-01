import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Label
} from 'recharts';
import { 
  startOfMonth, endOfMonth, 
  startOfQuarter, endOfQuarter,
  startOfYear, endOfYear,
  format, isWithinInterval
} from 'date-fns';
import { TrendingUp, TrendingDown, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ValueMetricGraphProps {
  metricName: string;
  metricDescription?: string;
  unit?: string;
  entries: Array<{
    date: Date;
    value: number;
    note?: string;
  }>;
}

type Period = 'MONTH' | 'QUARTER' | 'YEAR';

export const ValueMetricGraph: React.FC<ValueMetricGraphProps> = ({
  metricName,
  metricDescription,
  unit = '',
  entries
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('MONTH');
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStart, setZoomStart] = useState<number | null>(null);

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

  // Process data and calculate statistics
  const { chartData, stats } = useMemo(() => {
    const filteredEntries = entries.filter(entry => 
      isWithinInterval(entry.date, dateRange)
    ).sort((a, b) => a.date.getTime() - b.date.getTime());

    const values = filteredEntries.map(entry => entry.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Calculate trend
    const trend = filteredEntries.length >= 2 
      ? filteredEntries[filteredEntries.length - 1].value - filteredEntries[0].value
      : 0;

    const formattedData = filteredEntries.map(entry => ({
      timestamp: entry.date.getTime(),
      value: entry.value,
      formattedDate: format(entry.date, 'MMM d, yyyy'),
      note: entry.note
    }));

    return {
      chartData: formattedData,
      stats: { min, max, avg, trend }
    };
  }, [entries, dateRange]);

  // Handle zoom interactions
  const handleMouseDown = (e: any) => {
    if (!isZooming || !e) return;
    setZoomStart(e.activeLabel);
  };

  const handleMouseUp = (e: any) => {
    if (!isZooming || !e || !zoomStart) return;
    const end = e.activeLabel;
    setZoomDomain({
      start: Math.min(zoomStart, end),
      end: Math.max(zoomStart, end)
    });
    setZoomStart(null);
  };

  const resetZoom = () => {
    setZoomDomain(null);
    setIsZooming(false);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{data.formattedDate}</p>
        <p className="text-blue-600">
          {data.value.toFixed(2)} {unit}
        </p>
        {data.note && (
          <p className="text-gray-500 text-sm mt-1">{data.note}</p>
        )}
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
          <button
            onClick={() => setIsZooming(!isZooming)}
            className={`p-2 rounded-lg ${
              isZooming ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isZooming ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
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

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Average</div>
          <div className="text-2xl font-semibold text-gray-900">
            {stats.avg.toFixed(2)} {unit}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Maximum</div>
          <div className="text-2xl font-semibold text-gray-900">
            {stats.max.toFixed(2)} {unit}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Minimum</div>
          <div className="text-2xl font-semibold text-gray-900">
            {stats.min.toFixed(2)} {unit}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500">Trend</div>
          <div className="flex items-center gap-2">
            {stats.trend > 0 ? (
              <TrendingUp className="text-green-500" size={24} />
            ) : stats.trend < 0 ? (
              <TrendingDown className="text-red-500" size={24} />
            ) : (
              <ArrowRight className="text-gray-500" size={24} />
            )}
            <span className="text-2xl font-semibold text-gray-900">
              {Math.abs(stats.trend).toFixed(2)} {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            margin={{ top: 20, right: 30, left: 50, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              domain={zoomDomain ? [zoomDomain.start, zoomDomain.end] : ['auto', 'auto']}
              tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
              type="number"
            />
            <YAxis
              domain={['auto', 'auto']}
            >
              <Label
                value={unit}
                position="left"
                angle={-90}
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference Lines */}
            <ReferenceLine
              y={stats.avg}
              stroke="#666"
              strokeDasharray="3 3"
            >
              <Label value="Average" position="right" />
            </ReferenceLine>

            {/* Zoom Selection Area */}
            {isZooming && zoomStart && (
              <ReferenceArea
                x1={zoomStart}
                x2={chartData[chartData.length - 1].timestamp}
                strokeOpacity={0.3}
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Zoom Controls */}
      {zoomDomain && (
        <div className="flex justify-center mt-4">
          <button
            onClick={resetZoom}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            Reset Zoom
          </button>
        </div>
      )}
    </div>
  );
}; 