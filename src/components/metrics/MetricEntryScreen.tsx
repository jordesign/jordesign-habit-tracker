const renderInput = () => {
  switch (metric.type) {
    case MetricType.BOOLEAN:
      // Boolean input remains the same
      return (
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setValue('value', true)}
            className={`
              flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2
              ${watch('value') === true
                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                : 'bg-gray-50 text-gray-700 border border-gray-300'}
            `}
          >
            <Check size={20} />
            Yes
          </button>
          <button
            type="button"
            onClick={() => setValue('value', false)}
            className={`
              flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2
              ${watch('value') === false
                ? 'bg-red-100 text-red-700 border-2 border-red-500'
                : 'bg-gray-50 text-gray-700 border border-gray-300'}
            `}
          >
            <X size={20} />
            No
          </button>
        </div>
      );

    case MetricType.VALUE:
      // Value input remains the same
      return (
        <div className="relative">
          <input
            type="number"
            {...register('value', { valueAsNumber: true })}
            className="block w-full rounded-lg border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500"
            step={metric.precision ? Math.pow(10, -metric.precision) : 1}
            min={metric.minValue}
            max={metric.maxValue}
          />
          {metric.unit && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500">{metric.unit}</span>
            </div>
          )}
        </div>
      );

    case MetricType.SELECT:
      // Updated select input using dropdown
      return (
        <select
          {...register('value')}
          className="block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select an option...</option>
          {metric.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
  }
}; 