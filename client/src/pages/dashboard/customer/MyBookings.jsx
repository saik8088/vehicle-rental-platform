import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineFunnel } from 'react-icons/hi2';
import { toast } from 'react-hot-toast';
import { Badge, Button } from '../../../components/common';
import { getBookings, cancelBooking, completeBooking } from '../../../features/bookings/bookingSlice';

const MyBookings = () => {
  const [filter, setFilter] = useState('all');
  const dispatch = useDispatch();
  
  const { bookings, isLoading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking(id)).unwrap();
        toast.success('Booking cancelled');
        dispatch(getBookings());
      } catch (err) {
        toast.error(err || 'Failed to cancel');
      }
    }
  };

  const handleComplete = async (id) => {
    if (window.confirm('Are you sure you want to complete this ride early?')) {
      try {
        await dispatch(completeBooking(id)).unwrap();
        toast.success('Ride completed!');
        dispatch(getBookings());
      } catch (err) {
        toast.error(err || 'Failed to complete');
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-surface-500">Loading your bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-surface-900">My Bookings</h1>
          <p className="text-body-sm text-surface-500">View and manage your past and upcoming trips.</p>
        </div>
        <Button onClick={() => window.location.href = '/vehicles'}>Book a Ride</Button>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="p-4 border-b border-surface-100 flex items-center gap-4 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2 text-surface-500 mr-2">
            <HiOutlineFunnel className="w-5 h-5" />
            <span className="text-body-sm font-medium">Filter:</span>
          </div>
          {['all', 'upcoming', 'active', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors focus-ring ${
                filter === status 
                  ? 'bg-surface-900 text-white' 
                  : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="divide-y divide-surface-100">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-start md:items-center hover:bg-surface-50/30 transition-colors">
                
                {/* Image */}
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                  <img 
                    src={booking.vehicle?.images?.[0]?.url || 'https://via.placeholder.com/400?text=Vehicle'} 
                    alt={booking.vehicle?.name || 'Vehicle'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-h5 text-surface-900 mb-1">{booking.vehicle?.name || 'Vehicle'}</h3>
                      <p className="text-body-sm text-surface-500">{booking.vehicle?.location || ''}</p>
                    </div>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-body-sm">
                    <div>
                      <p className="text-surface-500">Pick-up</p>
                      <p className="font-medium text-surface-900">
                        {new Date(booking.startDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-surface-500">Drop-off</p>
                      <p className="font-medium text-surface-900">
                        {new Date(booking.endDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-caption">
                    <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'} className="capitalize">
                      Payment: {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>

                {/* Actions & Price */}
                <div className="w-full md:w-auto md:min-w-[140px] flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-surface-100 md:border-l md:pl-6">
                  <div className="text-left md:text-right">
                    <p className="text-caption text-surface-500">Total Price</p>
                    <p className="text-h4 text-primary-600">₹{booking.totalPrice?.toLocaleString('en-IN')}</p>
                  </div>
                  
                  {booking.status === 'upcoming' && (
                    <Button variant="danger" size="sm" className="w-full md:w-auto" onClick={() => handleCancel(booking._id)}>
                      Cancel
                    </Button>
                  )}
                  {booking.status === 'active' && (
                    <Button size="sm" className="w-full md:w-auto" onClick={() => handleComplete(booking._id)}>
                      Complete Ride
                    </Button>
                  )}
                  {booking.status === 'completed' && (
                    <Badge variant="success" className="text-xs">Completed ✓</Badge>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-body text-surface-500">No {filter !== 'all' ? filter : ''} bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
