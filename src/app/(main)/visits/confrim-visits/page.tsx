"use client";
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConfirmedVisits() {
  const router = useRouter()
  const visits = Array(6).fill({
    name: 'Michael Chen',
    confirmedTime: '12 mins ago',
    points: '+35 PTS'
  });

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <ChevronLeft onClick={() => router.push("/visits")} className="w-6 h-6 cursor-pointer text-gray-800" />
          <h1 className="text-2xl font-normal text-gray-800">All Confirmed Visits</h1>
        </div>

        {/* Visits List */}
        <div className="space-y-4 mb-6">
          {visits.map((visit, index) => (
            <div
              key={index}
              className="border border-primary rounded-lg p-4 flex items-center gap-4"
            >
              {/* Checkmark Icon */}
              <div className="bg-[#a8bda8] rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-800 mb-1">
                  {visit.name}
                </h3>
                <p className="text-sm text-gray-600 mb-0.5">
                  Confirmed {visit.confirmedTime}
                </p>
                <p className="text-sm text-[#c67b7b] font-medium">
                  {visit.points}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            className="bg-[#9d9d9d] hover:bg-[#8d8d8d] text-gray-700 h-10 px-4 rounded"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <Button
            variant="ghost"
            className="bg-[#a8bda8] hover:bg-[#98ad98] text-gray-800 h-10 w-10 rounded font-medium"
          >
            1
          </Button>

          <Button
            variant="ghost"
            className="bg-[#9d9d9d] hover:bg-[#8d8d8d] text-gray-700 h-10 w-10 rounded"
          >
            2
          </Button>

          <Button
            variant="ghost"
            className="bg-[#9d9d9d] hover:bg-[#8d8d8d] text-gray-700 h-10 w-10 rounded"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            className="bg-[#9d9d9d] hover:bg-[#8d8d8d] text-gray-700 h-10 w-10 rounded"
          >
            5
          </Button>

          <Button
            variant="ghost"
            className="bg-[#a8bda8] hover:bg-[#98ad98] text-gray-700 h-10 px-4 rounded"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}