import {
  HiSquares2X2,
  HiClipboardDocumentList,
  HiBell,
  HiUserCircle,
} from 'react-icons/hi2';
import DashboardLayout from './DashboardLayout';

const customerNavItems = [
  { to: '/dashboard', label: 'Overview', icon: HiSquares2X2, end: true },
  { to: '/dashboard/bookings', label: 'My Bookings', icon: HiClipboardDocumentList },
  { to: '/dashboard/notifications', label: 'Notifications', icon: HiBell },
  { to: '/dashboard/profile', label: 'Profile', icon: HiUserCircle },
];

const CustomerDashboardLayout = () => {
  return <DashboardLayout navItems={customerNavItems} title="My Account" />;
};

export default CustomerDashboardLayout;
