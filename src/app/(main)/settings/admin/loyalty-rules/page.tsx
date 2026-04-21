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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  useAllRuleQuery,
  useAllSmartRuleQuery,
  useAllTireQuery,
  useCreateRuleMutation,
  useCreateTireMutation,
  useDeleteRuleMutation,
  useUpdateRuleMutation,
  useUpdateSmartRuleMutation,
  useUpdateTireMutation,
  useUpdateTireStatusMutation,
  useUpdateSmartRuleBodyMutation
} from '@/features/admin/settings/settingsApi';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const LoyaltyRulesPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTireModalOpen, setIsTireModalOpen] = useState(false);
  const [editingTire, setEditingTire] = useState<{ _id: string; tireName: string; tireCoins: number; isActive: boolean } | null>(null);

  const [isSmartEditModalOpen, setIsSmartEditModalOpen] = useState(false);
  const [editingSmartRule, setEditingSmartRule] = useState<{ key: string; label: string; value: number } | null>(null);

  // APIs
  const { data: smartRuleRes } = useAllSmartRuleQuery(undefined);
  const [updateSmartRule] = useUpdateSmartRuleMutation();
  const [updateSmartRuleBody, { isLoading: isUpdatingSmartBody }] = useUpdateSmartRuleBodyMutation();

  const { data: tiresRes } = useAllTireQuery(undefined);
  const [createTire, { isLoading: isCreatingTire }] = useCreateTireMutation();
  const [updateTire, { isLoading: isUpdatingTire }] = useUpdateTireMutation();
  const [updateTireStatus] = useUpdateTireStatusMutation();

  const { data: rulesRes } = useAllRuleQuery(undefined);
  const [createRule, { isLoading: isCreatingRule }] = useCreateRuleMutation();
  const [updateRule] = useUpdateRuleMutation();
  const [deleteRule] = useDeleteRuleMutation();

  const smartRule = smartRuleRes?.data || {};
  const tires = tiresRes?.data || [];
  const rules = rulesRes?.data || [];

  const handleSmartRuleToggle = async (key: string, value: boolean) => {
    if (!smartRule?._id) return;
    try {
      await updateSmartRule({ id: smartRule._id, data: { [key]: value } }).unwrap();
      toast.success('Smart Rule updated');
    } catch {
      toast.error('Failed to update Smart Rule');
    }
  };

  const handleSmartRuleBodyUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSmartRule) return;

    const formData = new FormData(e.currentTarget);
    const newValue = parseInt(formData.get('value') as string);

    try {
      await updateSmartRuleBody({
        data: {
          ruleType: 'smartRule',
          [editingSmartRule.key]: newValue,
        },
      }).unwrap();
      toast.success('Smart Rule updated successfully');
      setIsSmartEditModalOpen(false);
      setEditingSmartRule(null);
    } catch {
      toast.error('Failed to update Smart Rule');
    }
  };

  const handleTireToggle = async (id: string) => {
    try {
      await updateTireStatus(id).unwrap();
      toast.success('Tier status updated');
    } catch {
      toast.error('Failed to update Tier status');
    }
  };

  const handleRuleToggle = async (id: string, isActive: boolean) => {
    try {
      await updateRule({ id, data: { isActive } }).unwrap();
      toast.success('Rule updated');
    } catch {
      toast.error('Failed to update Rule');
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await deleteRule(id).unwrap();
      toast.success('Rule deleted');
    } catch {
      toast.error('Failed to delete Rule');
    }
  };

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
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">+{smartRule?.everyVisitCoins || 0} {t('pts')}</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSmartRule({ key: 'everyVisitCoins', label: t('every_visit'), value: smartRule?.everyVisitCoins || 0 });
                      setIsSmartEditModalOpen(true);
                    }}
                    className="h-9 px-4 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95"
                  >
                    {t('edit')}
                  </Button>
                  <Switch
                    checked={smartRule?.everyVisitIsActive || false}
                    onCheckedChange={(c) => handleSmartRuleToggle('everyVisitIsActive', c)}
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>

            {/* If Time Between */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">{t('if_time_between')}</span>
                <span className="font-semibold text-gray-600 ml-2">
                  {smartRule?.timeZoneStart || 0}:00
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingSmartRule({ key: 'timeZoneStart', label: 'Start Time', value: smartRule?.timeZoneStart || 0 });
                      setIsSmartEditModalOpen(true);
                    }}
                    className="h-6 px-1 ml-1 text-xs text-pink-400 hover:text-pink-600"
                  >
                    {t('edit')}
                  </Button>
                </span>
                <span className="text-gray-700 font-medium px-2">{t('and')}</span>
                <span className="font-semibold text-gray-600">
                  {smartRule?.timeZoneEnd || 0}:00
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingSmartRule({ key: 'timeZoneEnd', label: 'End Time', value: smartRule?.timeZoneEnd || 0 });
                      setIsSmartEditModalOpen(true);
                    }}
                    className="h-6 px-1 ml-1 text-xs text-pink-400 hover:text-pink-600"
                  >
                    {t('edit')}
                  </Button>
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">{t('visit_earns')} + {smartRule?.timeZoneGetCoin || 0} {t('pts')}</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSmartRule({ key: 'timeZoneGetCoin', label: t('if_time_between'), value: smartRule?.timeZoneGetCoin || 0 });
                      setIsSmartEditModalOpen(true);
                    }}
                    className="h-9 px-4 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95"
                  >
                    {t('edit')}
                  </Button>
                  <Switch
                    checked={smartRule?.timeZoneIsActive || false}
                    onCheckedChange={(c) => handleSmartRuleToggle('timeZoneIsActive', c)}
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>

            {/* If Visits In */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">
                  If total {smartRule?.totalVist || 0} visits
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingSmartRule({ key: 'totalVist', label: 'Total Visits Count', value: smartRule?.totalVist || 0 });
                      setIsSmartEditModalOpen(true);
                    }}
                    className="h-6 px-1 ml-1 text-xs text-pink-400 hover:text-pink-600"
                  >
                    {t('edit')}
                  </Button>
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">{t('example')} +{smartRule?.totalVisitGetCoin || 0} {t('pts')}</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSmartRule({ key: 'totalVisitGetCoin', label: t('total_visits'), value: smartRule?.totalVisitGetCoin || 0 });
                      setIsSmartEditModalOpen(true);
                    }}
                    className="h-9 px-4 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95"
                  >
                    {t('edit')}
                  </Button>
                  <Switch
                    checked={smartRule?.totalVisitIsActive || false}
                    onCheckedChange={(c) => handleSmartRuleToggle('totalVisitIsActive', c)}
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>

            {/* If Invite Friend */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">{t('if_invite_friend')}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">{t('example')} + {smartRule?.inviteEarCoin || 0} {t('pts')}</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSmartRule({ key: 'inviteEarCoin', label: t('if_invite_friend'), value: smartRule?.inviteEarCoin || 0 });
                      setIsSmartEditModalOpen(true);
                    }}
                    className="h-9 px-4 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95"
                  >
                    {t('edit')}
                  </Button>
                  <Switch
                    checked={smartRule?.inviteEarIsActive || false}
                    onCheckedChange={(c) => handleSmartRuleToggle('inviteEarIsActive', c)}
                    className="data-[state=checked]:bg-[#FF8FAB]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time & Day Rules Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Time & Day Rules</h2>

          <div className="space-y-4">
            {rules?.map((rule: { _id: string; ruleName: string; applicableDays: string; timeStart: number; timeEnd: number; description: string; pointsMultiplier: number; isActive: boolean }) => (
              <div key={rule._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
                <div className="flex flex-col gap-1 text-gray-700">
                  <span className="font-bold text-lg">{rule.ruleName}</span>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-md">{rule.applicableDays}</span>
                    <span>{rule.timeStart}:00 - {rule.timeEnd}:00</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <span className="text-gray-800 font-bold whitespace-nowrap">x {rule.pointsMultiplier} {t('pts')}</span>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule._id)} className="text-red-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(c) => handleRuleToggle(rule._id, c)}
                      className="data-[state=checked]:bg-[#FF8FAB]"
                    />
                  </div>
                </div>
              </div>
            ))}

            {rules?.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                No time & day rules found.
              </div>
            )}
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
            {tires?.map((tire: { _id: string; tireName: string; tireCoins: number; isActive: boolean }) => (
              <div key={tire._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
                <div className="flex flex-wrap items-center gap-1 text-gray-700">
                  <span className="font-medium">{tire.tireName}</span>
                  <span className="font-semibold text-gray-600 ml-4">{tire.tireCoins} {t('pts')}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTire(tire);
                        setIsTireModalOpen(true);
                      }}
                      className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95">
                      {t('edit')}
                    </Button>
                    <Switch
                      checked={tire.isActive}
                      onCheckedChange={() => handleTireToggle(tire._id)}
                      className="data-[state=checked]:bg-[#FF8FAB]"
                    />
                  </div>
                </div>
              </div>
            ))}

            {tires?.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                No tiers found.
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => {
                setEditingTire(null);
                setIsTireModalOpen(true);
              }}
              className="bg-[#A8D1B1] hover:bg-[#96C09F] text-[#4A6752] font-semibold h-12 px-10 rounded-xl shadow-sm gap-2 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
              {t('add_reward_tier')}
            </Button>
          </div>
        </div>
      </div>

      {/* Add New Rule Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95%] sm:max-w-[600px] p-0 overflow-hidden rounded-3xl sm:rounded-[2rem] border-none max-h-[90vh] overflow-y-auto">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('ruleName') as string;
              const daysStr = formData.get('applicableDays') as string;
              const timeStartStr = formData.get('timeStart') as string;
              const timeEndStr = formData.get('timeEnd') as string;
              const timeStart = timeStartStr ? parseInt(timeStartStr.split(':')[0]) : 0;
              const timeEnd = timeEndStr ? parseInt(timeEndStr.split(':')[0]) : 24;
              const pointsMultiplier = parseFloat(formData.get('pointsMultiplier') as string) || 1;
              const desc = formData.get('description') as string;

              const payload = {
                ruleName: name,
                applicableDays: daysStr,
                timeStart,
                timeEnd,
                pointsMultiplier,
                description: desc,
              };

              try {
                await createRule(payload).unwrap();
                toast.success('Time & Day rule created successfully');
                setIsModalOpen(false);
              } catch {
                toast.error('Failed to create rule');
              }
            }}
          >
            <div className="p-6 sm:p-8">
              <DialogHeader className="relative mb-6 sm:mb-8">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {t('add_new_rule_title', 'Add Time & Day Rule')}
                </DialogTitle>
                <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-relaxed">
                  {t('add_new_rule_desc', 'Configure a new Time & Day rule for your store.')}
                </p>
                <DialogClose className="absolute -top-2 -right-2 sm:right-[-10px] sm:top-[-10px] bg-white rounded-full p-2 text-pink-400 hover:bg-pink-50 border border-pink-100 transition-all shadow-sm">
                </DialogClose>
              </DialogHeader>

              <div className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:base">{t('rule_name')} <span className="text-pink-400">*</span></Label>
                  <Input
                    name="ruleName"
                    required
                    placeholder="e.g., Happy Hour Double Points"
                    className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:base">{t('applicable_days')} <span className="text-pink-400">*</span></Label>
                  <Select name="applicableDays" required>
                    <SelectTrigger className="h-11 sm:h-12 w-full py-6 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] text-[15px] sm:text-base data-[placeholder]:text-gray-400">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-sm">
                      <SelectItem value="Sunday">Sunday</SelectItem>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm sm:base">Start Time <span className="text-pink-400">*</span></Label>
                    <Input
                      name="timeStart"
                      type="time"
                      required
                      className="h-11 sm:h-12 w-full rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base [color-scheme:light]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm sm:base">End Time <span className="text-pink-400">*</span></Label>
                    <Input
                      name="timeEnd"
                      type="time"
                      required
                      className="h-11 sm:h-12 w-full rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base [color-scheme:light]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:base">{t('custom_points_multiplier')} <span className="text-pink-400">*</span></Label>
                  <Input
                    name="pointsMultiplier"
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 2.0 or 50"
                    className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:base">{t('description')}</Label>
                  <Textarea
                    name="description"
                    placeholder={t('description_placeholder')}
                    className="min-h-[100px] sm:min-h-[120px] rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 resize-none text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl border-[#FF8FAB] text-[#FF8FAB] hover:bg-pink-50 font-medium text-sm sm:text-base"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingRule}
                    className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl bg-[#A8D1B1] hover:bg-[#96C09F] text-[#4A6752] font-medium text-sm sm:text-base"
                  >
                    {isCreatingRule ? 'Saving...' : t('save_rule')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Reward Tier Modal */}
      <Dialog open={isTireModalOpen} onOpenChange={setIsTireModalOpen}>
        <DialogContent className="w-[95%] sm:max-w-[400px] p-0 overflow-hidden rounded-3xl sm:rounded-[2rem] border-none">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('tireName') as string;
              const coins = parseInt(formData.get('tireCoins') as string) || 0;

              try {
                if (editingTire) {
                  await updateTire({ id: editingTire._id, data: { tireName: name, tireCoins: coins } }).unwrap();
                  toast.success('Tier updated successfully');
                } else {
                  await createTire({ tireName: name, tireCoins: coins }).unwrap();
                  toast.success('Tier created successfully');
                }
                setIsTireModalOpen(false);
                setEditingTire(null);
              } catch {
                toast.error(editingTire ? 'Failed to update Tier' : 'Failed to create Tier');
              }
            }}
          >
            <div className="p-6 sm:p-8">
              <DialogHeader className="relative mb-6 sm:mb-8">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {editingTire ? t('edit_reward_tier', 'Edit Reward Tier') : t('add_reward_tier', 'Add Reward Tier')}
                </DialogTitle>
                <DialogClose className="absolute -top-2 -right-2 sm:right-[-10px] sm:top-[-10px] bg-white rounded-full p-2 text-pink-400 hover:bg-pink-50 border border-pink-100 transition-all shadow-sm">
                </DialogClose>
              </DialogHeader>

              <div className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:base">Tier Name <span className="text-pink-400">*</span></Label>
                  <Input
                    name="tireName"
                    required
                    defaultValue={editingTire ? editingTire.tireName : ''}
                    placeholder="e.g., GOLDEN"
                    className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:base">Tier Coins <span className="text-pink-400">*</span></Label>
                  <Input
                    name="tireCoins"
                    type="number"
                    required
                    defaultValue={editingTire ? editingTire.tireCoins : ''}
                    placeholder="e.g., 700"
                    className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsTireModalOpen(false)}
                    className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl border-[#FF8FAB] text-[#FF8FAB] hover:bg-pink-50 font-medium text-sm sm:text-base"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingTire || isUpdatingTire}
                    className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl bg-[#A8D1B1] hover:bg-[#96C09F] text-[#4A6752] font-medium text-sm sm:text-base"
                  >
                    {isCreatingTire || isUpdatingTire ? 'Saving...' : t('save')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Smart Rule Modal */}
      <Dialog open={isSmartEditModalOpen} onOpenChange={setIsSmartEditModalOpen}>
        <DialogContent className="w-[95%] sm:max-w-[400px] p-0 overflow-hidden rounded-3xl sm:rounded-[2rem] border-none">
          <form onSubmit={handleSmartRuleBodyUpdate}>
            <div className="p-6 sm:p-8">
              <DialogHeader className="relative mb-6 sm:mb-8">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {t('edit')} {editingSmartRule?.label}
                </DialogTitle>
                <DialogClose className="absolute -top-2 -right-2 sm:right-[-10px] sm:top-[-10px] bg-white rounded-full p-2 text-pink-400 hover:bg-pink-50 border border-pink-100 transition-all shadow-sm">
                </DialogClose>
              </DialogHeader>

              <div className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm sm:base">Value <span className="text-pink-400">*</span></Label>
                  <Input
                    name="value"
                    type="number"
                    required
                    defaultValue={editingSmartRule?.value}
                    placeholder="Enter value"
                    className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSmartEditModalOpen(false)}
                    className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl border-[#FF8FAB] text-[#FF8FAB] hover:bg-pink-50 font-medium text-sm sm:text-base"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdatingSmartBody}
                    className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl bg-[#A8D1B1] hover:bg-[#96C09F] text-[#4A6752] font-medium text-sm sm:text-base"
                  >
                    {isUpdatingSmartBody ? 'Saving...' : t('save')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoyaltyRulesPage;
