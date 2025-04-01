import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval
} from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Award,
  AlertTriangle,
  Download,
  Share2
} from 'lucide-react';

interface MetricSummary {
  id: string;
  name: string;
  type: 'boolean' | 'value' | 'select';
  description?: string;
  unit?: string;
  entries: Array<{
    date: Date;
    value: any;
    note?: string;
  }>;
}

interface MonthlyReportProps {
  metrics: MetricSummary[];
  month?: Date; // Defaults to current month
}

export const MonthlyReport: React.FC<MonthlyReportProps> = ({
  metrics,
  month = new Date()
}) => {
  const dateRange = useMemo(() => ({
    current: {
      start: startOfMonth(month),
      end: endOfMonth(month)
    },
    previous: {
      start: startOfMonth(subMonths(month, 1)),
      end: endOfMonth(subMonths(month, 1))
    }
  }), [month]);

  // Process metrics data
  const metricAnalysis = useMemo(() => {
    return metrics.map(metric => {
      const currentEntries = metric.entries.filter(entry =>
        isWithinInterval(entry.date, dateRange.current)
      );
      const previousEntries = metric.entries.filter(entry =>
        isWithinInterval(entry.date, dateRange.previous)
      );

      const analysis = {
        ...metric,
        current: {
          entries: currentEntries,
          sparklineData: [],
          stats: {} as any
        },
        previous: {
          entries: previousEntries,
          stats: {} as any
        },
        trend: 0,
        achievements: [] as string[],
        improvements: [] as string[]
      };

      // Generate sparkline data
      analysis.current.sparklineData = eachDayOfInterval(dateRange.current)
        .map(date => {
          const entry = currentEntries.find(e => isSameDay(e.date, date));
          return {
            date,
            value: entry?.value || null
          };
        });

      // Calculate type-specific statistics
      switch (metric.type) {
        case 'boolean':
          const currentCompletionRate = currentEntries.filter(e => e.value).length / 
            eachDayOfInterval(dateRange.current).length;
          const previousCompletionRate = previousEntries.filter(e => e.value).length / 
            eachDayOfInterval(dateRange.previous).length;

          analysis.current.stats = {
            completionRate: currentCompletionRate,
            streak: calculateStreak(currentEntries)
          };
          analysis.previous.stats = {
            completionRate: previousCompletionRate
          };
          analysis.trend = currentCompletionRate - previousCompletionRate;

          // Achievements/Improvements
          if (currentCompletionRate > previousCompletionRate) {
            analysis.achievements.push('Improved completion rate');
          }
          if (currentCompletionRate < 0.7) {
            analysis.improvements.push('Work on consistency');
          }
          break;

        case 'value':
          const currentValues = currentEntries.map(e => e.value);
          const previousValues = previousEntries.map(e => e.value);

          analysis.current.stats = {
            average: average(currentValues),
            min: Math.min(...currentValues),
            max: Math.max(...currentValues)
          };
          analysis.previous.stats = {
            average: average(previousValues)
          };
          analysis.trend = analysis.current.stats.average - analysis.previous.stats.average;

          // Achievements/Improvements
          if (analysis.trend > 0) {
            analysis.achievements.push('Improved average');
          }
          break;

        case 'select':
          const currentDistribution = getDistribution(currentEntries);
          const previousDistribution = getDistribution(previousEntries);

          analysis.current.stats = {
            distribution: currentDistribution,
            mostCommon: Object.entries(currentDistribution)
              .sort(([,a], [,b]) => b - a)[0]?.[0]
          };
          analysis.previous.stats = {
            distribution: previousDistribution
          };
          break;
      }

      return analysis;
    });
  }, [metrics, dateRange]);

  const generatePDF = () => {
    // Implement PDF generation logic
    console.log('Generating PDF...');
  };

  const shareReport = () => {
    // Implement share logic
    console.log('Sharing report...');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Monthly Summary Report
          </h1>
          <p className="text-gray-500">
            {format(dateRange.current.start, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 
                     hover:bg-blue-50 rounded-lg"
          >
            <Download size={20} />
            Export PDF
          </button>
          <button
            onClick={shareReport}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 
                     hover:bg-blue-50 rounded-lg"
          >
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metricAnalysis.map(metric => (
          <div
            key={metric.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 
                     transition-colors duration-200"
          >
            {/* Metric Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {metric.name}
                </h3>
                {metric.description && (
                  <p className="text-sm text-gray-500">{metric.description}</p>
                )}
              </div>
              {metric.trend !== 0 && (
                <div className={`flex items-center gap-1 ${
                  metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend > 0 ? (
                    <TrendingUp size={20} />
                  ) : (
                    <TrendingDown size={20} />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(metric.trend * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {/* Metric Content */}
            <div className="space-y-4">
              {/* Statistics */}
              {metric.type === 'boolean' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Completion Rate</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {(metric.current.stats.completionRate * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Current Streak</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {metric.current.stats.streak} days
                    </div>
                  </div>
                </div>
              )}

              {metric.type === 'value' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Average</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {metric.current.stats.average?.toFixed(1)} {metric.unit}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Min</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {metric.current.stats.min?.toFixed(1)} {metric.unit}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-500">Max</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {metric.current.stats.max?.toFixed(1)} {metric.unit}
                    </div>
                  </div>
                </div>
              )}

              {metric.type === 'select' && (
                <div className="h-[100px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={Object.entries(metric.current.stats.distribution || {})
                          .map(([name, value]) => ({ name, value }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={40}
                        fill="#2563eb"
                      >
                        {Object.entries(metric.current.stats.distribution || {})
                          .map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={[
                                '#2563eb',
                                '#16a34a',
                                '#dc2626',
                                '#9333ea',
                              ][index % 4]}
                            />
                          ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Sparkline */}
              <div className="h-[60px]">
                <ResponsiveContainer>
                  <LineChart data={metric.current.sparklineData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Achievements & Improvements */}
              {(metric.achievements.length > 0 || metric.improvements.length > 0) && (
                <div className="space-y-2">
                  {metric.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-green-600"
                    >
                      <Award size={16} />
                      {achievement}
                    </div>
                  ))}
                  {metric.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-amber-600"
                    >
                      <AlertTriangle size={16} />
                      {improvement}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Utility functions
const calculateStreak = (entries: any[]) => {
  let streak = 0;
  const sortedEntries = entries
    .filter(e => e.value)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  for (let i = 0; i < sortedEntries.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const diff = sortedEntries[i-1].date.getTime() - 
                  sortedEntries[i].date.getTime();
      if (diff === 86400000) { // One day in milliseconds
        streak++;
      } else {
        break;
      }
    }
  }
  return streak;
};

const average = (numbers: number[]) => 
  numbers.length ? numbers.reduce((a, b) => a + b) / numbers.length : 0;

const getDistribution = (entries: any[]) =>
  entries.reduce((acc, entry) => {
    acc[entry.value] = (acc[entry.value] || 0) + 1;
    return acc;
  }, {}); 