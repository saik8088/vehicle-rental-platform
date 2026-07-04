import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown, HiOutlineBanknotes } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, Badge, EmptyState } from '../../../components/common';
import { getVehicles } from '../../../features/vehicles/vehicleSlice';
import { getBookings } from '../../../features/bookings/bookingSlice';

const Earnings = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { vehicles } = useSelector((state) => state.vehicle);
  const { bookings, isLoading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getVehicles());
    dispatch(getBookings());
  }, [dispatch]);

  const myVehicles = vehicles.filter(v => v.provider?._id === user?._id || v.provider === user?._id);
  const myVehicleIds = myVehicles.map(v => v._id);
  
  // Filter bookings that belong to this provider's vehicles
  const myBookings = bookings.filter(b => myVehicleIds.includes(b.vehicle?._id || b.vehicle));

  const currentMonthEarnings = 0; // Replace with actual monthly calc later
  const lastMonthEarnings = 0;
  const growth = 0;
  
  const availableForWithdrawal = myBookings.reduce((acc, curr) => curr.status === 'completed' ? acc + curr.totalPrice : acc, 0);
  const pendingClearance = myBookings.reduce((acc, curr) => (curr.status === 'active' || curr.status === 'upcoming') ? acc + curr.totalPrice : acc, 0);
  const totalLifetime = availableForWithdrawal;

  const transactions = myBookings;

  if (isLoading) {
    return <div className="p-8 text-center text-surface-500">Loading earnings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-surface-900">Earnings & Payouts</h1>
          <p className="text-body-sm text-surface-500">Track your revenue and manage bank payouts.</p>
        </div>
        <Button leftIcon={<HiOutlineBanknotes className="w-5 h-5" />}>
          Withdraw Funds
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 sm:col-span-2 bg-primary-600 text-white border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <p className="text-primary-100 font-medium mb-1">Available for Withdrawal</p>
          <h2 className="text-h1 mb-4">₹{availableForWithdrawal.toLocaleString('en-IN')}</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-white">
              <HiOutlineArrowTrendingUp className="w-4 h-4" /> +0%
            </span>
            <span className="text-primary-200">vs last month</span>
          </div>
        </div>

        <div className="card p-6">
          <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Pending Clearance</p>
          <h3 className="text-h3 text-surface-900 mb-2">₹{pendingClearance.toLocaleString('en-IN')}</h3>
          <p className="text-body-sm text-surface-500">From active & upcoming trips</p>
        </div>

        <div className="card p-6">
          <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Total Lifetime</p>
          <h3 className="text-h3 text-surface-900 mb-2">₹{totalLifetime.toLocaleString('en-IN')}</h3>
          <p className="text-body-sm text-surface-500">Since joining</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-6">
        <h2 className="text-h5 text-surface-900 mb-6">Earnings History</h2>
        <div className="h-[300px] w-full flex items-center justify-center bg-surface-50 rounded-xl border border-dashed border-surface-200">
          <p className="text-surface-500">Not enough data to generate chart.</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="p-6 border-b border-surface-100 flex items-center justify-between">
          <h2 className="text-h5 text-surface-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 text-caption text-surface-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Transaction ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Vehicle</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {transactions.length > 0 ? transactions.map((trx) => (
                <tr key={trx._id} className="hover:bg-surface-50/50 transition-colors">
                  <td className="p-4 text-body-sm font-medium text-surface-900">{trx._id.substring(0, 8)}...</td>
                  <td className="p-4 text-body-sm text-surface-600">{new Date(trx.createdAt || trx.startDate).toLocaleDateString()}</td>
                  <td className="p-4 text-body-sm text-surface-700">{trx.vehicle?.name || 'Unknown Vehicle'}</td>
                  <td className="p-4">
                    <Badge variant={trx.status === 'completed' ? 'success' : 'warning'} className="capitalize">
                      {trx.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right text-body-sm font-semibold text-surface-900">
                    + ₹{trx.totalPrice.toLocaleString('en-IN')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-surface-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
