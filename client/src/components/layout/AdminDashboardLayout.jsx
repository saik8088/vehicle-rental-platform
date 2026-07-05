import {
  HiSquares2X2,
  HiUsers,
  HiBuildingStorefront,
  HiShieldCheck,
  HiTruck,
  HiClipboardDocumentList,
  HiBanknotes,
  HiStar,
  HiCog6Tooth,
} from 'react-icons/hi2';
import DashboardLayout from './DashboardLayout';

const adminNavItems = [
  { to: '/dashboard/admin', label: 'Overview', icon: HiSquares2X2, end: true },
  { to: '/dashboard/admin/users', label: 'Manage Users', icon: HiUsers },
  { to: '/dashboard/admin/vehicles', label: 'Manage Vehicles', icon: HiTruck },
  { to: '/dashboard/admin/notifications', label: 'Notifications', icon: HiClipboardDocumentList },
  { to: '/dashboard/admin/settings', label: 'Settings', icon: HiCog6Tooth },
];

const AdminDashboardLayout = () => {
  return <DashboardLayout navItems={adminNavItems} title="Admin Dashboard" notificationPath="/dashboard/admin/notifications" />;
};

export default AdminDashboardLayout;
