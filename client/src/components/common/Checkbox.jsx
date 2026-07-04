import { forwardRef } from 'react';
import { HiCheck } from 'react-icons/hi2';

const Checkbox = forwardRef(({
  label,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const checkboxId = id || name;

  return (
    <label 
      htmlFor={checkboxId}
      className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${containerClassName}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            peer appearance-none w-5 h-5 border-2 rounded text-primary-600 bg-white
            border-surface-300 hover:border-primary-500 checked:bg-primary-600 checked:border-primary-600
            transition-colors duration-200 focus-ring
            ${className}
          `}
          {...props}
        />
        <HiCheck className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
      </div>
      {label && (
        <span className="text-body-sm text-surface-700 select-none">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
