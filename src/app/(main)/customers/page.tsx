"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import Image from 'next/image';
import CustomerManagement from "../../../components/super-admin/Customers/CustomerManagement";


const formatValue = (value: number): string | number => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

const page = () => {
  const data = [
    {
      id: 1,
      title: "Total Customers",
      value: 43,
      icon: Users,
      bgClass: 'bg-[#EEF8ED]'
    },
    {
      id: 2,
      title: "Active Customers",
      value: 8,
      icon: Users,
      bgClass: 'bg-[#FFF8F5]'
    },
    {
      id: 3,
      title: "Points Issued Today",
      value: 1200,
      icon: Users,
      bgClass: 'bg-[#FFF4CC]'
    },
  ];

  return (
    <div>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.id}
                className={`${stat.bgClass} border-none shadow-sm rounded-[2rem] overflow-hidden transition-all`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-bold text-gray-900">
                        {formatValue(stat.value)}
                      </p>
                    </div>

                    <div className="">
                      <Image src={"/logo/cardUser.png"} alt="icon" width={40} height={40} className='w-full h-full' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customer Management Section */}
        <CustomerManagement />
      </div>
    </div>
  );
};

export default page;
