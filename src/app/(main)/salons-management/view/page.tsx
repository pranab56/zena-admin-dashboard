"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SalonProfile() {
  return (
    <div className="psm:px-0 space-y-5">
      {/* Back Button */}
      <div>
        <Link href="/salons-management" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={28} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-[#333]">Luxe Wellness</h1>
          <Badge className="bg-[#D1EBD9] text-[#2F6B43] hover:bg-[#D1EBD9] border-none px-3 py-0.5 font-medium rounded-full shadow-none text-xs">
            Active
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-gray-500 font-medium text-[15px]">
          <span>Salon</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#99BBA4]" />
          <span>ID: SLN-88234</span>
        </div>

        <p className="text-gray-400 text-[15px]">Created since Oct 12, 2023</p>
      </div>

      {/* Business Address Section */}
      <div className="space-y-3">
        <h2 className="text-[13px] font-bold text-gray-600 tracking-wider uppercase">BUSINESS ADDRESS</h2>
        <p className="text-gray-500 text-[15px] font-medium max-w-2xl leading-relaxed">
          742 Evergreen Terrace, Beverly Hills, CA 90210, United States
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100/50" />

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Admin Information */}
        <Card className="bg-[#F8F8F8] border-none rounded-3xl p-1 shadow-none">
          <CardContent className="p-5 sm:p-8 space-y-8 sm:space-y-10">
            <h2 className="text-[19px] font-semibold text-gray-700">Business Admin Information</h2>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase">CONTACT EMAIL</h3>
                <p className="text-gray-500 text-[16px] font-medium">contact@luxewellness.com</p>
              </div>

              <div className="pt-4 border-t border-gray-200/40" />

              <div className="space-y-2">
                <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase">PHONE NUMBER</h3>
                <p className="text-gray-500 text-[16px] font-medium">+1 (555) 012-3456</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Column */}
        <div className="flex flex-col gap-8">
          {/* Total Active Members */}
          <Card className="bg-[#F8F8F8] border-none rounded-3xl p-1 shadow-none h-full">
            <CardContent className="p-6 sm:p-8 flex flex-col justify-center h-full">
              <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase mb-4">TOTAL ACTIVE MEMBERS</h3>
              <p className="text-2xl font-bold text-gray-700">1,248</p>
            </CardContent>
          </Card>

          {/* Points Issued */}
          <Card className="bg-[#F8F8F8] border-none rounded-3xl p-1 shadow-none h-full">
            <CardContent className="p-6 sm:p-8 flex flex-col justify-center h-full">
              <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase mb-4">POINTS ISSUED</h3>
              <p className="text-2xl font-bold text-gray-700">156.4k</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}