'use client'

import { Badge } from '@/components/ui/badge'
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-8 pt-6 gap-2">
          <h1 className="text-lg md:text-2xl font-serif font-semibold">
            {t('pending_redemptions')}
          </h1>
          <button className="text-gray-600 hover:text-gray-800 font-medium text-sm hover:underline cursor-pointer">
            {t('view_all', { defaultValue: 'View All' })}
          </button>
        </div>

        {/* Table */}
        <div className="p-4 md:p-8">
          <div className="rounded-xl overflow-x-auto custom-scrollbar">
            <div className="min-w-[600px]">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-[#EEF8ED] border-b border-green-200">
                <div className="text-sm font-medium text-gray-700">{t('phone_number')}</div>
                <div className="text-sm font-medium text-gray-700">{t('reward_name', { defaultValue: 'Reward Name' })}</div>
                <div className="text-sm font-medium text-gray-700">{t('points_required', { defaultValue: 'Points Required' })}</div>
                <div className="text-sm font-medium text-gray-700">{t('status')}</div>
              </div>

              {/* Table Body */}
              <div className="">
                {displayData.map((item: RedemptionItem, index: number) => (
                  <div
                    key={item._id || index}
                    className="grid grid-cols-4 gap-4 px-6 py-5 items-center transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="text-gray-800 font-medium">{item.phoneNumber}</div>
                    <div className="text-gray-800 font-medium">{item.rewardName}</div>
                    <div className="text-gray-800 font-medium">{item.rewardPoints}</div>
                    <div>
                      {item.status.toLowerCase() === 'approved' ? (
                        <Badge className="bg-green-100 hover:bg-green-200 text-green-500 px-4 py-1.5 rounded-full font-medium">
                          {t('approved')}
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-500 px-4 py-1.5 rounded-full font-medium">
                          {t('pending')}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}