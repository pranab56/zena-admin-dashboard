"use client";

import { Users } from 'lucide-react';
import CustomerManagement from '../../../components/super-admin/Customers/CustomerManagement';
import StatsCards from '../../../components/super-admin/dashboard/StatsCards';

const page = () => {
  const data = [
    {
      id: 1,
      title: 'Total Customers',
      value: 43,
      icon: Users
    },
    {
      id: 2,
      title: 'Active Customers',
      value: 8,
      icon: Users
    },
    {
      id: 3,
      title: 'Points Issued Today',
      value: 1200,
      icon: Users
    },
  ];

  return (
    <div className="">
      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={data} />
        <CustomerManagement />
      </div>
    </div>
  );
};

export default page;