import { z } from 'zod'; // We'll use Zod for runtime validation
import { Metric, MetricEntry, MetricType, ReportingPeriod } from './metrics';
import { JournalEntry } from './journal';
import { AppSettings, Theme, DefaultView } from './settings';

// Utility type for creating new entries
export type CreateMetric = Omit<Metric, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateMetricEntry = Omit<MetricEntry, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateJournalEntry = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;

// Validation schemas
export const metricSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  icon: z.string(),
  type: z.nativeEnum(MetricType),
  options: z.array(z.string()).optional(),
  unit: z.string().optional(),
  reportingPeriod: z.nativeEnum(ReportingPeriod),
  createdAt: z.date(),
  updatedAt: z.date()
}).refine(data => {
  if (data.type === MetricType.SELECT && (!data.options || data.options.length === 0)) {
    return false;
  }
  if (data.type === MetricType.VALUE && !data.unit) {
    return false;
  }
  return true;
}, {
  message: "Invalid metric configuration"
});

export const metricEntrySchema = z.object({
  id: z.string().uuid(),
  metricId: z.string().uuid(),
  date: z.date(),
  value: z.union([z.boolean(), z.number(), z.string()]),
  note: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const journalEntrySchema = z.object({
  id: z.string().uuid(),
  date: z.date(),
  content: z.string(),
  images: z.array(z.string().url()),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const appSettingsSchema = z.object({
  email: z.string().email(),
  enableReminders: z.boolean(),
  reminderTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  metricsToRemind: z.array(z.string().uuid()),
  defaultView: z.nativeEnum(DefaultView),
  theme: z.nativeEnum(Theme)
}); 