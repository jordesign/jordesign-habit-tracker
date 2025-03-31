import { storage } from '../../utils/storage';
import { StorageData, StorageError } from './types';
import { CURRENT_VERSION, migrateData } from './migrations';
import {
  validateMetric,
  validateMetricEntry,
  validateJournalEntry,
  validateAppSettings
} from '../../utils/validation';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

const STORAGE_KEY = 'habit-tracker-data';

class StorageService {
  private data: StorageData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StorageData {
    try {
      const savedData = storage.get<StorageData>(STORAGE_KEY);
      if (!savedData) {
        return this.initializeData();
      }
      return migrateData(savedData);
    } catch (error) {
      console.error('Failed to load data:', error);
      return this.initializeData();
    }
  }

  private initializeData(): StorageData {
    const initialData: StorageData = {
      version: CURRENT_VERSION,
      metrics: {},
      entries: {},
      journal: {},
      settings: {
        email: '',
        enableReminders: false,
        reminderTime: '09:00',
        metricsToRemind: [],
        defaultView: 'dashboard',
        theme: 'system'
      }
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: StorageData = this.data): void {
    try {
      storage.set(STORAGE_KEY, data);
      this.data = data;
    } catch (error) {
      throw this.createError('STORAGE_ERROR', 'Failed to save data', error);
    }
  }

  private createError(code: StorageError['code'], message: string, details?: unknown): StorageError {
    const error = new Error(message) as StorageError;
    error.code = code;
    error.details = details;
    return error;
  }

  // Metrics CRUD operations
  getMetrics(): Metric[] {
    return Object.values(this.data.metrics);
  }

  getMetricById(id: string): Metric {
    const metric = this.data.metrics[id];
    if (!metric) {
      throw this.createError('NOT_FOUND', `Metric with id ${id} not found`);
    }
    return metric;
  }

  createMetric(metric: Omit<Metric, 'id' | 'createdAt' | 'updatedAt'>): string {
    const newMetric: Metric = {
      ...metric,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      validateMetric(newMetric);
      this.data.metrics[newMetric.id] = newMetric;
      this.saveData();
      return newMetric.id;
    } catch (error) {
      throw this.createError('VALIDATION_ERROR', 'Invalid metric data', error);
    }
  }

  updateMetric(id: string, updates: Partial<Omit<Metric, 'id' | 'createdAt'>>): void {
    const metric = this.getMetricById(id);
    const updatedMetric = {
      ...metric,
      ...updates,
      updatedAt: new Date()
    };

    try {
      validateMetric(updatedMetric);
      this.data.metrics[id] = updatedMetric;
      this.saveData();
    } catch (error) {
      throw this.createError('VALIDATION_ERROR', 'Invalid metric data', error);
    }
  }

  deleteMetric(id: string): void {
    if (!this.data.metrics[id]) {
      throw this.createError('NOT_FOUND', `Metric with id ${id} not found`);
    }

    // Delete metric and all associated entries
    delete this.data.metrics[id];
    this.data.entries = Object.fromEntries(
      Object.entries(this.data.entries).filter(([_, entry]) => entry.metricId !== id)
    );
    this.saveData();
  }

  // Entries CRUD operations
  getEntriesForDate(date: Date): MetricEntry[] {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    return Object.values(this.data.entries).filter(entry =>
      isWithinInterval(new Date(entry.date), { start: dayStart, end: dayEnd })
    );
  }

  getEntriesForMetric(metricId: string, startDate: Date, endDate: Date): MetricEntry[] {
    return Object.values(this.data.entries).filter(entry =>
      entry.metricId === metricId &&
      isWithinInterval(new Date(entry.date), { start: startDate, end: endDate })
    );
  }

  createEntry(entry: Omit<MetricEntry, 'id' | 'createdAt' | 'updatedAt'>): string {
    const newEntry: MetricEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      validateMetricEntry(newEntry);
      this.data.entries[newEntry.id] = newEntry;
      this.saveData();
      return newEntry.id;
    } catch (error) {
      throw this.createError('VALIDATION_ERROR', 'Invalid entry data', error);
    }
  }

  updateEntry(id: string, updates: Partial<Omit<MetricEntry, 'id' | 'createdAt'>>): void {
    const entry = this.data.entries[id];
    if (!entry) {
      throw this.createError('NOT_FOUND', `Entry with id ${id} not found`);
    }

    const updatedEntry = {
      ...entry,
      ...updates,
      updatedAt: new Date()
    };

    try {
      validateMetricEntry(updatedEntry);
      this.data.entries[id] = updatedEntry;
      this.saveData();
    } catch (error) {
      throw this.createError('VALIDATION_ERROR', 'Invalid entry data', error);
    }
  }

  deleteEntry(id: string): void {
    if (!this.data.entries[id]) {
      throw this.createError('NOT_FOUND', `Entry with id ${id} not found`);
    }

    delete this.data.entries[id];
    this.saveData();
  }

  // Journal entries CRUD operations
  getJournalEntries(startDate: Date, endDate: Date): JournalEntry[] {
    return Object.values(this.data.journal).filter(entry =>
      isWithinInterval(new Date(entry.date), { start: startDate, end: endDate })
    );
  }

  createJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): string {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      validateJournalEntry(newEntry);
      this.data.journal[newEntry.id] = newEntry;
      this.saveData();
      return newEntry.id;
    } catch (error) {
      throw this.createError('VALIDATION_ERROR', 'Invalid journal entry data', error);
    }
  }

  // Settings operations
  getSettings(): AppSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<AppSettings>): void {
    const updatedSettings = {
      ...this.data.settings,
      ...updates
    };

    try {
      validateAppSettings(updatedSettings);
      this.data.settings = updatedSettings;
      this.saveData();
    } catch (error) {
      throw this.createError('VALIDATION_ERROR', 'Invalid settings data', error);
    }
  }

  // Data export/import
  exportData(): StorageData {
    return this.data;
  }

  importData(data: unknown): void {
    try {
      const migratedData = migrateData(data);
      // Validate all data
      Object.values(migratedData.metrics).forEach(validateMetric);
      Object.values(migratedData.entries).forEach(validateMetricEntry);
      Object.values(migratedData.journal).forEach(validateJournalEntry);
      validateAppSettings(migratedData.settings);
      
      this.saveData(migratedData);
    } catch (error) {
      throw this.createError('VALIDATION_ERROR', 'Invalid import data', error);
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService(); 