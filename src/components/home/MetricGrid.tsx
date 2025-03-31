import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  XCircle, 
  Footprints, 
  Droplet, 
  Smile, 
  Activity 
} from 'lucide-react';
import type { Metric } from '../../types/metrics';
import { storageService } from '../../services/storage/StorageService';
import { queries } from '../../services/storage/queries';

interface MetricGridProps {
  metrics: Metric[];
  selectedDate: Date;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ metrics, selectedDate }) => {
  const navigate = useNavigate();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map(metric => (
        <MetricCard
          key={metric.id}
          metric={metric}
          selectedDate={selectedDate}
          onClick={() => navigate(`/metric/${metric.id}/${dateStr}`)}
        />
      ))}
    </div>
  );
};

interface MetricCardProps {
  metric: Metric;
  selectedDate: Date;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, selectedDate, onClick }) => {
  const entries = storageService.getEntriesForDate(selectedDate);
  const todayEntry = entries.find(e => e.metricId === metric.id);
  const stats = queries.getMetricStats(metric.id, selectedDate, selectedDate);

  const renderSummary = () => {
    switch (metric.type) {
      case 'boolean':
        return todayEntry ? (
          <div className="flex items-center gap-2">
            {todayEntry.value ? (
              <>
                <CheckCircle className="text-green-500" size={20} />
                <span>Completed</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" size={20} />
                <span>Not Completed</span>
              </>
            )}
          </div>
        ) : null;

      case 'value':
        return todayEntry ? (
          <div className="text-lg font-medium">
            {todayEntry.value} {metric.unit}
          </div>
        ) : null;

      case 'select':
        return todayEntry ? (
          <div className="text-lg font-medium">
            {todayEntry.value}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'footprints':
        return <Footprints size={24} />;
      case 'droplet':
        return <Droplet size={24} />;
      case 'smile':
        return <Smile size={24} />;
      case 'activity':
        return <Activity size={24} />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className="block w-full text-left bg-white rounded-xl shadow-sm border border-gray-200 
                 hover:border-primary-500 hover:shadow-md transition-all p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-gray-600">{getIconComponent(metric.icon)}</span>
        <h3 className="text-lg font-medium text-gray-900">{metric.name}</h3>
      </div>

      <div className="space-y-2">
        {renderSummary()}
        {!todayEntry && (
          <div className="text-gray-500">No data for today</div>
        )}
      </div>
    </button>
  );
}; 