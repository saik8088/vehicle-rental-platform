import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiBars3,
  HiXMark,
  HiBell,
} from 'react-icons/hi2';
import logo from '../../assets/logo.png';
import Button from '../common/Button';
import { getNotifications } from '../../features/notifications/notificationSlice';
import { logout, reset } from '../../features/auth/authSlice';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);

  useEffect(() => {
    if (user) {
      dispatch(getNotifications());
    }
  }, [dispatch, user]);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const notificationPath = user?.role === 'admin' 
    ? '/dashboard/admin/notifications' 
    : user?.role === 'provider' 
    ? '/dashboard/provider/notifications' 
    : '/dashboard/notifications';

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/vehicles', label: 'Explore Vehicles' },
    { to: '/about', label: 'About' },
  ];

  const navLinkClasses = ({ isActive }) =>
    `text-body-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-primary-600'
        : 'text-surface-600 hover:text-surface-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-100">
      <nav className="container-app" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo} alt="RideEasy" className="h-8 lg:h-9 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-20 px-8">
            {publicLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClasses} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
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

                {/* Profile Link */}
                <Link
                  to={user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'provider' ? '/dashboard/provider' : '/dashboard'}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-surface-100 transition-colors focus-ring"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-caption font-semibold text-primary-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-body-sm font-medium text-surface-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100 transition-colors focus-ring"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-surface-100 py-4 animate-slide-down">
            <div className="flex flex-col gap-1">
              {publicLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-xl text-body-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {!user && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-surface-100">
                <Button variant="secondary" fullWidth onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                  Log in
                </Button>
                <Button fullWidth onClick={() => { navigate('/register'); setMobileOpen(false); }}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
