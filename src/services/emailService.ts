import { Metric } from '../types/metrics';

export interface ReminderConfig {
  email: string;
  time: string;
  metrics: string[];
  unsubscribeToken: string;
}

export interface ReminderTemplate {
  to: string;
  subject: string;
  metrics: Metric[];
  unsubscribeUrl: string;
} 