import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiBars3,
  HiXMark,
  HiBell,
  HiArrowRightOnRectangle,
  HiChevronLeft,
} from 'react-icons/hi2';
import logo from '../../assets/logo.png';
import { getNotifications } from '../../features/notifications/notificationSlice';
import { logout, reset } from '../../features/auth/authSlice';

const DashboardLayout = ({ navItems = [], title = 'Dashboard', notificationPath = '/dashboard/notifications' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);

  useEffect(() => {
    if (user) {
      dispatch(getNotifications());
    }
  }, [dispatch, user]);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const sidebarLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary-50 text-primary-700'
        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
    }`;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-surface-100 px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl text-surface-600 hover:bg-surface-100 transition-colors focus-ring"
          aria-label="Open sidebar"
        >
          <HiBars3 className="w-5 h-5" />
        </button>

        <Link to="/">
          <img src={logo} alt="RideEasy" className="h-7 w-auto" />
        </Link>

        <Link
          to={notificationPath}
          className="relative p-2 -mr-2 rounded-xl text-surface-500 hover:bg-surface-100 transition-colors focus-ring"
          aria-label="Notifications"
        >
          <HiBell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px] bg-white border-r border-surface-100
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:z-20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-surface-100 flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="RideEasy" className="h-7 w-auto" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
            aria-label="Close sidebar"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard title */}
        <div className="px-5 py-4">
          <p className="text-caption text-surface-400 uppercase tracking-wider font-semibold">{title}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={sidebarLinkClasses}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-surface-100 p-3 space-y-1 flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-body-sm text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors"
          >
            <HiChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-body-sm text-error-600 hover:bg-error-50 transition-colors w-full"
          >
            <HiArrowRightOnRectangle className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[280px]">
        {/* Desktop header */}
        <header className="hidden lg:flex sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-surface-100 h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-h4 text-surface-900">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={notificationPath}
              className="relative p-2 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors focus-ring"
              aria-label="Notifications"
            >
              <HiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-surface-200">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-caption font-semibold text-primary-700">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden xl:block">
                <p className="text-body-sm font-medium text-surface-900">{user?.name}</p>
                <p className="text-caption text-surface-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
