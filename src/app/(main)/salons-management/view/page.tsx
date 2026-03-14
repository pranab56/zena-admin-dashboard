"use client";

import Loading from "@/components/common/Loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSalonDetailsQuery } from "@/features/super_admin/salon/salonApi";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function SalonProfile() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: salonRes, isLoading, isError } = useSalonDetailsQuery(id, {
    skip: !id
  });

  const salon = salonRes?.data;

  if (isLoading) return <Loading />;
  if (isError || !salon) return <div className="text-center py-10 text-red-500">{t('fialed_to_fetch_details', { defaultValue: 'Failed to fetch salon details' })}</div>;

  return (
    <div className="sm:px-0 space-y-5">
      {/* Back Button */}
      <div>
        <Link href="/salons-management" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={28} strokeWidth={1.5} className="rtl:rotate-180" />
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-[#333]">{salon.businessName}</h1>
          <Badge className={`border-none px-3 py-0.5 font-medium rounded-full shadow-none text-xs ${salon.activeStatus === 'ACTIVE' || salon.activeStatus === "'ACTIVE''"
              ? 'bg-[#D1EBD9] text-[#2F6B43] hover:bg-[#D1EBD9]'
              : 'bg-[#F9D8D8] text-[#D84C4C] hover:bg-[#F9D8D8]'
            }`}>
            {t(salon.activeStatus?.toLowerCase().replace(/'/g, '') || 'inactive')}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-gray-500 font-medium text-[15px]">
          <span>{salon.businessType || t('salon')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#99BBA4]" />
          <span>ID: {salon.salonId?.slice(0, 15)}...</span>
        </div>

        <p className="text-gray-400 text-[15px]">{t('created_since', { date: format(new Date(salon.createdAt), "MMM dd, yyyy") })}</p>
      </div>

      {/* Business Address Section */}
      <div className="space-y-3">
        <h2 className="text-[13px] font-bold text-gray-600 tracking-wider uppercase">{t('business_address')}</h2>
        <p className="text-gray-500 text-[15px] font-medium max-w-2xl leading-relaxed">
          {salon.location || salon.city || t('no_address_provided')}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100/50" />

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Admin Information */}
        <Card className="bg-[#F8F8F8] border-none rounded-3xl p-1 shadow-none">
          <CardContent className="p-5 sm:p-8 space-y-8 sm:space-y-10">
            <h2 className="text-[19px] font-semibold text-gray-700">{t('business_admin_information')}</h2>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase">{t('admin_name', { defaultValue: 'Admin Name' })}</h3>
                <p className="text-gray-500 text-[16px] font-medium">{salon.admin?.name || t('n/a')}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase">{t('contact_email')}</h3>
                <p className="text-gray-500 text-[16px] font-medium">{salon.admin?.email || salon.email || t('n/a')}</p>
              </div>

              <div className="pt-4 border-t border-gray-200/40" />

              <div className="space-y-2">
                <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase">{t('phone_number_header')}</h3>
                <p className="text-gray-500 text-[16px] font-medium">{salon.admin?.phoneNumber || salon.phone || t('n/a')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Column */}
        <div className="flex flex-col gap-8">
          {/* Total Online / Visitors */}
          <Card className="bg-[#F8F8F8] border-none rounded-3xl p-1 shadow-none h-full">
            <CardContent className="p-6 sm:p-8 flex flex-col justify-center h-full">
              <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase mb-4">{t('total_visitors', { defaultValue: 'Total Visitors' })}</h3>
              <p className="text-2xl font-bold text-gray-700">{salon.visitor || 0}</p>
            </CardContent>
          </Card>

          {/* Subscription Info */}
          <Card className="bg-[#F8F8F8] border-none rounded-3xl p-1 shadow-none h-full">
            <CardContent className="p-6 sm:p-8 flex flex-col justify-center h-full">
              <h3 className="text-[13px] font-bold text-gray-500 tracking-wider uppercase mb-4">{t('subscription_plan')}</h3>
              <p className="text-xl font-bold text-gray-700 capitalize">{salon.subscriptionType}</p>
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(salon.startDate), "dd MMM yyyy")} - {format(new Date(salon.expiryDate), "dd MMM yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}