import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { HiEnvelope, HiLockClosed, HiUser, HiPhone } from 'react-icons/hi2';
import { registerUser, reset } from '../../features/auth/authSlice';
import { Button, Input, Select } from '../../components/common';
import logo from '../../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' // default role
  });

  const { name, email, phone, password, confirmPassword, role } = formData;

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // If URL has ?role=provider, set it by default
  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole && ['customer', 'provider'].includes(urlRole)) {
      setFormData(prev => ({ ...prev, role: urlRole }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const userData = {
      name,
      email,
      phone,
      password,
      role
    };

    dispatch(registerUser(userData));
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logo} alt="RideEasy" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Card */}
        <div className="card p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-h3 text-surface-900 mb-2">Create an account</h1>
            <p className="text-body-sm text-surface-500">
              Join RideEasy to start booking or listing vehicles.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selection Tabs */}
            <div className="flex bg-surface-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                className={`flex-1 py-2 text-body-sm font-medium rounded-lg transition-all ${
                  formData.role === 'customer' 
                    ? 'bg-white text-surface-900 shadow-sm' 
                    : 'text-surface-500 hover:text-surface-700'
                }`}
                onClick={() => setFormData({ ...formData, role: 'customer' })}
              >
                I want to Rent
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-body-sm font-medium rounded-lg transition-all ${
                  formData.role === 'provider' 
                    ? 'bg-white text-surface-900 shadow-sm' 
                    : 'text-surface-500 hover:text-surface-700'
                }`}
                onClick={() => setFormData({ ...formData, role: 'provider' })}
              >
                I want to Host
              </button>
            </div>

            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              leftIcon={<HiUser className="w-5 h-5" />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="email@example.com"
                leftIcon={<HiEnvelope className="w-5 h-5" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+91"
                leftIcon={<HiPhone className="w-5 h-5" />}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                leftIcon={<HiLockClosed className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                leftIcon={<HiLockClosed className="w-5 h-5" />}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-4"
            >
              Create Account
            </Button>

            <p className="text-[0.6875rem] text-surface-500 text-center mt-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-100 text-center">
            <p className="text-body-sm text-surface-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
