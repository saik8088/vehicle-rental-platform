const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        <span className="text-h2 text-primary-600">🚧</span>
      </div>
      <h2 className="text-h3 text-surface-900 mb-2">{title}</h2>
      <p className="text-body text-surface-500 max-w-sm">
        {description || 'This page will be built in upcoming phases.'}
      </p>
    </div>
  );
};

// Customer Dashboard Pages
export const CustomerOverview = () => <PlaceholderPage title="Dashboard Overview" description="Your booking summary and activity — Phase 3." />;
export const MyBookings = () => <PlaceholderPage title="My Bookings" description="View and manage your bookings — Phase 3." />;
export const BookingDetails = () => <PlaceholderPage title="Booking Details" description="Complete booking information — Phase 3." />;
export const CustomerNotifications = () => <PlaceholderPage title="Notifications" description="Your alerts and updates — Phase 3." />;
export const CustomerProfile = () => <PlaceholderPage title="Profile" description="Manage your account settings — Phase 3." />;

// Provider Dashboard Pages
export const ProviderOverview = () => <PlaceholderPage title="Provider Dashboard" description="Vehicle and booking statistics — Phase 3." />;
export const MyVehicles = () => <PlaceholderPage title="My Vehicles" description="Manage your vehicle listings — Phase 3." />;
export const AddVehicle = () => <PlaceholderPage title="Add Vehicle" description="List a new vehicle for rent — Phase 3." />;
export const EditVehicle = () => <PlaceholderPage title="Edit Vehicle" description="Update vehicle information — Phase 3." />;
export const ProviderBookings = () => <PlaceholderPage title="Provider Bookings" description="Bookings for your vehicles — Phase 3." />;
export const ProviderEarnings = () => <PlaceholderPage title="Earnings" description="Your rental earnings overview — Phase 3." />;
export const ProviderReviews = () => <PlaceholderPage title="Reviews" description="Reviews on your vehicles — Phase 3." />;
export const ProviderProfile = () => <PlaceholderPage title="Provider Profile" description="Manage your provider settings — Phase 3." />;

// Admin Dashboard Pages
export const AdminOverview = () => <PlaceholderPage title="Admin Dashboard" description="Platform statistics and overview — Phase 3." />;
export const AdminUsers = () => <PlaceholderPage title="Users Management" description="Manage platform users — Phase 3." />;
export const AdminProviders = () => <PlaceholderPage title="Providers Management" description="Manage vehicle providers — Phase 3." />;
export const AdminApprovals = () => <PlaceholderPage title="Vehicle Approvals" description="Review pending vehicle listings — Phase 3." />;
export const AdminVehicles = () => <PlaceholderPage title="All Vehicles" description="View all platform vehicles — Phase 3." />;
export const AdminBookings = () => <PlaceholderPage title="All Bookings" description="Monitor all bookings — Phase 3." />;
export const AdminPayments = () => <PlaceholderPage title="Payments" description="Payment records and monitoring — Phase 3." />;
export const AdminReviews = () => <PlaceholderPage title="Reviews" description="Platform review management — Phase 3." />;

export default PlaceholderPage;
