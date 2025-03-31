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
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  type: z.nativeEnum(MetricType),
  options: z.array(z.string()).optional(),
  unit: z.string().optional(),
  reportingPeriod: z.nativeEnum(ReportingPeriod),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const metricEntrySchema = z.object({
  id: z.string(),
  metricId: z.string(),
  date: z.date(),
  value: z.union([z.boolean(), z.number(), z.string()]),
  note: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const journalEntrySchema = z.object({
  id: z.string(),
  date: z.date(),
  content: z.string(),
  images: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const appSettingsSchema = z.object({
  email: z.string().email(),
  enableReminders: z.boolean(),
  reminderTime: z.string(),
  metricsToRemind: z.array(z.string()),
  defaultView: z.string(),
  theme: z.string()
}); 