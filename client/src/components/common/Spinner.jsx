const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-6 h-6 border-[3px]',
};

const colorClasses = {
  primary: 'border-primary-600 border-t-transparent',
  white:   'border-white border-t-transparent',
  surface: 'border-surface-400 border-t-transparent',
};

const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        rounded-full animate-spin
        ${sizeClasses[size] || sizeClasses.md}
        ${colorClasses[color] || colorClasses.primary}
        ${className}
      `}
    />
  );
};

export default Spinner;
