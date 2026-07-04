import { forwardRef } from 'react';
import { HiChevronDown } from 'react-icons/hi2';

const Select = forwardRef(({
  label,
  id,
  name,
  options = [],
  placeholder = 'Select an option',
  error,
  helpText,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const selectId = id || name;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-body-sm font-medium text-surface-700"
        >
          {label}
          {required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          disabled={disabled}
          required={required}
          className={`
            w-full px-3.5 py-2.5 pr-10 rounded-xl border text-body
            bg-white text-surface-900 appearance-none
            transition-all duration-200 focus-ring cursor-pointer
            ${error
              ? 'border-error-500 focus:ring-error-500 focus:ring-offset-0'
              : 'border-surface-300 hover:border-surface-400 focus:border-primary-500'
            }
            ${disabled ? 'bg-surface-100 text-surface-500 cursor-not-allowed' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : helpText ? `${selectId}-help` : undefined}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
      </div>

      {error && (
        <p id={`${selectId}-error`} className="text-caption text-error-600" role="alert">
          {error}
        </p>
      )}

      {helpText && !error && (
        <p id={`${selectId}-help`} className="text-caption text-surface-500">
          {helpText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
