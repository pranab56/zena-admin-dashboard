'use client';

import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSingleCustomerQuery } from '@/features/admin/customarApi/customarApi';
import { useAllVisitsQuery, useApproveVisitsMutation } from '@/features/admin/visit/visitApi';
import { baseURL } from '@/utils/BaseURL';
import { ArrowLeft, Check } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function VisitContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Fetch Customer Profile
  const { data: customerRes, isLoading: isUserLoading, refetch: refetchCustomer } = useSingleCustomerQuery(userId, { skip: !userId });
  const userData = customerRes?.data?.user;
  const totalVisitsCount = customerRes?.data?.totalVisit || 0;

  // Fetch Pending Visits for Session Details
  const { data: pendingVisitsRes, isLoading: isPendingLoading, refetch: refetchPendingVisits } = useAllVisitsQuery({ userId, status: 'PENDING' }, { skip: !userId });

  const pendingVisit = pendingVisitsRes?.data?.data?.[0];

  // Fetch Approved Visits for Recent Activity
  const { data: approvedVisitsRes, isLoading: isApprovedLoading, refetch: refetchApprovedVisits } = useAllVisitsQuery({ userId, status: 'APPROVED' }, { skip: !userId });
  const approvedVisits = approvedVisitsRes?.data?.data || [];

  // Mutation to confirm visit
  const [approveVisit, { isLoading: isApproving }] = useApproveVisitsMutation();

  const handleConfirmVisit = async () => {
    if (!pendingVisit?.rewardId) {
      toast.error('No pending visit found to confirm');
      return;
    }

    try {
      const res = await approveVisit(pendingVisit.rewardId).unwrap();
      if (res.success) {
        toast.success(res.message || 'Visit confirmed successfully');
      }
      refetchCustomer();
      refetchPendingVisits();
      refetchApprovedVisits()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to confirm visit');
    }
  };

  const displayedHistory = showAllHistory ? approvedVisits : approvedVisits?.slice(0, 2);

  if (isUserLoading || isPendingLoading || isApprovedLoading) {
    return <Loading />;
  }

  interface VisitData {
    _id?: string;
    user?: string;
    totalPoint?: number;
    serviceName?: string;
    lastView: string;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-1">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
          </button>
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900">{t('confirm_visit')}</h1>
        </div>
        <p className="text-gray-500 mt-0.5 text-sm md:text-base ms-12">
          {t('identify_customer_desc')}
        </p>
      </div>

      {/* Search Input Section */}
      {/* <div className="space-y-3 mt-6">
        <Label htmlFor="search-customer" className="text-sm font-semibold text-gray-700 ms-1 uppercase tracking-wider">{t('search_customer_placeholder')}</Label>
        <Input
          id="search-customer"
          placeholder="e.g. 123-456-7890"
          className="w-full py-6 px-4 border-gray-200 focus:border-[#A8D5BA] focus:ring-[#A8D5BA] text-lg rounded-xl shadow-sm"
        />
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-5">
        {/* Left Column - Profile & Services */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Profile Card */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative shrink-0">
                  <NextImage
                    src={userData?.image ? `${baseURL}${userData.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'U')}&background=random`}
                    height={120}
                    width={120}
                    alt={userData?.name || 'Customer'}
                    className='w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-white shadow-lg'
                  />

                </div>
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <h2 className="text-2xl font-medium text-gray-900">{userData?.name || 'No Name'}</h2>
                    <Badge className="bg-[#D45D8A] text-white hover:bg-[#D45D8A] border-none px-3 py-1 font-bold rounded-full text-[10px] tracking-widest uppercase">
                      {totalVisitsCount > 20 ? 'GOLD TIER' : totalVisitsCount > 10 ? 'SILVER TIER' : 'BRONZE TIER'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-medium text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg">{userData?.phoneNumber || 'No Number'}</span>
                    <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-[#A8D5BA]"></span>
                    <span className="bg-gray-100 px-3 py-1 rounded-lg">ID: #{userData?._id?.slice(-4) || 'N/A'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#EEF8ED] p-4 rounded-2xl border border-green-50">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{t('current_balance', { defaultValue: 'Current Balance' })}</div>
                      <div className="text-xl font-bold text-[#2F6B43]">{userData?.coins || 0} <span className="text-xs font-medium opacity-70 uppercase">pts</span></div>
                    </div>
                    <div className="bg-[#F5F5F3] p-4 rounded-2xl border border-gray-100">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{t('total_visits', { defaultValue: 'Total Visits' })}</div>
                      <div className="text-xl font-bold text-gray-700">{totalVisitsCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Used */}
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 px-8 ">
              <CardTitle className="text-xl font-medium text-gray-800">Services Used</CardTitle>
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
            <CardHeader className="border-b border-gray-50 px-8 py-2">
              <CardTitle className="text-xl font-medium text-gray-800">{t('session_details')}</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-gray-500 tracking-widest uppercase">{t('total_bill_amount')}</Label>
                <div className="relative group">
                  <Input
                    placeholder="0.00"
                    className="py-7 ps-6 pe-12 border-gray-200 focus:border-[#A8D5BA] focus:ring-[#A8D5BA] text-xl font-bold rounded-2xl bg-gray-50/50 select-none"
                    disabled
                  />
                  <span className="absolute end-6 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400">$</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-gray-500 tracking-widest uppercase">{t('points_to_award')}</Label>
                <div className="relative group">
                  <Input
                    value={pendingVisit?.totalPoint || '0'}
                    className="py-7 ps-6 pe-16 border-gray-200 focus:border-[#A8D5BA] focus:ring-[#A8D5BA] text-xl font-bold rounded-2xl bg-[#EEF8ED] border-none"
                    readOnly
                  />
                  <span className="absolute end-6 top-1/2 transform -translate-y-1/2 text-sm font-bold text-[#2F6B43]">PTS</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleConfirmVisit}
                  disabled={isApproving || !pendingVisit}
                  className="w-full bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-medium text-lg py-7 rounded-2xl shadow-lg shadow-green-100 transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
                >
                  {isApproving ? t('confirming') : t('confirm_visit_btn')}
                </Button>
                {!pendingVisit && <p className="text-xs text-red-500 mt-2 text-center">No pending visit request from this user.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Recent Visits Section */}
          <section className="space-y-4">
            <div className='flex items-center justify-between px-2 pt-2'>
              <h2 className="text-lg font-medium text-gray-800">{t('recent_activity')}</h2>
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                className='text-xs font-bold uppercase tracking-wider text-[#D45D8A] hover:underline cursor-pointer'
              >
                {showAllHistory ? t('show_less') : t('view_history')}
              </button>
            </div>

            <div className="space-y-4">
              {displayedHistory.length > 0 ? (displayedHistory as VisitData[]).map((visit: VisitData, index: number) => (
                <div
                  key={visit._id || index}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#A8D5BA]/30 transition-colors"
                >
                  <div className="bg-[#EEF8ED] rounded-xl w-12 h-12 flex items-center justify-center shrink-0 border border-green-50">
                    <Check className="w-6 h-6 text-[#2F6B43]" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[15px] font-bold text-gray-800 leading-tight">
                        {visit.user || userData?.name}
                      </h3>
                      <span className="text-[13px] font-bold text-[#D45D8A]">
                        +{visit.totalPoint} PTS
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-500 mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap">
                      {visit.serviceName} • {new Date(visit.lastView).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400 text-sm italic">
                  No recent activity found.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmCustomerVisit() {
  return (
    <Suspense fallback={<Loading />}>
      <VisitContent />
    </Suspense>
  );
}