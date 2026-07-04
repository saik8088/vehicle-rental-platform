import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineBellAlert, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';
import { Button } from '../../../components/common';
import { getNotifications, markAllAsRead } from '../../../features/notifications/notificationSlice';

const CustomerNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <HiOutlineCheckCircle className="w-6 h-6 text-success-600" />;
      case 'warning':
        return <HiOutlineClock className="w-6 h-6 text-warning-600" />;
      default:
        return <HiOutlineBellAlert className="w-6 h-6 text-primary-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-surface-900">Notifications</h1>
          <p className="text-body-sm text-surface-500">Stay updated on your bookings and account activity.</p>
        </div>
        <Button variant="secondary" onClick={handleMarkAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <div className="card divide-y divide-surface-100">
        {isLoading && <div className="p-12 text-center text-surface-500">Loading notifications...</div>}
        {!isLoading && notifications.map(notification => (
          <div 
            key={notification._id} 
            className={`p-4 sm:p-6 flex items-start gap-4 transition-colors hover:bg-surface-50/50 ${!notification.isRead ? 'bg-primary-50/30' : ''}`}
          >
            <div className={`p-3 rounded-full flex-shrink-0 ${
              notification.type === 'success' ? 'bg-success-100' :
              notification.type === 'warning' ? 'bg-warning-100' : 'bg-primary-100'
            }`}>
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-body font-semibold ${!notification.isRead ? 'text-surface-900' : 'text-surface-700'}`}>
                  {notification.title}
                </h3>
                <span className="text-caption text-surface-400 whitespace-nowrap ml-4">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className={`text-body-sm ${!notification.isRead ? 'text-surface-700' : 'text-surface-500'}`}>
                {notification.message}
              </p>
            </div>
            
            {!notification.isRead && (
              <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
            )}
          </div>
        ))}
        
        {!isLoading && notifications.length === 0 && (
          <div className="p-12 text-center text-surface-500">
            You have no notifications.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerNotifications;
