'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const VisitBasedLogicPage = () => {
  const [formData, setFormData] = useState({
    pointsPerVisit: '100',
    pointsPerInviteFriend: '100',
    bonusRewardCount: '1',
    maxVisitsPerMonth: '3',
    automaticPointsAwarding: true,
    manualStaffOverride: true,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
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

  return (
    <div className="">
      <div className="">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Visit-Based Logic
          </h1>
          <p className="text-gray-600">
            Define how customers earn rewards for their salon visits and check-ins.
          </p>
        </div>

        {/* Visit Rewards and Invite Friend Rewards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Visit Rewards Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Visit Rewards
            </h2>
            <div className="space-y-2">
              <Label htmlFor="pointsPerVisit" className="text-gray-700 font-normal">
                Points per Visit
              </Label>
              <Input
                id="pointsPerVisit"
                type="number"
                value={formData.pointsPerVisit}
                onChange={(e) => handleInputChange('pointsPerVisit', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11 focus:border-gray-300 focus:ring-0"
              />
            </div>
          </div>

          {/* Invite Friend Rewards Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Invite Friend Rewards
            </h2>
            <div className="space-y-2">
              <Label htmlFor="pointsPerInviteFriend" className="text-gray-700 font-normal">
                Points per Invite Friend
              </Label>
              <Input
                id="pointsPerInviteFriend"
                type="number"
                value={formData.pointsPerInviteFriend}
                onChange={(e) => handleInputChange('pointsPerInviteFriend', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11 focus:border-gray-300 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Monthly Limits Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Monthly Limits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bonus Reward Count */}
            <div className="space-y-2">
              <Label htmlFor="bonusRewardCount" className="text-gray-700 font-normal">
                Bonus Reward Count
              </Label>
              <Input
                id="bonusRewardCount"
                type="number"
                value={formData.bonusRewardCount}
                onChange={(e) => handleInputChange('bonusRewardCount', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11 focus:border-gray-300 focus:ring-0"
              />
            </div>

            {/* Max Visits per Month */}
            <div className="space-y-2">
              <Label htmlFor="maxVisitsPerMonth" className="text-gray-700 font-normal">
                Max Visits per Month
              </Label>
              <Input
                id="maxVisitsPerMonth"
                type="number"
                value={formData.maxVisitsPerMonth}
                onChange={(e) => handleInputChange('maxVisitsPerMonth', e.target.value)}
                className="bg-gray-50 border-gray-200 h-11 focus:border-gray-300 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Staff Controls & Permissions Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Staff Controls & Permissions
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Automatic Points Awarding */}
            <div className="border border-pink-200 rounded-lg p-5 bg-pink-50/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-gray-800 font-medium mb-1">
                    Automatic Points Awarding
                  </h3>
                  <p className="text-sm text-gray-600">
                    Issue points automatically upon service completion.
                  </p>
                </div>
                <Switch
                  checked={formData.automaticPointsAwarding}
                  onCheckedChange={(checked) => handleSwitchChange('automaticPointsAwarding', checked)}
                  className="data-[state=checked]:bg-pink-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Manual Staff Override */}
            <div className="border border-pink-200 rounded-lg p-5 bg-pink-50/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-gray-800 font-medium mb-1">
                    Manual Staff Override
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enable staff to modify points during a visit.
                  </p>
                </div>
                <Switch
                  checked={formData.manualStaffOverride}
                  onCheckedChange={(checked) => handleSwitchChange('manualStaffOverride', checked)}
                  className="data-[state=checked]:bg-pink-400 cursor-pointer"
                />
              </div>
            </div>
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
            className="px-8 h-11 bg-primary hover:bg-primary text-gray-700 rounded-lg font-medium shadow-sm"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitBasedLogicPage;