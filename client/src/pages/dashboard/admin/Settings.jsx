import { useState } from 'react';
import { HiOutlineCog, HiOutlineShieldCheck, HiOutlineGlobeAlt, HiOutlineCurrencyRupee } from 'react-icons/hi2';
import { Button, Input } from '../../../components/common';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    platformFee: 5,
    enableRegistration: true,
    maintenanceMode: false,
    contactEmail: 'support@rideeasy.com',
    autoApproveVehicles: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('System settings updated successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-h3 text-surface-900">System Settings</h1>
        <p className="text-body-sm text-surface-500">Manage global platform configurations and policies.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-100">
            <HiOutlineGlobeAlt className="w-6 h-6 text-primary-600" />
            <h2 className="text-h5 text-surface-900">General Platform Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-body font-medium text-surface-900">Maintenance Mode</h4>
                <p className="text-caption text-surface-500">Temporarily disable customer bookings.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="maintenanceMode" 
                  checked={settings.maintenanceMode} 
                  onChange={handleChange} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-body font-medium text-surface-900">Enable New Registrations</h4>
                <p className="text-caption text-surface-500">Allow new users to sign up on the platform.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="enableRegistration" 
                  checked={settings.enableRegistration} 
                  onChange={handleChange} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success-500"></div>
              </label>
            </div>
            
            <Input
              label="Support Contact Email"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
              placeholder="support@example.com"
            />
          </div>
        </div>

        {/* Financial Settings */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-100">
            <HiOutlineCurrencyRupee className="w-6 h-6 text-primary-600" />
            <h2 className="text-h5 text-surface-900">Financial Configurations</h2>
          </div>
          
          <div className="max-w-md">
            <Input
              label="Platform Fee Percentage (%)"
              name="platformFee"
              type="number"
              min="0"
              max="100"
              value={settings.platformFee}
              onChange={handleChange}
              helperText="The service fee deducted from provider earnings per booking."
            />
          </div>
        </div>

        {/* Security & Verification */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-100">
            <HiOutlineShieldCheck className="w-6 h-6 text-primary-600" />
            <h2 className="text-h5 text-surface-900">Security & Verification</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-body font-medium text-surface-900">Auto-Approve Vehicles</h4>
                <p className="text-caption text-surface-500">Automatically approve new vehicle listings without admin review.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="autoApproveVehicles" 
                  checked={settings.autoApproveVehicles} 
                  onChange={handleChange} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" isLoading={isSaving} leftIcon={<HiOutlineCog />}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
