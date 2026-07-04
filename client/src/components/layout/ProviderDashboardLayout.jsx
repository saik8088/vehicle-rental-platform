import {
  HiSquares2X2,
  HiTruck,
  HiPlusCircle,
  HiClipboardDocumentList,
  HiBanknotes,
  HiStar,
  HiUserCircle,
} from 'react-icons/hi2';
import DashboardLayout from './DashboardLayout';

const providerNavItems = [
  { to: '/dashboard/provider', label: 'Overview', icon: HiSquares2X2, end: true },
  { to: '/dashboard/provider/vehicles', label: 'My Vehicles', icon: HiTruck, end: true },
  { to: '/dashboard/provider/vehicles/new', label: 'Add Vehicle', icon: HiPlusCircle },
  { to: '/dashboard/provider/earnings', label: 'Earnings', icon: HiBanknotes },
  { to: '/dashboard/provider/profile', label: 'Profile', icon: HiUserCircle },
];

const ProviderDashboardLayout = () => {
  return <DashboardLayout navItems={providerNavItems} title="Provider Dashboard" />;
};

export default ProviderDashboardLayout;
