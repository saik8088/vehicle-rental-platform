import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineUsers, HiOutlineTruck, HiOutlineBanknotes } from 'react-icons/hi2';
import { Badge, Button } from '../../../components/common';
import { getUsers } from '../../../features/users/userSlice';
import { getVehicles } from '../../../features/vehicles/vehicleSlice';
import { getBookings } from '../../../features/bookings/bookingSlice';

const AdminOverview = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);
  const { vehicles } = useSelector((state) => state.vehicle);
  const { bookings } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getVehicles());
    dispatch(getBookings());
  }, [dispatch]);

  const totalUsers = users.length;
  const totalVehicles = vehicles.length;
  const totalRevenue = bookings.reduce((acc, curr) => curr.status === 'completed' ? acc + curr.totalPrice : acc, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-surface-900">Admin Dashboard</h1>
          <p className="text-body-sm text-surface-500">Platform overview and key metrics.</p>
        </div>
        <Button variant="secondary">Generate Report</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 border-t-4 border-t-primary-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Total Users</p>
              <h3 className="text-h2 text-surface-900">{totalUsers.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
              <HiOutlineUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-t-success-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Total Vehicles</p>
              <h3 className="text-h2 text-surface-900">{totalVehicles.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center text-success-600">
              <HiOutlineTruck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-t-warning-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Platform Revenue</p>
              <h3 className="text-h2 text-surface-900">₹{(totalRevenue / 100000).toFixed(2)}L</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-warning-50 flex items-center justify-center text-warning-600">
              <HiOutlineBanknotes className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h5 text-surface-900">Platform Activity (This Week)</h2>
        </div>
        <div className="h-[350px] w-full flex items-center justify-center bg-surface-50 rounded-xl border border-dashed border-surface-200">
          <p className="text-surface-500">Not enough data to generate chart.</p>
        </div>
      </div>

      {/* Recent System Alerts or Pending Approvals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-6 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-h5 text-surface-900">Pending Vehicle Approvals</h2>
            <Badge variant="warning">5 Pending</Badge>
          </div>
          <div className="divide-y divide-surface-100">
            {vehicles.slice(0, 3).map((vehicle) => (
              <div key={vehicle._id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-surface-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-100">
                    <img src={vehicle.images?.[0]?.url || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-surface-900">{vehicle.name}</p>
                    <p className="text-caption text-surface-500">by {vehicle.provider?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="px-3 h-8 text-[11px]">Review</Button>
                </div>
              </div>
            ))}
            {vehicles.length === 0 && <div className="p-6 text-center text-surface-500">No vehicles found.</div>}
          </div>
        </div>

        <div className="card">
          <div className="p-6 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-h5 text-surface-900">Recent Transactions</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="divide-y divide-surface-100">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-surface-50/50 transition-colors">
                <div>
                  <p className="text-body-sm font-semibold text-surface-900">
                    ₹{booking.totalPrice?.toLocaleString('en-IN') || 0}
                  </p>
                  <p className="text-caption text-surface-500">
                    {booking.customer?.name || 'Unknown'} → {booking.vehicle?.name || 'Unknown'}
                  </p>
                </div>
                <Badge variant="success" className="capitalize">{booking.status}</Badge>
              </div>
            ))}
            {bookings.length === 0 && <div className="p-6 text-center text-surface-500">No recent transactions.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
