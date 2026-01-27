'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface Customer {
  id: string
  name: string
  visits: number
  points: string
  avatarUrl: string
}

const customersData: Customer[] = [
  {
    id: '1',
    name: 'Sarah Ahmed',
    visits: 12,
    points: '1.2k',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    visits: 12,
    points: '1.2k',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },
  {
    id: '3',
    name: 'Sarah Ahmed',
    visits: 12,
    points: '1.2k',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },

]

export default function MostActiveCustomers() {
  return (
    <div className="w-full h-full">
      <Card className="border-none shadow-sm rounded-2xl bg-white h-full flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-10 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-0 sm:pb-3 gap-2">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">
              Elite Customers
            </h2>
            <Badge className="bg-[#EEF8ED] text-[#2F6B43] border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">
              Live Ranking
            </Badge>
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 custom-scrollbar">
          <div className="px-4">
            {customersData.map((customer, index) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 rounded-3xl transition-all duration-300 hover:bg-gray-50 group border border-transparent hover:border-gray-100"
              >
                {/* Left side - Avatar and Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14 ring-4 ring-white shadow-lg transition-transform group-hover:scale-105 duration-500">
                      <AvatarImage
                        src={customer.avatarUrl}
                        alt={customer.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-100 text-[#A8D5BA] text-lg font-black">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-[#A8D5BA] text-white text-[10px] font-medium rounded-lg flex items-center justify-center shadow-md">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 leading-tight group-hover:text-[#D45D8A] transition-colors">
                      {customer.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        Engagement:
                      </span>
                      <span className="text-sm font-bold text-gray-500">
                        {customer.visits} visits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Points Badge */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Yield</span>
                  <Badge className="bg-[#A8D5BA] text-[#2F6B43] px-5 py-2 rounded-2xl text-xs font-black border-0 shadow-lg shadow-gray-100 transition-all hover:translate-y-[-2px]">
                    {customer.points} PTS
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}