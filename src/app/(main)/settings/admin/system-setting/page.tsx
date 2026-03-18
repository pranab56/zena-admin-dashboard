'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetSystemSettingQuery, useSystemSettingMutation } from '@/features/super_admin/settings/settingsApi';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const SystemConfigurationPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    platformName: '',
    supportEmail: '',
    timezone: 'GMT/UTC (UTC+04:00)',
    minPasswordLength: '',
  });

  const { data: settingsData, isLoading: isFetching } = useGetSystemSettingQuery(undefined);
  const [updateSettings, { isLoading }] = useSystemSettingMutation();

  useEffect(() => {
    if (settingsData?.success && settingsData.data) {
      const { platformName, supportEmail, passwordLength } = settingsData.data;
      setFormData({
        platformName: platformName || '',
        supportEmail: supportEmail || '',
        timezone: 'GMT/UTC (UTC+04:00)',
        minPasswordLength: passwordLength?.toString() || '',
      });
    }
  }, [settingsData]);

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
        ruleType: "globalRule",
      };

      const res = await updateSettings(payload).unwrap();
      if (res.success) {
        toast.success(res.message || t('profile_update_success'));
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || t('profile_update_failed'));
    }
  };

  const handleCancel = () => {
    console.log('Cancelling changes');
    // Add your cancel logic here
  };

  return (
    <div className="sm:px-0">
      <div className="">
        {isFetching && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {/* Header Section */}
        <div className="mb-8 text-start">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3 text-start">
            {t('system_configuration')}
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base text-start">
            {t('system_config_desc')}
          </p>
        </div>

        {/* General Settings Section */}
        <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 mb-6 text-start">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 text-start">
            {t('general_settings')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Platform Name */}
            <div className="space-y-2 text-start">
              <Label htmlFor="platformName" className="text-gray-700 font-normal">
                {t('platform_name', { defaultValue: 'Platform Name' })}
              </Label>
              <Input
                id="platformName"
                value={formData.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11 focus:border-gray-300 focus:ring-0"
              />
            </div>

            {/* Support Email Address */}
            <div className="space-y-2 text-start">
              <Label htmlFor="supportEmail" className="text-gray-700 font-normal">
                {t('support_email_address')}
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
        <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 mb-6 text-start">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 text-start">
            {t('security_access')}
          </h2>

          {/* Minimum Password Length */}
          <div className="space-y-2 max-w-md text-start">
            <Label htmlFor="minPasswordLength" className="text-gray-700 font-normal">
              {t('min_password_length')}
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
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 h-12 sm:h-11 bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-700 rounded-lg font-medium shadow-sm order-1 sm:order-2"
          >
            {isLoading ? t('saving_dots') : t('save_changes')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationPage;