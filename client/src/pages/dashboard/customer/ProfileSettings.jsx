import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, HiOutlineLockClosed } from 'react-icons/hi2';
import { Button, Input } from '../../../components/common';
import { toast } from 'react-hot-toast';
import { updateUser } from '../../../features/auth/authSlice';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateUser(formData))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully (Mock)');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-h3 text-surface-900">Profile Settings</h1>
        <p className="text-body-sm text-surface-500">Manage your account details and security.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4 text-primary-600 text-h2 font-semibold">
              {formData.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-h5 text-surface-900">{formData.name}</h2>
            <p className="text-body-sm text-surface-500 mb-4">{formData.email}</p>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Personal Info Form */}
          <div className="card p-6 sm:p-8">
            <h2 className="text-h5 text-surface-900 mb-6">Personal Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                leftIcon={<HiOutlineUser className="w-5 h-5" />}
                required
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={<HiOutlineEnvelope className="w-5 h-5" />}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  leftIcon={<HiOutlinePhone className="w-5 h-5" />}
                  required
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" isLoading={isLoading}>Save Changes</Button>
              </div>
            </form>
          </div>

          {/* Password Form */}
          <div className="card p-6 sm:p-8">
            <h2 className="text-h5 text-surface-900 mb-6">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={handleChange}
                leftIcon={<HiOutlineLockClosed className="w-5 h-5" />}
                required
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  leftIcon={<HiOutlineLockClosed className="w-5 h-5" />}
                  required
                />
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  leftIcon={<HiOutlineLockClosed className="w-5 h-5" />}
                  required
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="secondary" isLoading={isLoading}>Update Password</Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
