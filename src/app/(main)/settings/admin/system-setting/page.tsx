'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const SystemConfigurationPage = () => {
  const [formData, setFormData] = useState({
    platformName: 'Zana',
    supportEmail: 'support@loyaltypro.com',
    timezone: 'GMT/UTC (UTC+04:00)',
    minPasswordLength: '8',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving changes:', formData);
    // Add your save logic here
  };

  const handleCancel = () => {
    console.log('Cancelling changes');
    // Add your cancel logic here
  };

  const timezones = [
    'GMT/UTC (UTC+04:00)',
    'GMT/UTC (UTC+00:00)',
    'EST (UTC-05:00)',
    'PST (UTC-08:00)',
    'IST (UTC+05:30)',
    'JST (UTC+09:00)',
  ];

  return (
    <div className="">
      <div className="">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-3">
            System Configuration
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Manage global platform parameters, security protocols, and white-label
            <br />
            Platform Branding branding for all business tenants.
          </p>
        </div>

        {/* General Settings Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
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

          {/* Server Timezone */}
          <div className="space-y-2 w-full">
            <Label htmlFor="timezone" className="text-gray-700 font-normal">
              Server Timezone
            </Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => handleInputChange('timezone', value)}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200 w-full h-11 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Security & Access Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
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
        <div className="flex justify-end gap-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="px-8 h-11 border-2 border-pink-300 text-pink-500 hover:bg-pink-50 hover:text-pink-600 rounded-lg font-medium"
          >
            Cancell
          </Button>
          <Button
            onClick={handleSave}
            className="px-8 h-11 bg-primary hover:bg-green-500 text-gray-700 rounded-lg font-medium shadow-sm"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationPage;