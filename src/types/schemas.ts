import { z } from 'zod';
import { MetricType, ReportingPeriod } from './metrics';

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