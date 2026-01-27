'use client'

import { Badge } from '@/components/ui/badge'

interface RedemptionItem {
  phoneNumber: string
  rewardName: string
  pointsRequired: number
  status: 'approve' | 'pending'
}

const redemptionData: RedemptionItem[] = [
  {
    phoneNumber: '+9512732782',
    rewardName: 'Deluxe Hair Spa Treatment',
    pointsRequired: 1500,
    status: 'approve'
  },
  {
    phoneNumber: '+9512732782',
    rewardName: 'Deluxe Hair Spa Treatment',
    pointsRequired: 1500,
    status: 'pending'
  },
  {
    phoneNumber: '+9512732782',
    rewardName: 'Deluxe Hair Spa Treatment',
    pointsRequired: 1500,
    status: 'approve'
  }
]

export default function PendingRedemptionApproval() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-8 pt-6 gap-2">
          <h1 className="text-lg md:text-2xl font-serif font-semibold">
            Pending Redemption Approval
          </h1>
          <button className="text-gray-600 hover:text-gray-800 font-medium text-sm hover:underline cursor-pointer">
            View All
          </button>
        </div>

        {/* Table */}
        <div className="p-4 md:p-8">
          <div className="rounded-xl overflow-x-auto custom-scrollbar">
            <div className="min-w-[600px]">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-[#EEF8ED] border-b border-green-200">
                <div className="text-sm font-medium text-gray-700">Phone Number</div>
                <div className="text-sm font-medium text-gray-700">Reward Name</div>
                <div className="text-sm font-medium text-gray-700">Points Required</div>
                <div className="text-sm font-medium text-gray-700">STATUS</div>
              </div>

              {/* Table Body */}
              <div className="">
                {redemptionData.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 px-6 py-5 items-center transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="text-gray-800 font-medium">{item.phoneNumber}</div>
                    <div className="text-gray-800 font-medium">{item.rewardName}</div>
                    <div className="text-gray-800 font-medium">{item.pointsRequired}</div>
                    <div>
                      {item.status === 'approve' ? (
                        <Badge className="bg-green-100 hover:bg-green-200 text-green-500 px-4 py-1.5 rounded-full font-medium">
                          Approve
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-500 px-4 py-1.5 rounded-full font-medium">
                          Pending
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