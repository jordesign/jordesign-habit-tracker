import { StorageData } from './types';

export const CURRENT_VERSION = 1;

export const migrations = {
  1: (data: any): StorageData => {
    // Initial data structure
    return {
      version: 1,
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
  },
  // Add future migrations here
  // 2: (data: StorageData): StorageData => { ... }
};

export const migrateData = (data: any): StorageData => {
  let version = data?.version || 0;
  
  while (version < CURRENT_VERSION) {
    version++;
    if (migrations[version]) {
      data = migrations[version](data);
    }
  }
  
  return data;
}; 