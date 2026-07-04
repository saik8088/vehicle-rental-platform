import { HiExclamationCircle } from 'react-icons/hi2';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-error-50 flex items-center justify-center mb-5">
        <HiExclamationCircle className="w-8 h-8 text-error-500" />
      </div>
      <h3 className="text-h4 text-surface-900 mb-2">{title}</h3>
      <p className="text-body text-surface-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
