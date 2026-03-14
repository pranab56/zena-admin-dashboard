"use client";

import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useApproveRedemptionMutation,
  useGetAllRedemptionQuery,
} from '@/features/admin/redemption/redemptionApi';
import { ChevronLeft, ChevronRight, LucideIcon, MoreHorizontal, Search, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../../components/ui/card';

interface StatCard {
  id: number;
  title: string;
  value: number;
  icon: LucideIcon;
  bgClass: string;
}

const RedemptionQueue = () => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: apiResponse, isLoading, refetch } = useGetAllRedemptionQuery({});
  const [approveRedemption, { isLoading: isApproving }] = useApproveRedemptionMutation();

  const redemptions = apiResponse?.data || [];
  const statusCount = apiResponse?.statusCount || {};

  const stats: StatCard[] = [
    {
      id: 1,
      title: t('total_pending'),
      value: statusCount.pending || 0,
      icon: Users,
      bgClass: 'bg-[#EEF8ED]'
    },
    {
      id: 2,
      title: t('approved'),
      value: statusCount.approved || 0,
      icon: Users,
      bgClass: 'bg-[#FFF4CC]'
    },
    {
      id: 3,
      title: t('points_redeemed'),
      value: statusCount.totalPointReedem || 0,
      icon: Users,
      bgClass: 'bg-[#FFF8F5]'
    },
  ];

  const formatValue = (value: number): string | number => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  interface RedemptionItem {
    _id: string;
    phoneNumber: string;
    rewardName: string;
    rewardPoints: number;
    createdAt: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await approveRedemption(id).unwrap();
      if (res.success) {
        toast.success(res.message || t('redemption_approved_success', { defaultValue: 'Redemption approved successfully' }));
        setSelectedRow(null);
        refetch();
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || t('redemption_approve_failed', { defaultValue: 'Failed to approve redemption' }));
    }
  };

  const filteredRedemptions = redemptions.filter((item: RedemptionItem) => {
    const matchSearch =
      item.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rewardName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'all') return matchSearch;
    if (statusFilter === 'pending') return matchSearch && item.status === 'PENDING';
    if (statusFilter === 'approved') return matchSearch && item.status === 'APPROVED';
    return matchSearch;
  });

  return (
    <div className="">
      <div className="">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
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

        {/* Header */}
        <div className="mb-6 mt-5">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {t('redemption_approval_queue')}
          </h1>
          <p className="text-gray-600">
            {t('redemption_approval_queue_desc')}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('search_redemption_placeholder')}
              className="ps-10 bg-white border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-64 bg-white">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_statuses')}</SelectItem>
              <SelectItem value="pending">{t('pending')}</SelectItem>
              <SelectItem value="approved">{t('approved')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            {isLoading ? (
              <Loading />
            ) : filteredRedemptions.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-medium">
                {t('no_redemption_requests')}
              </div>
            ) : (
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-300">
                    <th className="text-start py-4 px-6 text-sm font-medium text-gray-700">
                      {t('phone_number')}
                    </th>
                    <th className="text-start py-4 px-6 text-sm font-medium text-gray-700">
                      {t('reward_name')}
                    </th>
                    <th className="text-start py-4 px-6 text-sm font-medium text-gray-700">
                      {t('points_required')}
                    </th>
                    <th className="text-start py-4 px-6 text-sm font-medium text-gray-700">
                      {t('date')}
                    </th>
                    <th className="text-start py-4 px-6 text-sm font-medium text-gray-700">
                      {t('status')}
                    </th>
                    <th className="text-start py-4 px-6 text-sm font-medium text-gray-700">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRedemptions.map((item: RedemptionItem) => (
                    <tr
                      key={item._id}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${selectedRow === item._id ? 'bg-green-50 border-s-4 border-s-green-500' : ''}`}
                    >
                      <td className="py-4 px-6 text-sm text-gray-700">{item.phoneNumber}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{item.rewardName}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{item.rewardPoints} {t('pts')}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-medium ${item.status === 'APPROVED'
                            ? 'bg-green-200 text-green-800'
                            : item.status === 'REJECTED'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-yellow-200 text-yellow-800'
                            }`}
                        >
                          {item.status === 'PENDING' ? t('pending') : item.status === 'APPROVED' ? t('approved') : t('rejected')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {item.status === 'APPROVED' ? (
                          <span className="text-sm text-gray-400 italic">{t('already_approved')}</span>
                        ) : selectedRow === item._id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold"
                              onClick={() => handleApprove(item._id)}
                              disabled={isApproving}
                            >
                              {isApproving ? t('approving') : t('approve')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 hover:bg-gray-100"
                              onClick={() => setSelectedRow(null)}
                            >
                              {t('cancel')}
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => setSelectedRow(item._id)}
                                className='bg-[#FFF4CC] hover:bg-[#FFF4CC]'
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleApprove(item._id)}
                                className="focus:bg-[#A8D5BA] focus:text-gray-800 cursor-pointer font-bold uppercase text-[10px] tracking-widest"
                              >
                                {t('approve')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Info */}
          {!isLoading && filteredRedemptions.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {t('showing_results', { start: 1, end: filteredRedemptions.length, total: apiResponse?.meta?.total || 0, defaultValue: `Showing ${1} to ${filteredRedemptions.length} of ${apiResponse?.meta?.total || 0} results` })}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-gray-300">
                  <ChevronLeft className="w-4 h-4 ms-1" />
                  {t('previous')}
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary text-black min-w-10"
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300">
                  {t('next')}
                  <ChevronRight className="w-4 h-4 me-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedemptionQueue;