import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Activity, X, Plus, AlertCircle,
  type LucideIcon,
  // Common icons for selection
  Heart, Star, Sun, Moon, Cloud, 
  Droplet, Zap, Flag, Target, 
  Timer, Coffee, Book
} from 'lucide-react';
import { MetricType, ReportingPeriod, CommonUnit } from '../../types/metrics';
import { IconSelectorTrigger } from '../common/IconSelector/IconSelectorTrigger';
import type { IconName } from '../common/IconSelector/types';

// Icon mapping for the selector
const AVAILABLE_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  star: Star,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  droplet: Droplet,
  zap: Zap,
  flag: Flag,
  target: Target,
  timer: Timer,
  coffee: Coffee,
  book: Book,
  activity: Activity,
};

// Form validation schema
const metricFormSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  description: z.string()
    .max(200, "Description must be 200 characters or less")
    .optional()
    .or(z.literal('')),
  icon: z.string().min(1, "Icon is required"),
  type: z.nativeEnum(MetricType),
  reportingPeriod: z.nativeEnum(ReportingPeriod),
  // Conditional fields based on type
  unit: z.string().optional(),
  customUnit: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  precision: z.number().min(0).max(3).optional(),
  options: z.array(z.string()).optional(),
}).refine(data => {
  if (data.type === MetricType.VALUE) {
    // Ensure unit is provided for value types
    return data.unit !== "" || data.customUnit;
  }
  return true;
}, {
  message: "Unit is required for numerical values",
  path: ["unit"],
});

type MetricFormData = z.infer<typeof metricFormSchema>;

interface MetricFormProps {
  initialData?: MetricFormData;
  onSubmit: (data: MetricFormData) => void;
  onCancel: () => void;
}

export const MetricForm: React.FC<MetricFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MetricFormData>({
    resolver: zodResolver(metricFormSchema),
    defaultValues: initialData || {
      type: MetricType.BOOLEAN,
      reportingPeriod: ReportingPeriod.DAILY,
      options: [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const selectedType = watch('type');
  const formData = watch();

  // Preview component based on current form data
  const MetricPreview: React.FC = () => {
    const IconComponent = AVAILABLE_ICONS[formData.icon] || Activity;

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <IconComponent className="text-gray-600" size={24} />
          <h3 className="text-lg font-medium text-gray-900">
            {formData.name || 'Metric Name'}
          </h3>
        </div>
        {formData.description && (
          <p className="text-gray-600 text-sm mb-2">{formData.description}</p>
        )}
        <div className="text-sm text-gray-600">
          {selectedType === MetricType.BOOLEAN && (
            <div className="flex items-center gap-2">
              <input type="checkbox" disabled />
              <span>Yes/No</span>
            </div>
          )}
          {selectedType === MetricType.VALUE && (
            <div>
              <span>0</span>
              {watch('unit') === 'other' ? (
                <span className="ml-1">{watch('customUnit')}</span>
              ) : (
                <span className="ml-1">{watch('unit')}</span>
              )}
            </div>
          )}
          {selectedType === MetricType.SELECT && (
            <div>
              <select disabled className="form-select text-sm">
                <option>Select an option...</option>
                {fields.map((field, index) => (
                  <option key={index}>{field.value}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-blue-500 focus:ring-blue-500"
              placeholder="What should be tracked? (optional)"
              rows={2}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <div className="mt-1">
              <IconSelectorTrigger
                value={watch('icon') as IconName}
                onChange={(iconName) => setValue('icon', iconName)}
                className="w-full"
              />
            </div>
            {errors.icon && (
              <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
            )}
          </div>

          {/* Metric Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <div className="mt-1 space-x-4">
              {Object.values(MetricType).map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('type')}
                    value={type}
                    className="form-radio"
                  />
                  <span className="ml-2">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type-specific fields */}
          {selectedType === MetricType.VALUE && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <div className="mt-1 flex gap-2">
                  <select
                    {...register('unit')}
                    className="block w-full rounded-md border-gray-300 shadow-sm 
                              focus:border-blue-500 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="">Select a unit...</option>
                    <optgroup label="Common Units">
                      {Object.entries(CommonUnit).map(([key, value]) => (
                        <option key={key} value={value}>
                          {value}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {/* Allow custom unit input if "Other" is selected */}
                  {watch('unit') === 'other' && (
                    <input
                      type="text"
                      {...register('customUnit')}
                      placeholder="Custom unit"
                      className="block w-full rounded-md border-gray-300 shadow-sm 
                                focus:border-blue-500 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    {...register('minValue', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                              focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    {...register('maxValue', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                              focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Decimal Places
                  </label>
                  <select
                    {...register('precision', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                              focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {selectedType === MetricType.SELECT && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              <div className="mt-1 space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`options.${index}`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append('')}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500"
                >
                  <Plus size={16} />
                  Add Option
                </button>
              </div>
            </div>
          )}

          {/* Reporting Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reporting Period
            </label>
            <select
              {...register('reportingPeriod')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Object.values(ReportingPeriod).map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
          <MetricPreview />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Metric
          </button>
        </div>
      </form>
    </div>
  );
}; 