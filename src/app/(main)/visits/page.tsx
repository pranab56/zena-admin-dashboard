'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ConfirmCustomerVisit() {

  const visits = Array(2).fill({
    name: 'Michael Chen',
    confirmedTime: '12 mins ago',
    points: '+35 PTS'
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Confirm Customer Visit</h1>
        <p className="text-gray-500 mt-1.5 text-sm md:text-base">
          Identify the customer and add points for today&apos;s session
        </p>
      </div>

      {/* Search Input Section */}
      <div className="space-y-3">
        <Label htmlFor="search-customer" className="text-sm font-semibold text-gray-700 ml-1 uppercase tracking-wider">Search Customer by Phone</Label>
        <Input
          id="search-customer"
          placeholder="e.g. 123-456-7890"
          className="w-full py-6 px-4 border-gray-200 focus:border-[#A8D5BA] focus:ring-[#A8D5BA] text-lg rounded-xl shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-5">
        {/* Left Column - Profile & Services */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Profile Card */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative shrink-0">
                  <Image
                    src={'/images/image1.jpg'}
                    height={120}
                    width={120}
                    alt='Customer'
                    className='w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-white shadow-lg'
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">Alex Johnson</h2>
                    <Badge className="bg-[#D45D8A] text-white hover:bg-[#D45D8A] border-none px-3 py-1 font-bold rounded-full text-[10px] tracking-widest uppercase">
                      SILVER TIER
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-medium text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg">123-2332-233</span>
                    <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-[#A8D5BA]"></span>
                    <span className="bg-gray-100 px-3 py-1 rounded-lg">ID: #1232</span>
                  </div>

                  {/* Balance & Last Visit - Inline for Desktop */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#EEF8ED] p-4 rounded-2xl border border-green-50">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Current Balance</div>
                      <div className="text-xl font-bold text-[#2F6B43]">432 <span className="text-xs font-medium opacity-70 uppercase">pts</span></div>
                    </div>
                    <div className="bg-[#F5F5F3] p-4 rounded-2xl border border-gray-100">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Last Visit</div>
                      <div className="text-xl font-bold text-gray-700">Oct 12, 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Used */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 px-8 py-6">
              <CardTitle className="text-xl font-bold text-gray-800">Services Used</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                {[
                  'Haircut',
                  'Hair Color / Treatment',
                  'Facial Treatment',
                  'Manicure',
                  'Waxing (Body / Face)',
                  'Pedicure',
                  'Nail Art',
                  'Eyelash Extensions',
                  'Eyebrow Threading / Shaping',
                ].map((service) => (
                  <div key={service} className="flex items-center gap-3 group cursor-pointer">
                    <Checkbox
                      id={`service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                      className="w-5 h-5 rounded-md border-gray-300 data-[state=checked]:bg-[#A8D5BA] data-[state=checked]:border-[#A8D5BA]"
                    />
                    <Label
                      htmlFor={`service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[15px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Billing & Action */}
        <div className="lg:col-span-5 space-y-8">
          {/* Billing & Points */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 px-8 py-6">
              <CardTitle className="text-xl font-bold text-gray-800">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-gray-500 tracking-widest uppercase">Total Bill Amount</Label>
                <div className="relative group">
                  <Input
                    placeholder="0.00"
                    className="py-7 pl-6 pr-12 border-gray-200 focus:border-[#A8D5BA] focus:ring-[#A8D5BA] text-xl font-bold rounded-2xl bg-gray-50/50"
                  />
                  <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400">$</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-gray-500 tracking-widest uppercase">Points to Award</Label>
                <div className="relative group">
                  <Input
                    defaultValue="100"
                    className="py-7 pl-6 pr-16 border-gray-200 focus:border-[#A8D5BA] focus:ring-[#A8D5BA] text-xl font-bold rounded-2xl bg-[#EEF8ED] border-none"
                  />
                  <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-sm font-bold text-[#2F6B43]">PTS</span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold text-lg py-8 rounded-2xl shadow-lg shadow-green-100 transition-all hover:translate-y-[-2px] active:translate-y-[0px]">
                  Confirm Visit & Award Points
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Visits Section */}
          <section className="space-y-4">
            <div className='flex items-center justify-between px-2 pt-2'>
              <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
              <Link className='text-xs font-bold uppercase tracking-wider text-[#D45D8A] hover:underline' href="/visits/confrim-visits">View History</Link>
            </div>

            <div className="space-y-4">
              {visits.map((visit, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#A8D5BA]/30 transition-colors"
                >
                  <div className="bg-[#EEF8ED] rounded-xl w-12 h-12 flex items-center justify-center shrink-0 border border-green-50">
                    <Check className="w-6 h-6 text-[#2F6B43]" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[15px] font-bold text-gray-800 leading-tight">
                        {visit.name}
                      </h3>
                      <span className="text-[13px] font-bold text-[#D45D8A]">
                        {visit.points}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-500 mt-0.5">
                      Confirmed {visit.confirmedTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}