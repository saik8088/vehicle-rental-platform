import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineBanknotes, HiOutlineTruck, HiOutlineStar } from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge, Button } from '../../../components/common';
import { getVehicles } from '../../../features/vehicles/vehicleSlice';
import { getBookings } from '../../../features/bookings/bookingSlice';

const ProviderOverview = () => {
  const dispatch = useDispatch();
  
  const { vehicles } = useSelector((state) => state.vehicle);
  const { bookings } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getVehicles());
    dispatch(getBookings());
  }, [dispatch]);

  // Only count vehicles owned by this provider
  const { user } = useSelector((state) => state.auth);
  const myVehicles = vehicles.filter(v => v.provider?._id === user?._id || v.provider === user?._id);
  
  const activeVehicles = myVehicles.length;
  const totalEarnings = bookings.reduce((acc, curr) => curr.status === 'completed' ? acc + curr.totalPrice : acc, 0);
  
  // Calculate real average rating
  const totalReviews = myVehicles.reduce((acc, curr) => acc + (curr.reviewCount || 0), 0);
  const totalRatingSum = myVehicles.reduce((acc, curr) => acc + ((curr.averageRating || 0) * (curr.reviewCount || 0)), 0);
  const averageRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0;
  
  const recentBookings = bookings.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h3 text-surface-900">Provider Dashboard</h1>
        <p className="text-body-sm text-surface-500">Monitor your earnings and vehicle performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Total Earnings</p>
              <h3 className="text-h2 text-surface-900">₹{totalEarnings.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <HiOutlineBanknotes className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Active Vehicles</p>
              <h3 className="text-h2 text-surface-900">{activeVehicles}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center text-success-600">
              <HiOutlineTruck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Avg Rating</p>
              <h3 className="text-h2 text-surface-900">{averageRating}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning-50 flex items-center justify-center text-warning-600">
              <HiOutlineStar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h5 text-surface-900">Revenue Overview (This Year)</h2>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center bg-surface-50 rounded-xl border border-dashed border-surface-200">
            <p className="text-surface-500">Not enough data to generate chart.</p>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="lg:col-span-1 card flex flex-col">
          <div className="p-6 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-h5 text-surface-900">Recent Requests</h2>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard/bookings'}>
              All
            </Button>
          </div>
          
          <div className="divide-y divide-surface-100 flex-grow">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="p-4 sm:p-6 hover:bg-surface-50/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-body font-semibold text-surface-900 line-clamp-1">{booking.vehicle.name}</h3>
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
                <p className="text-caption text-surface-500 mb-3">
                  {new Date(booking.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - 
                  {new Date(booking.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                  <span className="text-body-sm font-semibold text-primary-600">
                    ₹{booking.totalPrice.toLocaleString('en-IN')}
                  </span>
                  {booking.status === 'upcoming' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="px-2 py-1 text-[11px] h-7 min-w-0">Reject</Button>
                      <Button size="sm" className="px-3 py-1 text-[11px] h-7 min-w-0">Accept</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderOverview;
