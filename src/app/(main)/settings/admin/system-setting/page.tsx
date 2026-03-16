'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSystemSettingMutation } from '@/features/super_admin/settings/settingsApi';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const SystemConfigurationPage = () => {
  const [formData, setFormData] = useState({
    platformName: 'Zana',
    supportEmail: 'support@loyaltypro.com',
    timezone: 'GMT/UTC (UTC+04:00)',
    minPasswordLength: '8',
  });

  const [updateSettings, { isLoading }] = useSystemSettingMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        platformName: formData.platformName,
        supportEmail: formData.supportEmail,
        passwordLength: Number(formData.minPasswordLength),
        ruleType: "globalRules"
      };

      const res = await updateSettings(payload).unwrap();
      if (res.success) {
        toast.success(res.message || 'Settings updated successfully');
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to update settings');
    }
  };

  const handleCancel = () => {
    console.log('Cancelling changes');
    // Add your cancel logic here
  };

  return (
    <div className="sm:px-0">
      <div className="">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
            System Configuration
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Manage global platform parameters, security protocols, and white-label Platform Branding branding for all business tenants.
          </p>
        </div>

        {/* General Settings Section */}
        <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
            General Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Platform Name */}
            <div className="space-y-2">
              <Label htmlFor="platformName" className="text-gray-700 font-normal">
                Platform Name
              </Label>
              <Input
                id="platformName"
                value={formData.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11 focus:border-gray-300 focus:ring-0"
              />
            </div>

            {/* Support Email Address */}
            <div className="space-y-2">
              <Label htmlFor="supportEmail" className="text-gray-700 font-normal">
                Support Email Address
              </Label>
              <Input
                id="supportEmail"
                type="email"
                value={formData.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11 focus:border-gray-300 focus:ring-0"
              />
            </div>
          </div>

        </div>

        {/* Security & Access Section */}
        <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
            Security & Access
          </h2>

          {/* Minimum Password Length */}
          <div className="space-y-2 max-w-md">
            <Label htmlFor="minPasswordLength" className="text-gray-700 font-normal">
              Minimum Password Length
            </Label>
            <Input
              id="minPasswordLength"
              type="number"
              value={formData.minPasswordLength}
              onChange={(e) => handleInputChange('minPasswordLength', e.target.value)}
              className="bg-gray-50 border-gray-200 h-11 focus:border-gray-300 focus:ring-0"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full sm:w-auto px-8 h-12 sm:h-11 border-2 border-pink-300 text-pink-500 hover:bg-pink-50 hover:text-pink-600 rounded-lg font-medium order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 h-12 sm:h-11 bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-700 rounded-lg font-medium shadow-sm order-1 sm:order-2"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationPage;