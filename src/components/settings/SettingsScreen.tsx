import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  GripVertical,
  Trash2,
  Edit,
  Plus,
  Bell,
  Download,
  Settings as SettingsIcon,
  Moon,
  Sun
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-hot-toast';
import { ReminderService } from '../../services/reminderService';

interface MetricItem {
  id: string;
  name: string;
  type: 'boolean' | 'value' | 'select';
  order: number;
}

// Sortable Metric Item Component
const SortableMetricItem = ({ metric }: { metric: MetricItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: metric.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg
                ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-center gap-4">
        <button
          {...attributes}
          {...listeners}
          className="touch-none"
          type="button"
        >
          <GripVertical size={20} className="text-gray-400" />
        </button>
        <span className="font-medium">{metric.name}</span>
        <span className="text-sm text-gray-500">{metric.type}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {/* Implement edit */}}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={() => {/* Implement delete */}}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('metrics');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [defaultView, setDefaultView] = useState('daily');
  const [exportDateRange, setExportDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(),
    end: new Date()
  });
  const [selectedMetricsForExport, setSelectedMetricsForExport] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Example metrics data
  const [metrics, setMetrics] = useState<MetricItem[]>([
    { id: '1', name: 'Daily Exercise', type: 'boolean', order: 0 },
    { id: '2', name: 'Weight', type: 'value', order: 1 },
    { id: '3', name: 'Mood', type: 'select', order: 2 }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setMetrics((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index
        }));
      });
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      // Implement export logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log(`Exporting ${format}...`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveReminders = async () => {
    if (!email || !reminderTime || selectedMetrics.length === 0) {
      // Show error message
      return;
    }

    setIsSaving(true);
    try {
      const success = await ReminderService.configureReminders(
        email,
        reminderTime,
        selectedMetrics
      );

      if (success) {
        // Show success message
        toast.success('Reminder settings saved successfully');
      } else {
        // Show error message
        toast.error('Failed to save reminder settings');
      }
    } catch (error) {
      console.error('Error saving reminders:', error);
      toast.error('Failed to save reminder settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-8">
        {['metrics', 'reminders', 'export', 'preferences'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${activeTab === tab
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-700 hover:text-gray-900'
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Metrics Management */}
        {activeTab === 'metrics' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Metrics Management</h2>
              <button
                onClick={() => navigate('/metrics/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus size={20} className="mr-2" />
                Add New Metric
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={metrics}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {metrics.map((metric) => (
                    <SortableMetricItem key={metric.id} metric={metric} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Reminders */}
        {activeTab === 'reminders' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Reminders</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 
                           focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-gray-500" />
                  <span className="font-medium">Daily Reminders</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                              peer-focus:ring-blue-300 rounded-full peer 
                              peer-checked:after:translate-x-full peer-checked:after:border-white 
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                              after:bg-white after:border-gray-300 after:border after:rounded-full 
                              after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Time
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 
                           focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metrics to Include
                </label>
                <div className="space-y-2">
                  {metrics.map((metric) => (
                    <label key={metric.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{metric.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Export */}
        {activeTab === 'export' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Export</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={exportDateRange.start.toISOString().split('T')[0]}
                    onChange={(e) => setExportDateRange(prev => ({
                      ...prev,
                      start: new Date(e.target.value)
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 
                             focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={exportDateRange.end.toISOString().split('T')[0]}
                    onChange={(e) => setExportDateRange(prev => ({
                      ...prev,
                      end: new Date(e.target.value)
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 
                             focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Metrics
                </label>
                <div className="space-y-2">
                  {metrics.map((metric) => (
                    <label key={metric.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMetricsForExport.includes(metric.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMetricsForExport(prev => [...prev, metric.id]);
                          } else {
                            setSelectedMetricsForExport(prev => 
                              prev.filter(id => id !== metric.id)
                            );
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{metric.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-blue-500 disabled:opacity-50"
                >
                  <Download size={20} className="mr-2" />
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </button>
                <button
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg
                           hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-gray-500 disabled:opacity-50"
                >
                  <Download size={20} className="mr-2" />
                  {isExporting ? 'Exporting...' : 'Export JSON'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* App Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">App Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="flex gap-4">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: SettingsIcon, label: 'System' }
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg
                        ${theme === value
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon size={20} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default View
                </label>
                <select
                  value={defaultView}
                  onChange={(e) => setDefaultView(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 
                           focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 