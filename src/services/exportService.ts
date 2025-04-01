import { format } from 'date-fns';
import { Metric } from '../types/metrics';

interface ExportOptions {
  startDate: Date;
  endDate: Date;
  metricIds: string[];
  format: 'csv' | 'json';
}

interface MetricEntry {
  id: string;
  date: Date;
  value: any;
  note?: string;
}

interface MetricData {
  id: string;
  name: string;
  type: 'boolean' | 'value' | 'select';
  description?: string;
  unit?: string;
  entries: MetricEntry[];
}

export class ExportService {
  private static formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  private static async getMetricData(
    metricIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<MetricData[]> {
    try {
      // Get metrics and their entries
      const metrics = await storageService.getMetrics();
      const filteredMetrics = metrics.filter(m => metricIds.includes(m.id));
      
      return filteredMetrics.map(metric => ({
        id: metric.id,
        name: metric.name,
        type: metric.type,
        description: metric.description,
        unit: metric.unit,
        entries: metric.entries.filter(entry => 
          entry.date >= startDate && entry.date <= endDate
        )
      }));
    } catch (error) {
      console.error('Error fetching metric data:', error);
      throw new Error('Failed to fetch metric data');
    }
  }

  private static generateCSV(data: MetricData[]): string {
    const headers = ['Date'];
    const metricMap = new Map<string, MetricData>();
    
    // Build headers and metric map
    data.forEach(metric => {
      headers.push(metric.name);
      if (metric.note) headers.push(`${metric.name} (Notes)`);
      metricMap.set(metric.name, metric);
    });

    // Create CSV content
    const csvContent = [headers.join(',')];
    
    // Get all unique dates
    const allDates = Array.from(new Set(
      data.flatMap(m => m.entries.map(e => this.formatDate(e.date)))
    )).sort();

    // Build rows
    allDates.forEach(date => {
      const row = [date];
      
      headers.slice(1).forEach(header => {
        if (header.includes('(Notes)')) return; // Skip note headers for now
        
        const metric = metricMap.get(header);
        if (!metric) return;
        
        const entry = metric.entries.find(e => 
          this.formatDate(e.date) === date
        );
        
        // Add value
        row.push(entry ? String(entry.value) : '');
        
        // Add note if header exists
        if (headers.includes(`${header} (Notes)`)) {
          row.push(entry?.note || '');
        }
      });
      
      csvContent.push(row.join(','));
    });

    return csvContent.join('\n');
  }

  private static generateJSON(data: MetricData[]): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      metrics: data.map(metric => ({
        ...metric,
        entries: metric.entries.map(entry => ({
          ...entry,
          date: this.formatDate(entry.date)
        }))
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  static async exportData(options: ExportOptions): Promise<void> {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Preparing export...');

      // Fetch and process data
      const metricData = await this.getMetricData(
        options.metricIds,
        options.startDate,
        options.endDate
      );

      // Generate export content
      let content: string;
      let filename: string;
      let mimeType: string;

      if (options.format === 'csv') {
        content = this.generateCSV(metricData);
        filename = 'metrics_export.csv';
        mimeType = 'text/csv';
      } else {
        content = this.generateJSON(metricData);
        filename = 'metrics_export.json';
        mimeType = 'application/json';
      }

      // Create download
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${format(new Date(), 'yyyy-MM-dd')}_${filename}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      toast.success('Export completed successfully', {
        id: loadingToast
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data', {
        id: loadingToast
      });
      throw error;
    }
  }
} 