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

const LoyaltyRulesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [smartRules, setSmartRules] = useState([
    { id: 1, title: 'Every Visit', example: '+100 pts', active: true },
    { id: 2, title: 'If Time Between', example: '10:00 AM and 02:00 PM', value: 'Visit earns +150 pts', active: true },
    { id: 3, title: 'If', example: '3 Visits In 30 Days', value: 'Customer earns +200 pts', active: true },
    { id: 4, title: 'If Invite Friend, Customer earns', example: '+100 pts', active: true },
  ]);

  const [rewardTargets, setRewardTargets] = useState([
    { id: 1, title: 'Tier 1', example: '400 pts', active: true },
    { id: 2, title: 'Tier 2', example: '700 pts', active: true },
    { id: 3, title: 'VIP', example: '1000 pts', active: true },
  ]);

  const toggleRule = (id: number) => {
    setSmartRules(prev => prev.map(rule => rule.id === id ? { ...rule, active: !rule.active } : rule));
  };

  const toggleTarget = (id: number) => {
    setRewardTargets(prev => prev.map(target => target.id === id ? { ...target, active: !target.active } : target));
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <Card className="border-none shadow bg-gray-50/50">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Smart Rules</h1>
          <p className="text-gray-500">
            Create custom loyalty rules. Conditions stack together to <span className="font-medium text-gray-400">Editable</span> define how customers earn points.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Smart Rules</h2>

          <div className="space-y-4">
            {/* Every Visit */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">Every Visit</span>
                <span className="text-gray-400">Example:</span>
                <span className="font-semibold text-gray-600">+100 pts</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">+100 pts</span>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    Edit
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
                <span className="font-medium">If Time Between</span>
                <span className="text-gray-400">Example:</span>
                <span className="font-semibold text-gray-600">10:00 AM</span>
                <span className="text-gray-700 font-medium">and</span>
                <span className="text-gray-400">Example:</span>
                <span className="font-semibold text-gray-600">0200 PM</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">Visit earns + 150 pts</span>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    Edit
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
                <span className="font-medium">If</span>
                <span className="text-gray-400">Example:</span>
                <span className="font-semibold text-gray-600">3 Visits In</span>
                <span className="text-gray-400">Example:</span>
                <span className="font-semibold text-gray-600">30 Days,</span>
                <span className="font-medium">Customer earns</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">Example: +200 pts</span>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    Edit
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
                <span className="font-medium">If Invite Friend, Customer earns</span>
                <span className="text-gray-400">Example:</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-gray-800 font-bold">Example: + 100 pts</span>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    Edit
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
              Add Rule
            </Button>
          </div>
        </div>
      </div>

      {/* Reward Targets Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Reward Targets</h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            Configure how many points customers need to earn a reward. All salons use these tiers.
          </p>

          <div className="space-y-4">
            {/* Tier 1 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4">
              <div className="flex flex-wrap items-center gap-1 text-gray-700">
                <span className="font-medium">Tier 1</span>
                <span className="text-gray-400">Example:</span>
                <span className="font-semibold text-gray-600">400 pts</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    Edit
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
                <span className="font-medium">Tier 2</span>
                <span className="text-gray-400">Example:</span>
                <span className="font-semibold text-gray-600">700 pts</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    Edit
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
                <span className="font-medium">VIP</span>
                <span className="text-gray-400">Example:</span>
                <span className="font-semibold text-gray-600">1000 pts</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 px-4 sm:px-6 rounded-lg text-gray-500 border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                    Edit
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
              Add Reward Tier
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
                Add New Time & Day Reward Rule
              </DialogTitle>
              <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-relaxed">
                Configure specific time windows and days when customers earn special rewards to drive traffic during specific hours.
              </p>
              <DialogClose className="absolute -top-2 -right-2 sm:right-[-10px] sm:top-[-10px] bg-white rounded-full p-2 text-pink-400 hover:bg-pink-50 border border-pink-100 transition-all shadow-sm">
              </DialogClose>
            </DialogHeader>

            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm sm:base">Rule Name <span className="text-pink-400">*</span></Label>
                <Input
                  placeholder="e.g., Happy Hour Double Points"
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm sm:base">Applicable Days <span className="text-pink-400">*</span></Label>
                <Input
                  placeholder="Enter the reward category"
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm sm:base">Custom Points Multiplier</Label>
                <Input
                  placeholder="2.0"
                  className="h-11 sm:h-12 rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm sm:base">Description</Label>
                <Textarea
                  placeholder="Describe the purpose of this rule ..."
                  className="min-h-[100px] sm:min-h-[120px] rounded-xl border-gray-200 focus:ring-1 focus:ring-[#A8D1B1] focus:border-[#A8D1B1] placeholder:text-gray-300 resize-none text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl border-[#FF8FAB] text-[#FF8FAB] hover:bg-pink-50 font-medium text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button
                  className="h-11 sm:h-12 w-full sm:w-auto px-10 rounded-xl bg-[#A8D1B1] hover:bg-[#96C09F] text-[#4A6752] font-medium text-sm sm:text-base"
                >
                  Save Rule
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
