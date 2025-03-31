import { storageService } from './StorageService';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const queries = {
  getWeeklyEntries(metricId: string, date: Date) {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return storageService.getEntriesForMetric(metricId, start, end);
  },

  getMonthlyEntries(metricId: string, date: Date) {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return storageService.getEntriesForMetric(metricId, start, end);
  },

  getMetricStats(metricId: string, startDate: Date, endDate: Date) {
    const entries = storageService.getEntriesForMetric(metricId, startDate, endDate);
    const metric = storageService.getMetricById(metricId);

    if (metric.type === 'value') {
      const values = entries.map(e => e.value as number);
      return {
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        total: values.reduce((a, b) => a + b, 0)
      };
    }

    if (metric.type === 'boolean') {
      const trueCount = entries.filter(e => e.value === true).length;
      return {
        completionRate: (trueCount / entries.length) * 100,
        completed: trueCount,
        total: entries.length
      };
    }

    if (metric.type === 'select') {
      const distribution = entries.reduce((acc, entry) => {
        const value = entry.value as string;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return { distribution };
    }
  }
}; 