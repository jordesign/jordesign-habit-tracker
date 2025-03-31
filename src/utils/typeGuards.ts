import { Metric, MetricType, MetricEntry } from '../types/metrics';

export function isMetricType(type: string): type is MetricType {
  return Object.values(MetricType).includes(type as MetricType);
}

export function isValidMetricValue(metric: Metric, value: any): boolean {
  switch (metric.type) {
    case MetricType.BOOLEAN:
      return typeof value === 'boolean';
    case MetricType.VALUE:
      return typeof value === 'number';
    case MetricType.SELECT:
      return typeof value === 'string' && metric.options?.includes(value);
    default:
      return false;
  }
}

export function getMetricDefaultValue(type: MetricType): any {
  switch (type) {
    case MetricType.BOOLEAN:
      return false;
    case MetricType.VALUE:
      return 0;
    case MetricType.SELECT:
      return '';
    default:
      return null;
  }
} 