"use client";

import { useAllRedemptionRewardQuery, useDashboardQuery } from '@/features/admin/overview/overveiwApi';
import { Gift, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MostActiveCustomers from '../../components/super-admin/dashboard/MostActiveCustomers';
import NotificationsList, { type Notification } from '../../components/super-admin/dashboard/NotificationsList';
import PendingRedemptionApproval from '../../components/super-admin/dashboard/PendingRedemptionApproval';
import PointsPieChart from '../../components/super-admin/dashboard/PointsPieChart';
import StatsCards from '../../components/super-admin/dashboard/StatsCards';
import VisitsTrendChart from '../../components/super-admin/dashboard/VisitsTrendChart';

const LoyaltyDashboard = () => {
  const { t } = useTranslation();
  const { data: apiResponse, isLoading: isDashboardLoading } = useDashboardQuery({});
  const { data: redemptionResponse, isLoading: isRedemptionLoading } = useAllRedemptionRewardQuery({});

  const dashboardData = apiResponse?.data;
  const redemptions = redemptionResponse?.data;

  // Map Stats Data
  const statsData = [
    {
      id: 1,
      title: t('visits_today'),
      value: dashboardData?.visitToday || 0,
      icon: Users,
      bgClass: 'bg-green-50'
    },
    {
      id: 2,
      title: t('rewards_redeemed'),
      value: dashboardData?.Redeemed || 0,
      icon: Gift,
      bgClass: 'bg-yellow-50'
    },
    {
      id: 4,
      title: t('points_issued'),
      value: dashboardData?.pointIssued || 0,
      icon: TrendingUp,
      bgClass: 'bg-red-50'
    },
  ];

  // Map Visits Trend Data from monthlyReward
  const months = [
    t('month_jan', { defaultValue: 'Jan' }),
    t('month_feb', { defaultValue: 'Feb' }),
    t('month_mar', { defaultValue: 'Mar' }),
    t('month_apr', { defaultValue: 'Apr' }),
    t('month_may', { defaultValue: 'May' }),
    t('month_jun', { defaultValue: 'Jun' }),
    t('month_jul', { defaultValue: 'Jul' }),
    t('month_aug', { defaultValue: 'Aug' }),
    t('month_sep', { defaultValue: 'Sep' }),
    t('month_oct', { defaultValue: 'Oct' }),
    t('month_nov', { defaultValue: 'Nov' }),
    t('month_dec', { defaultValue: 'Dec' })
  ];
  interface MonthlyRewardItem {
    month: number;
    totalUsers: number;
  }
  const visitsTrendData = dashboardData?.monthlyReward?.map((item: MonthlyRewardItem) => ({
    month: months[item.month - 1] || t('unknown', { defaultValue: 'Unknown' }),
    visits: item.totalUsers
  })) || [];

  // Map Points Pie Data
  const pointsPieData = [
    { name: t('earned'), value: dashboardData?.PointEarned || 0, fill: '#86EFAC' },
    { name: t('redeemed'), value: dashboardData?.Redeemed || 0, fill: '#D1D5DB' }
  ];

  // Map Active Customers
  interface MostActiveCustomerItem {
    _id: string;
    viewCount: number;
    totalCoins: number;
    userId?: {
      name: string;
    };
  }
  const activeCustomers = dashboardData?.mostActiveCustomer?.map((item: MostActiveCustomerItem) => ({
    id: item._id,
    name: item.userId?.name || 'Unknown',
    visits: item.viewCount || 0,
    points: (item.totalCoins / 1000).toFixed(1) + 'k',
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userId?.name || 'U')}&background=random`
  })) || [];

  const notificationsData: Notification[] = [
    {
      id: 1,
      type: 'redemption',
      message: t('notification_redemption', { defaultValue: 'New reward redemption request from Sarah Ahmed' }),
      time: t('time_ago', { time: '5', unit: t('minutes'), defaultValue: '5 min ago' }),
      icon: 'Gift'
    },
    {
      id: 2,
      type: 'visit',
      message: t('notification_visit', { defaultValue: 'You have pending customer visits to confirm' }),
      time: t('time_ago', { time: '5', unit: t('minutes'), defaultValue: '5 min ago' }),
      icon: 'Bell'
    },
    {
      id: 3,
      type: 'visit',
      message: t('notification_visit', { defaultValue: 'You have pending customer visits to confirm' }),
      time: t('time_ago', { time: '5', unit: t('minutes'), defaultValue: '5 min ago' }),
      icon: 'Bell'
    }
  ];

  if (isDashboardLoading || isRedemptionLoading) {
    return <div className="p-8 text-center text-gray-500">{t('loading_dashboard')}</div>;
  }

  return (
    <div className="w-full sm:px-0">
      <div className="space-y-6 md:space-y-8">
        {/* Stats Cards */}
        <StatsCards stats={statsData} />
        {/* Visits Trend Chart */}
        <VisitsTrendChart
          visitsData={visitsTrendData}
          highlightedMonth={months[new Date().getMonth()]}
        />

        {/* Middle Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PendingRedemptionApproval redemptions={redemptions} />
          <MostActiveCustomers customers={activeCustomers} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PointsPieChart pointsData={pointsPieData} />
          <NotificationsList notifications={notificationsData} />
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDashboard;