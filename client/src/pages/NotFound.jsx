import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi2';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[8rem] font-extrabold text-primary-100 leading-none select-none">
          404
        </p>
        <h1 className="text-h2 text-surface-900 -mt-6 mb-3">Page not found</h1>
        <p className="text-body text-surface-500 max-w-sm mx-auto mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link to="/">
          <Button leftIcon={<HiHome className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
