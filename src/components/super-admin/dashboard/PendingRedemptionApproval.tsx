'use client'

import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface RedemptionItem {
  _id?: string
  phoneNumber: string
  rewardName: string
  rewardPoints: number
  status: string
}

interface PendingRedemptionApprovalProps {
  redemptions?: RedemptionItem[];
}

export default function PendingRedemptionApproval({ redemptions = [] }: PendingRedemptionApprovalProps) {
  const { t } = useTranslation();
  const displayData = redemptions.length > 0 ? redemptions : [];
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl  border border-gray-200 overflow-hidden flex flex-col h-[500px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-8 py-6 gap-2 shrink-0">
          <h1 className="text-lg md:text-2xl font-serif font-semibold">
            {t('pending_redemptions')}
          </h1>
          <Link href={'/redemption-requests'} className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline cursor-pointer">
            {t('view_all', { defaultValue: 'View All' })}
          </Link>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 md:px-8 pb-4 flex-1 flex flex-col min-h-0">
            <div className="rounded-xl border border-gray-100 flex flex-col h-full overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[700px]">
                  {/* Table Header - Sticky */}
                  <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-[#EEF8ED] border-b border-green-200 sticky top-0 z-10">
                    <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('phone_number')}</div>
                    <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('reward_name', { defaultValue: 'Reward Name' })}</div>
                    <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('points_required', { defaultValue: 'Points Required' })}</div>
                    <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">{t('status')}</div>
                  </div>

                  {/* Table Body - Scrollable */}
                  <div className="overflow-y-auto max-h-[320px] custom-scrollbar">
                    {displayData.map((item: RedemptionItem, index: number) => (
                      <div
                        key={item._id || index}
                        className="grid grid-cols-4 gap-4 px-6 py-4 items-center transition-colors border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                      >
                        <div className="text-gray-800 font-medium text-sm">{item.phoneNumber}</div>
                        <div className="text-gray-800 font-medium text-sm">{item.rewardName}</div>
                        <div className="text-gray-800 font-bold text-sm">{item.rewardPoints}</div>
                        <div>
                          {item.status.toLowerCase() === 'approved' ? (
                            <Badge className="bg-green-100 hover:bg-green-200 text-green-600 px-4 py-1 rounded-full font-bold text-[10px] border-none shadow-none">
                              {t('approved')}
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full font-bold text-[10px] border-none shadow-none">
                              {t('pending')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {displayData.length === 0 && (
                      <div className="py-10 text-center text-gray-400 italic">No pending redemptions</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}