import { forwardRef } from 'react';
import Spinner from './Spinner';

const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
  secondary: 'bg-white text-surface-700 border border-surface-300 hover:bg-surface-50 active:bg-surface-100',
  accent:    'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 shadow-sm',
  danger:    'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 shadow-sm',
  ghost:     'text-surface-600 hover:bg-surface-100 active:bg-surface-200',
  link:      'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline p-0',
};

const sizes = {
  sm:  'px-3 py-1.5 text-body-sm rounded-lg gap-1.5',
  md:  'px-4 py-2.5 text-body-sm rounded-xl gap-2',
  lg:  'px-6 py-3 text-body rounded-xl gap-2',
  xl:  'px-8 py-3.5 text-body-lg rounded-xl gap-2.5',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 focus-ring
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          <span>{typeof children === 'string' ? 'Processing...' : children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
