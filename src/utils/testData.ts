import { storageService } from '../services/storage/StorageService';
import { MetricType, ReportingPeriod } from '../types/metrics';

export const ENABLE_TEST_DATA = process.env.NODE_ENV === 'development';

export const initializeTestData = () => {
  // Only initialize if flag is enabled
  if (!ENABLE_TEST_DATA) return;
  
  // Only initialize if no metrics exist
  if (storageService.getMetrics().length === 0) {
    // Create some test metrics
    const stepsMetricId = storageService.createMetric({
      name: "Daily Steps",
      icon: "footprints",
      type: MetricType.VALUE,
      unit: "steps",
      reportingPeriod: ReportingPeriod.DAILY
    });

    const waterMetricId = storageService.createMetric({
      name: "Water Intake",
      icon: "droplet",
      type: MetricType.VALUE,
      unit: "glasses",
      reportingPeriod: ReportingPeriod.DAILY
    });

    const moodMetricId = storageService.createMetric({
      name: "Mood",
      icon: "smile",
      type: MetricType.SELECT,
      options: ["Great", "Good", "Okay", "Bad"],
      reportingPeriod: ReportingPeriod.DAILY
    });

    const exerciseMetricId = storageService.createMetric({
      name: "Exercise",
      icon: "activity",
      type: MetricType.BOOLEAN,
      reportingPeriod: ReportingPeriod.DAILY
    });

    // Create some test entries for today
    const today = new Date();
    
    storageService.createEntry({
      metricId: stepsMetricId,
      date: today,
      value: 8432
    });

    storageService.createEntry({
      metricId: waterMetricId,
      date: today,
      value: 6
    });

    storageService.createEntry({
      metricId: moodMetricId,
      date: today,
      value: "Good"
    });

    storageService.createEntry({
      metricId: exerciseMetricId,
      date: today,
      value: true
    });
  }
}; 