import { HiMagnifyingGlass } from 'react-icons/hi2';

const EmptyState = ({
  icon: Icon = HiMagnifyingGlass,
  title = 'No results found',
  message = 'Try adjusting your search or filters.',
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-surface-400" />
      </div>
      <h3 className="text-h4 text-surface-900 mb-2">{title}</h3>
      <p className="text-body text-surface-500 max-w-sm mb-6">{message}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
