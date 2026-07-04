import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import CustomerDashboardLayout from './components/layout/CustomerDashboardLayout';
import ProviderDashboardLayout from './components/layout/ProviderDashboardLayout';
import AdminDashboardLayout from './components/layout/AdminDashboardLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import ExploreVehicles from './pages/public/ExploreVehicles';
import VehicleDetails from './pages/public/VehicleDetails';
import About from './pages/public/About';
import BecomeProvider from './pages/public/BecomeProvider';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Dashboard Pages
import { CustomerOverview, MyBookings, ProfileSettings, CustomerNotifications } from './pages/dashboard/customer';

// Provider Dashboard Pages
import { ProviderOverview, MyVehicles, VehicleForm, Earnings } from './pages/dashboard/provider';

// Admin Dashboard Pages
import { AdminOverview, ManageUsers, ManageVehicles } from './pages/dashboard/admin';

// 404
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
            fontSize: '14px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* Public routes with Navbar & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<ExploreVehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/become-provider" element={<BecomeProvider />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Customer Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer', 'provider', 'admin']}><CustomerDashboardLayout /></ProtectedRoute>}>
          <Route index element={<CustomerOverview />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="notifications" element={<CustomerNotifications />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Provider Dashboard */}
        <Route path="/dashboard/provider" element={<ProtectedRoute allowedRoles={['provider', 'admin']}><ProviderDashboardLayout /></ProtectedRoute>}>
          <Route index element={<ProviderOverview />} />
          <Route path="vehicles" element={<MyVehicles />} />
          <Route path="vehicles/new" element={<VehicleForm />} />
          <Route path="vehicles/:id/edit" element={<VehicleForm />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardLayout /></ProtectedRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="vehicles" element={<ManageVehicles />} />
          <Route path="settings" element={<div className="p-8"><h1 className="text-h3 text-surface-900">System Settings</h1><p className="text-surface-500">Coming soon in next phase.</p></div>} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
