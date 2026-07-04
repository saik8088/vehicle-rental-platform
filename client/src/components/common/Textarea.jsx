import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  id,
  name,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className = '',
  containerClassName = '',
  value,
  ...props
}, ref) => {
  const textareaId = id || name;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-body-sm font-medium text-surface-700"
        >
          {label}
          {required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={`
          w-full px-3.5 py-2.5 rounded-xl border text-body resize-y
          bg-white text-surface-900 placeholder-surface-400
          transition-all duration-200 focus-ring
          ${error
            ? 'border-error-500 focus:ring-error-500 focus:ring-offset-0'
            : 'border-surface-300 hover:border-surface-400 focus:border-primary-500'
          }
          ${disabled ? 'bg-surface-100 text-surface-500 cursor-not-allowed' : ''}
          ${className}
        `}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${textareaId}-error` : helpText ? `${textareaId}-help` : undefined}
        {...props}
      />

      <div className="flex justify-between">
        <div>
          {error && (
            <p id={`${textareaId}-error`} className="text-caption text-error-600" role="alert">
              {error}
            </p>
          )}
          {helpText && !error && (
            <p id={`${textareaId}-help`} className="text-caption text-surface-500">
              {helpText}
            </p>
          )}
        </div>
        {maxLength && (
          <p className="text-caption text-surface-400">
            {(value || '').length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
