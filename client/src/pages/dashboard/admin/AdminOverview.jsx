import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineUsers, HiOutlineTruck, HiOutlineBanknotes, HiOutlineDocumentArrowDown } from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  // Build day-wise chart data (last 7 days)
  const buildChartData = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const dayRevenue = bookings
        .filter(b => {
          const created = new Date(b.createdAt);
          return created >= dayStart && created < dayEnd && b.status === 'completed';
        })
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      const dayBookings = bookings.filter(b => {
        const created = new Date(b.createdAt);
        return created >= dayStart && created < dayEnd;
      }).length;

      data.push({ date: dateStr, revenue: dayRevenue, bookings: dayBookings });
    }
    return data;
  };

  const chartData = buildChartData();
  const hasChartData = chartData.some(d => d.revenue > 0 || d.bookings > 0);

  // Generate PDF Report
  const handleGenerateReport = () => {
    const reportDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const activeBookings = bookings.filter(b => b.status === 'active');
    const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>RideEasy Platform Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #7c3aed; padding-bottom: 20px; }
          .header h1 { font-size: 28px; color: #7c3aed; margin-bottom: 5px; }
          .header p { color: #64748b; font-size: 14px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
          .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
          .stat-card .label { font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 8px; }
          .stat-card .value { font-size: 24px; font-weight: 700; color: #1e293b; }
          .section { margin-bottom: 32px; }
          .section h2 { font-size: 18px; color: #1e293b; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #7c3aed; color: white; padding: 10px 12px; text-align: left; }
          td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚗 RideEasy Platform Report</h1>
          <p>Generated on ${reportDate}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Total Users</div>
            <div class="value">${totalUsers}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Vehicles</div>
            <div class="value">${totalVehicles}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Bookings</div>
            <div class="value">${bookings.length}</div>
          </div>
          <div class="stat-card">
            <div class="label">Platform Revenue</div>
            <div class="value">₹${totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div class="section">
          <h2>Booking Status Breakdown</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="label">Completed</div>
              <div class="value" style="color: #10b981">${completedBookings.length}</div>
            </div>
            <div class="stat-card">
              <div class="label">Active</div>
              <div class="value" style="color: #7c3aed">${activeBookings.length}</div>
            </div>
            <div class="stat-card">
              <div class="label">Upcoming</div>
              <div class="value" style="color: #f59e0b">${upcomingBookings.length}</div>
            </div>
            <div class="stat-card">
              <div class="label">Cancelled</div>
              <div class="value" style="color: #ef4444">${cancelledBookings.length}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>All Bookings</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Vehicle</th>
                <th>Customer</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map((b, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${b.vehicle?.name || 'N/A'}</td>
                  <td>${b.customer?.name || 'N/A'}</td>
                  <td>${new Date(b.startDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>${new Date(b.endDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>₹${b.totalPrice?.toLocaleString('en-IN') || 0}</td>
                  <td>${b.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Registered Users</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((u, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${u.name}</td>
                  <td>${u.email}</td>
                  <td>${u.role}</td>
                  <td>${new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} RideEasy — Confidential Platform Report</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 text-surface-900">Admin Dashboard</h1>
          <p className="text-body-sm text-surface-500">Platform overview and key metrics.</p>
        </div>
        <Button variant="secondary" leftIcon={<HiOutlineDocumentArrowDown className="w-5 h-5" />} onClick={handleGenerateReport}>
          Generate Report
        </Button>
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
              <h3 className="text-h2 text-surface-900">₹{totalRevenue.toLocaleString('en-IN')}</h3>
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
          <h2 className="text-h5 text-surface-900">Platform Activity (Last 7 Days)</h2>
        </div>
        {hasChartData ? (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`₹${value.toLocaleString('en-IN')}`, 'Revenue'];
                    return [value, 'Bookings'];
                  }}
                />
                <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} name="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] w-full flex items-center justify-center bg-surface-50 rounded-xl border border-dashed border-surface-200">
            <p className="text-surface-500">No activity data in the last 7 days.</p>
          </div>
        )}
      </div>

      {/* Recent System Alerts or Pending Approvals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-6 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-h5 text-surface-900">Listed Vehicles</h2>
            <Badge variant="primary">{vehicles.length} Total</Badge>
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
                <Badge variant="success" size="sm">Active</Badge>
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
                <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'active' ? 'primary' : booking.status === 'upcoming' ? 'warning' : 'error'} className="capitalize">{booking.status}</Badge>
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
