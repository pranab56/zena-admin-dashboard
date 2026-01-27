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
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/visits")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">All Confirmed Visits</h1>
          <p className="text-gray-500 text-sm md:text-base mt-1">A complete history of award points and customer sessions</p>
        </div>
      </div>

      {/* Visits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {visits.map((visit, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:border-[#A8D5BA]/30 hover:shadow-md transition-all group"
          >
            {/* Checkmark Icon */}
            <div className="bg-[#EEF8ED] rounded-2xl w-14 h-14 flex items-center justify-center shrink-0 border border-green-50 transition-transform group-hover:scale-105">
              <Check className="w-7 h-7 text-[#2F6B43]" strokeWidth={3} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-800 leading-tight">
                  {visit.name}
                </h3>
                <span className="text-sm font-bold bg-[#FDF2F5] text-[#D45D8A] px-3 py-1 rounded-lg">
                  {visit.points}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm font-medium">
                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                Confirmed {visit.confirmedTime}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-8 pb-6 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => { }}
          className="h-10 px-4 rounded-xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50 flex gap-2"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 h-10 w-10 rounded-xl font-bold shadow-sm"
          >
            1
          </Button>

          <Button
            variant="ghost"
            className="text-gray-500 hover:bg-gray-100 h-10 w-10 rounded-xl font-bold"
          >
            2
          </Button>

          <div className="px-1">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>

          <Button
            variant="ghost"
            className="text-gray-500 hover:bg-gray-100 h-10 w-10 rounded-xl font-bold"
          >
            5
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => { }}
          className="bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 h-10 px-4 rounded-xl border-none font-bold shadow-sm flex gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}