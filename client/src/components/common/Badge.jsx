const variants = {
  default:  'bg-surface-100 text-surface-700',
  primary:  'bg-primary-50 text-primary-700',
  success:  'bg-success-50 text-success-700',
  warning:  'bg-warning-50 text-warning-700',
  error:    'bg-error-50 text-error-700',
  accent:   'bg-accent-50 text-accent-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-caption',
  lg: 'px-3 py-1.5 text-body-sm',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-70`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
