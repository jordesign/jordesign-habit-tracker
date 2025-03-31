export enum MetricType {
  BOOLEAN = "boolean",
  VALUE = "value",
  SELECT = "select"
}

export enum ReportingPeriod {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  ANNUAL = "annual"
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: MetricType;
  options?: string[]; // Required only for SELECT type
  unit?: string; // Required only for VALUE type
  reportingPeriod: ReportingPeriod;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricEntry {
  id: string;
  metricId: string;
  date: Date;
  value: boolean | number | string; // Type depends on metric type
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type guard for metric value based on metric type
export type MetricValue<T extends MetricType> =
  T extends MetricType.BOOLEAN ? boolean :
  T extends MetricType.VALUE ? number :
  T extends MetricType.SELECT ? string :
  never; 