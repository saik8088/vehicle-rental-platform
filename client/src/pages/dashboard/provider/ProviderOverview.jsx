import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineBanknotes, HiOutlineTruck, HiOutlineCalendarDays } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge, Button } from '../../../components/common';
import { getMyVehicles } from '../../../features/vehicles/vehicleSlice';
import { getBookings } from '../../../features/bookings/bookingSlice';

const ProviderOverview = () => {
  const dispatch = useDispatch();
  
  const { myVehicles } = useSelector((state) => state.vehicle);
  const { bookings } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getMyVehicles());
    dispatch(getBookings());
  }, [dispatch]);

  const activeVehicles = myVehicles.length;
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalBookings = bookings.length;
  
  const recentBookings = bookings.slice(0, 4);

  // Build day-wise revenue chart data from bookings (last 7 days)
  const buildChartData = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const dayEarnings = bookings
        .filter(b => {
          const created = new Date(b.createdAt);
          return created >= dayStart && created < dayEnd && b.status === 'completed';
        })
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      const dayBookings = bookings.filter(b => {
        const created = new Date(b.createdAt);
        return created >= dayStart && created < dayEnd;
      }).length;

      data.push({ date: dateStr, revenue: dayEarnings, bookings: dayBookings });
    }
    return data;
  };

  const chartData = buildChartData();
  const hasChartData = chartData.some(d => d.revenue > 0 || d.bookings > 0);

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
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Total Bookings</p>
              <h3 className="text-h2 text-surface-900">{totalBookings}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning-50 flex items-center justify-center text-warning-600">
              <HiOutlineCalendarDays className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h5 text-surface-900">Revenue Overview (Last 7 Days)</h2>
          </div>
          {hasChartData ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] w-full flex items-center justify-center bg-surface-50 rounded-xl border border-dashed border-surface-200">
              <p className="text-surface-500">No revenue data in the last 7 days.</p>
            </div>
          )}
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
            {recentBookings.length === 0 && (
              <div className="p-6 text-center text-surface-500">No bookings yet.</div>
            )}
            {recentBookings.map((booking) => (
              <div key={booking._id} className="p-4 sm:p-6 hover:bg-surface-50/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-body font-semibold text-surface-900 line-clamp-1">{booking.vehicle?.name || 'Vehicle'}</h3>
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
                  {new Date(booking.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} - 
                  {new Date(booking.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                  <span className="text-body-sm font-semibold text-primary-600">
                    ₹{booking.totalPrice?.toLocaleString('en-IN')}
                  </span>
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
