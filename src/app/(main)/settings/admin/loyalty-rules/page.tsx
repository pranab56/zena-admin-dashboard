'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LoyaltyRulesPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <Card className="border-none shadow bg-gray-50/50">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{t('smart_rules')}</h1>
          <p className="text-gray-500">
            {t('smart_rules_desc')}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('smart_rules')}</h2>

          <div className="space-y-4">
            {/* Every Visit */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">{t('every_visit')}</span>
                <span className="text-gray-400">{t('example')}</span>
                <span className="font-semibold text-gray-600">+100 {t('pts')}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">+100 {t('pts')}</span>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    {t('edit')}
                  </Button>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>

            {/* If Time Between */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">{t('if_time_between')}</span>
                <span className="text-gray-400">{t('example')}</span>
                <span className="font-semibold text-gray-600">10:00 AM</span>
                <span className="text-gray-700 font-medium">{t('and')}</span>
                <span className="text-gray-400">{t('example')}</span>
                <span className="font-semibold text-gray-600">02:00 PM</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">{t('visit_earns')} + 150 {t('pts')}</span>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    {t('edit')}
                  </Button>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>

            {/* If Visits In */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">
                  {t('if_visits_in', { count: 3, days: 30 })}
                </span>
                <span className="font-medium">{t('customer_earns')}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">{t('example')} +200 {t('pts')}</span>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    {t('edit')}
                  </Button>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>

            {/* If Invite Friend */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">{t('if_invite_friend')}</span>
                <span className="text-gray-400">{t('example')}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">{t('example')} + 100 {t('pts')}</span>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    {t('edit')}
                  </Button>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#A8D1B1] hover:bg-[#96C09F] text-[#4A6752] font-semibold h-12 px-10 rounded-xl shadow-sm gap-2 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              {t('add_rule')}
            </Button>
          </div>
        </div>
      </div>

      {/* Reward Targets Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('reward_targets')}</h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            {t('reward_targets_desc')}
          </p>

          <div className="space-y-4">
            {/* Tier 1 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">{t('tier_1')}</span>
                <span className="text-gray-400">{t('example')}</span>
                <span className="font-semibold text-gray-600">400 {t('pts')}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    {t('edit')}
                  </Button>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">{t('tier_2')}</span>
                <span className="text-gray-400">{t('example')}</span>
                <span className="font-semibold text-gray-600">700 {t('pts')}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    {t('edit')}
                  </Button>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>

            {/* VIP */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">{t('vip')}</span>
                <span className="text-gray-400">{t('example')}</span>
                <span className="font-semibold text-gray-600">1000 {t('pts')}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    {t('edit')}
                  </Button>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button className="bg-[#A8D1B1] hover:bg-[#96C09F] text-[#4A6752] font-semibold h-12 px-10 rounded-xl shadow-sm gap-2 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
              {t('add_reward_tier')}
            </Button>
          </div>
        </div>
      </div>

      {/* Add New Rule Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95%] sm:max-w-[600px] p-0 overflow-hidden rounded-3xl sm:rounded-[2rem] border-none max-h-[90vh] overflow-y-auto">
          <div className="p-6 sm:p-8">
            <DialogHeader className="relative mb-6 sm:mb-8">
              <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                {t('add_new_rule_title')}
              </DialogTitle>
              <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-relaxed">
                {t('add_new_rule_desc')}
              </p>
              <DialogClose className="absolute -top-2 -right-2 sm:right-[-10px] sm:top-[-10px] bg-white rounded-full p-2 text-pink-400 hover:bg-pink-50 border border-pink-100 transition-all shadow-sm">
              </DialogClose>

            </DialogHeader>

            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm sm:base">{t('rule_name')} <span className="text-pink-400">*</span></Label>
                <Input
                  placeholder="e.g., Happy Hour Double Points"
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm sm:base">{t('applicable_days')} <span className="text-pink-400">*</span></Label>
                <Input
                  placeholder={t('category_placeholder')}
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm sm:base">{t('custom_points_multiplier')}</Label>
                <Input
                  placeholder="2.0"
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm sm:base">{t('description')}</Label>
                <Textarea
                  placeholder={t('description_placeholder')}
                  className="min-h-[100px] sm:min-h-[120px] rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 resize-none text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl border-[#FF8FAB] text-[#FF8FAB] hover:bg-pink-50 font-medium text-sm sm:text-base"
                >
                  {t('cancel')}
                </Button>
                <Button
                  className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl bg-[#A8D1B1] hover:bg-[#96C09F] text-[#4A6752] font-medium text-sm sm:text-base"
                >
                  {t('save_rule')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoyaltyRulesPage;
