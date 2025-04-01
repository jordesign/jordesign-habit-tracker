import { v4 as uuidv4 } from 'uuid';
import { ReminderConfig } from './emailService';
import { Metric } from '../types/metrics';

export class ReminderService {
  private static async sendReminder(config: ReminderConfig, metrics: Metric[]) {
    try {
      const response = await fetch('/.netlify/functions/sendReminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: config.email,
          subject: 'Daily Metrics Reminder',
          metrics: metrics.filter(m => config.metrics.includes(m.id)),
          unsubscribeUrl: `${window.location.origin}/.netlify/functions/unsubscribe?token=${config.unsubscribeToken}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send reminder');
      }

      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      return false;
    }
  }

  static async configureReminders(email: string, time: string, metricIds: string[]): Promise<boolean> {
    try {
      const config: ReminderConfig = {
        email,
        time,
        metrics: metricIds,
        unsubscribeToken: uuidv4()
      };

      // Store reminder configuration
      await storageService.saveReminderConfig(config);

      // Test sending a reminder
      const metrics = await storageService.getMetrics();
      const success = await this.sendReminder(config, metrics);

      return success;
    } catch (error) {
      console.error('Error configuring reminders:', error);
      return false;
    }
  }
} 