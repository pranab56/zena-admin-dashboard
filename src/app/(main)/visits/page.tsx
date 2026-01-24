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
    <div className=" space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Confirm Customer Visit</h1>
        <p className="text-sm text-gray-500 mt-1">
          Identify the customer and add points for today&apos;s session
        </p>
      </div>

      {/* Search Input */}
      <Input
        placeholder="123-2332-233"
        className="w-full border-gray-300 focus:border-gray-400"
      />

      {/* Customer Profile Card */}
      <Card className="p-4 bg-white border border-gray-200">
        <div className="flex items-center gap-4">
          <Image
            src={'/images/image1.jpg'}
            height={1000}
            width={1000}
            alt=''
            className='w-24 h-24 rounded-full'
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">Alex Johnson</h2>
              <Badge variant="secondary" className="bg-pink-500 text-white text-xs px-2 py-1">
                SILVER TIER
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span>123-2332-233</span>
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              <span>ID: #1232</span>
            </div>
          </div>
        </div>

        {/* Balance & Last Visit */}
        <div className="mt-4 flex justify-between p-3 bg-green-50 rounded-md">
          <div>
            <div className="text-xs text-gray-500">Current Balance</div>
            <div className="text-lg font-semibold">432</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Last Visit</div>
            <div className="text-lg font-semibold">Oct 12, 2025</div>
          </div>
        </div>
      </Card>

      {/* Services Used */}
      <Card className="p-4 bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-medium">Services Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
              <div key={service} className="flex items-center gap-2">
                <Checkbox id={`service-${service.toLowerCase().replace(/\s+/g, '-')}`} />
                <Label htmlFor={`service-${service.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing & Points */}
      <Card className="p-4 bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-medium">Billing & Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm">Total Bill Amount</Label>
            <div className="relative">
              <Input
                placeholder="Enter Amount"
                className="pl-3 pr-8 border-green-200 focus:border-green-300"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">$</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visit Details */}
      <Card className="p-4 bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-medium">Visit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm">Points to Add</Label>
            <div className="relative">
              <Input
                defaultValue="100"
                className="pl-3 pr-12 border-green-200 focus:border-green-300"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">PTS</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <div></div>
            <Button className="w-2/12 bg-primary hover:bg-primary text-gray-700">
              Confirm Visit & Award Points
            </Button>
          </div>
        </CardContent>
      </Card>

      <section>
        <div className='flex items-center justify-between pb-3'>
          <h1>Recent Confirmed visits</h1>
          <Link className='text-sm hover:underline text-yellow-500' href="/visits/confrim-visits">View All</Link>
        </div>

        <div className="space-y-4 mb-6">
          {visits.map((visit, index) => (
            <div
              key={index}
              className=" border border-primary rounded-lg p-4 flex items-center gap-4"
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
      </section>
    </div>
  );
}