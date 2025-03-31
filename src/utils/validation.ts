import { 
  metricSchema, 
  metricEntrySchema, 
  journalEntrySchema, 
  appSettingsSchema 
} from "../types/schemas";
import type { Metric } from "../types/metrics";
import type { MetricEntry } from "../types/metrics";
import type { JournalEntry } from "../types/journal";
import type { AppSettings } from "../types/settings";
import { MetricType, ReportingPeriod } from '../types/metrics';
import { storageService } from '../services/storage/StorageService';
import { queries } from '../services/storage/queries';
import { startOfWeek, endOfWeek } from 'date-fns';

export const validateMetric = (data: unknown): Metric => {
  return metricSchema.parse(data);
};

export const validateMetricEntry = (data: unknown): MetricEntry => {
  return metricEntrySchema.parse(data);
};

export const validateJournalEntry = (data: unknown): JournalEntry => {
  return journalEntrySchema.parse(data);
};

export const validateAppSettings = (data: unknown): AppSettings => {
  return appSettingsSchema.parse(data);
};

export const isValidMetricData = (data: unknown): data is Metric => {
  try {
    metricSchema.parse(data);
    return true;
  } catch {
    return false;
  }
};

const newMetric: Metric = {
  id: crypto.randomUUID(),
  name: "Daily Steps",
  icon: "footprints",
  type: MetricType.VALUE,
  unit: "steps",
  reportingPeriod: ReportingPeriod.DAILY,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Validate the metric
try {
  validateMetric(newMetric);
  // Metric is valid
} catch (error) {
  console.error("Invalid metric:", error);
}

// Create a new metric
const metricId = storageService.createMetric({
  name: "Daily Steps",
  icon: "footprints",
  type: "value",
  unit: "steps",
  reportingPeriod: "daily"
});

// Create an entry
storageService.createEntry({
  metricId,
  date: new Date(),
  value: 10000
});

// Get weekly stats
const stats = queries.getMetricStats(
  metricId,
  startOfWeek(new Date()),
  endOfWeek(new Date())
);

// Update settings
storageService.updateSettings({
  enableReminders: true,
  reminderTime: "09:00"
}); 