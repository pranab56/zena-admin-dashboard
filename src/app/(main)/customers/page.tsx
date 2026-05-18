"use client";

import Loading from '@/components/common/Loading';
import { Card, CardContent } from "@/components/ui/card";
import { useCustomerQuery } from "@/features/admin/customarApi/customarApi";
import { Users } from "lucide-react";
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import CustomerManagement from "../../../components/super-admin/Customers/CustomerManagement";

const formatValue = (value: number): string | number => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

const Page = () => {
  const { t } = useTranslation();
  const { data: apiResponse, isLoading, refetch } = useCustomerQuery({});
  const dashboardData = apiResponse?.dashBoardData;
  const customersData = apiResponse?.data || [];

  const statsData = [
    {
      id: 1,
      title: t('total_customers', { defaultValue: 'Total Customers' }),
      value: dashboardData?.totalCustomer || 0,
      icon: Users,
      bgClass: 'bg-[#EEF8ED]'
    },
    {
      id: 2,
      title: t('active_customers', { defaultValue: 'Active Customers' }),
      value: dashboardData?.activeCustomer || 0,
      icon: Users,
      bgClass: 'bg-[#FFF8F5]'
    },
    {
      id: 3,
      title: t('points_issued_today', { defaultValue: 'Points Issued Today' }),
      value: dashboardData?.todayIssued || 0,
      icon: Users,
      bgClass: 'bg-[#FFF4CC]'
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {statsData.map((stat) => {
            return (
              <Card
                key={stat.id}
                className={`${stat.bgClass} border-none shadow-sm rounded-[1rem] overflow-hidden transition-all`}
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
        <CustomerManagement customers={customersData} refetch={refetch} />
      </div>
    </div>
  );
};

export default Page;
