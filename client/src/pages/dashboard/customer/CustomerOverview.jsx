import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCalendarDays, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';
import { Badge, Button } from '../../../components/common';
import { getBookings, reset } from '../../../features/bookings/bookingSlice';

const CustomerOverview = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, isError, message } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getBookings());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const activeBookings = bookings.filter(b => b.status === 'active').length;
  const upcomingBookings = bookings.filter(b => b.status === 'upcoming').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  if (isLoading) {
    return <div className="p-8 text-center text-surface-500">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h3 text-surface-900">Dashboard Overview</h1>
        <Button onClick={() => window.location.href = '/vehicles'}>Book a Ride</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Active Bookings</p>
              <h3 className="text-h2 text-surface-900">{activeBookings}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <HiOutlineClock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Upcoming</p>
              <h3 className="text-h2 text-surface-900">{upcomingBookings}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning-50 flex items-center justify-center text-warning-600">
              <HiOutlineCalendarDays className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Completed</p>
              <h3 className="text-h2 text-surface-900">{completedBookings}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center text-success-600">
              <HiOutlineCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-6 border-b border-surface-100 flex items-center justify-between">
          <h2 className="text-h5 text-surface-900">Recent Bookings</h2>
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard/bookings'}>
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 text-caption text-surface-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Vehicle</th>
                <th className="p-4 font-medium">Dates</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {bookings.slice(0, 3).map((booking) => (
                <tr key={booking._id} className="hover:bg-surface-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-100 overflow-hidden flex-shrink-0">
                        <img 
                          src={booking.vehicle.images[0]?.url || 'https://via.placeholder.com/100'} 
                          alt={booking.vehicle.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-surface-900">{booking.vehicle.name}</p>
                        <p className="text-caption text-surface-500">{booking.vehicle.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-body-sm text-surface-700">
                      {new Date(booking.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} - 
                      {new Date(booking.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={
                        booking.status === 'completed' ? 'success' : 
                        booking.status === 'active' ? 'primary' : 
                        booking.status === 'upcoming' ? 'warning' : 'error'
                      }
                      className="capitalize"
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right text-body-sm font-semibold text-surface-900">
                    ₹{booking.totalPrice.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="p-8 text-center text-surface-500">
              No recent bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
