export interface StorageData {
  version: number;
  metrics: Record<string, Metric>;
  entries: Record<string, MetricEntry>;
  journal: Record<string, JournalEntry>;
  settings: AppSettings;
}

export interface StorageError extends Error {
  code: 'NOT_FOUND' | 'VALIDATION_ERROR' | 'STORAGE_ERROR';
  details?: unknown;
} 