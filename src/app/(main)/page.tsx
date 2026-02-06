"use client";

import { Gift, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import MostActiveCustomers from '../../components/super-admin/dashboard/MostActiveCustomers';
import NotificationsList, { type Notification } from '../../components/super-admin/dashboard/NotificationsList';
import PendingRedemptionApproval from '../../components/super-admin/dashboard/PendingRedemptionApproval';
import PointsPieChart from '../../components/super-admin/dashboard/PointsPieChart';
import StatsCards from '../../components/super-admin/dashboard/StatsCards';
import VisitsTrendChart from '../../components/super-admin/dashboard/VisitsTrendChart';

const LoyaltyDashboard = () => {
  // Demo data
  const data = [
    {
      id: 1,
      title: 'Visits Today',
      value: 43,
      icon: Users,
      bgClass: 'bg-green-50'
    },
    {
      id: 2,
      title: 'Rewards Redeemed',
      value: 8,
      icon: Gift,
      bgClass: 'bg-yellow-50'
    },
    {
      id: 4,
      title: 'Points Issued',
      value: 1200,
      icon: TrendingUp,
      bgClass: 'bg-red-50'
    },
  ];

  const [visitsData] = useState([
    { month: 'Jan', visits: 75000 },
    { month: 'Feb', visits: 65000 },
    { month: 'Mar', visits: 110000 },
    { month: 'Apr', visits: 85000 },
    { month: 'May', visits: 78000 },
    { month: 'Jun', visits: 115000 },
    { month: 'Jul', visits: 92000 },
    { month: 'Aug', visits: 68000 },
    { month: 'Sep', visits: 88000 },
    { month: 'Oct', visits: 95000 },
    { month: 'Nov', visits: 72000 },
    { month: 'Dec', visits: 105000 }
  ]);

  const [pointsData] = useState([
    { name: 'Earned', value: 2300, fill: '#86EFAC' },
    { name: 'Redeemed', value: 1000, fill: '#D1D5DB' }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'redemption',
      message: 'New reward redemption request from Sarah Ahmed',
      time: '5 min ago',
      icon: 'Gift'
    },
    {
      id: 2,
      type: 'visit',
      message: 'You have pending customer visits to confirm',
      time: '5 min ago',
      icon: 'Bell'
    },
    {
      id: 3,
      type: 'visit',
      message: 'You have pending customer visits to confirm',
      time: '5 min ago',
      icon: 'Bell'
    }
  ]);

  return (
    <div className="w-full sm:px-0">
      <div className="space-y-6 md:space-y-8">
        {/* Stats Cards */}
        <StatsCards stats={data} />
        {/* Visits Trend Chart */}
        <VisitsTrendChart
          visitsData={visitsData}
          highlightedMonth="Jun"
        />

        {/* Middle Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PendingRedemptionApproval />
          <MostActiveCustomers />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PointsPieChart pointsData={pointsData} />
          <NotificationsList notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDashboard;