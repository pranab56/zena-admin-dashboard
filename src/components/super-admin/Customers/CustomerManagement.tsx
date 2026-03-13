import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApproveRewardMutation } from '@/features/admin/customarApi/customarApi';
import { ChevronLeft, ChevronRight, Eye, Footprints, Star } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { baseURL } from '@/utils/BaseURL';

interface Customer {
  id: string | number;
  name: string;
  phone: string;
  points: number;
  visits: number;
  referrals: number;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  currentBalance: number;
  referredBy: string;
  referredByImage: string;
  avatar: string;
}

interface RawCustomer {
  _id: string;
  name?: string;
  phoneNumber?: string;
  coins?: number;
  isOnline?: boolean;
  image?: string;
}

interface CustomerManagementProps {
  customers?: RawCustomer[];
}

const CustomerManagement = ({ customers = [] }: CustomerManagementProps) => {
  const { t } = useTranslation();
  // Map API data to Customer format
  const mappedCustomers: Customer[] = useMemo(() => {
    return customers.map((c) => ({
      id: c._id,
      name: c.name || t('no_name'),
      phone: c.phoneNumber || t('no_number'),
      points: c.coins || 0,
      visits: 0, // Placeholder
      referrals: 0, // Placeholder
      status: c.isOnline ? 'Active' : 'Inactive',
      joinedDate: 'N/A', // Placeholder
      currentBalance: c.coins || 0,
      referredBy: 'N/A',
      referredByImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || 'U')}&background=random`,
      avatar: c.image ? `${baseURL}/${c.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || 'U')}&background=random`
    }));
  }, [customers]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  // Filter customers
  const filteredCustomers = mappedCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const [approveReward, { isLoading: isApproving }] = useApproveRewardMutation();

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleBanCustomer = () => {
    console.log('Banning customer:', selectedCustomer);
    setIsModalOpen(false);
  };

  const handleApprove = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await approveReward(selectedCustomer.id).unwrap();
      if (res.success) {
        toast.success(res.message || t('reward_approved_success', { defaultValue: 'Reward approved successfully' }));
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || t('approve_failed', { defaultValue: 'Failed to approve reward' }));
    }
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('customer_management')}</h1>
          <p className="text-gray-600 text-sm md:text-base">{t('customer_management_desc')}</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row pb-5 w-full items-center gap-4">
          <Input
            placeholder={t('search_customer_placeholder_long')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-12 w-full sm:w-8/12 md:w-10/12"
          />
          <div className='w-full sm:w-4/12 md:w-2/12'>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-12 w-full py-[23px]">
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_status')}</SelectItem>
                <SelectItem value="Active">{t('active')}</SelectItem>
                <SelectItem value="Inactive">{t('inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm overflow-hidden p-0">
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Table Header */}
              <div className="bg-[#EEF8ED] border-b border-green-100 grid grid-cols-7 gap-4 px-6 py-5 font-bold text-gray-700 uppercase text-[11px] tracking-wider">
                <div>{t('name')}</div>
                <div>{t('phone_number')}</div>
                <div>{t('total_points')}</div>
                <div>{t('total_visits')}</div>
                <div>{t('referral_count')}</div>
                <div>{t('status')}</div>
                <div className="text-right pe-4">{t('actions')}</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {paginatedCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-semibold text-gray-800 text-[15px]">{customer.name}</div>
                    <div className="text-gray-600 text-[15px]">{customer.phone}</div>
                    <div className="text-gray-900 text-[15px]">{customer.points}</div>
                    <div className="text-gray-900 text-[15px]">{customer.visits}</div>
                    <div className="text-gray-900 text-[15px]">{customer.referrals}</div>
                    <div>
                      <span
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium ${customer.status === 'Active'
                          ? 'bg-[#D1EBD9] text-[#2F6B43]'
                          : 'bg-gray-100 text-gray-500'
                          }`}
                      >
                        {customer.status === 'Active' ? t('active') : t('inactive')}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2 pe-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-blue-400 transition-colors bg-white shadow-sm border border-gray-100"
                        onClick={() => window.open(`http://10.10.7.37:3000/visits?userId=${customer.id}`, '_blank')}
                      >
                        <Footprints className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-[#A8D5BA] transition-colors bg-white shadow-sm border border-gray-100"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 border-t bg-white">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="gap-1 rounded-lg border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('previous')}
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-md transition-all ${currentPage === pageNum
                        ? 'bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold border-none shadow-none'
                        : 'text-gray-500 hover:bg-gray-50 border-gray-200'
                        }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="gap-1 rounded-lg bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 border-none font-medium px-4 h-9 shadow-none"
              >
                {t('next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          {t('showing_results', { start: startIndex + 1, end: Math.min(startIndex + itemsPerPage, filteredCustomers.length), total: filteredCustomers.length, defaultValue: `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of ${filteredCustomers.length} customers` })}
        </div>
      </div>

      {/* Customer Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0 gap-0 max-h-[96vh] flex flex-col overflow-hidden border-none shadow-2xl rounded-3xl">
          <DialogHeader className="p-6 pb-4 shrink-0 bg-white border-b border-gray-50">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {t('customer_details')}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar">

            {selectedCustomer && (
              <div className="p-4 md:p-6 pt-0 space-y-6">
                {/* Customer Info Card */}
                <div className="bg-gradient-to-br from-[#EEF8ED] to-[#F0FDF4] rounded-2xl p-4 md:p-6 border border-green-50">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                      <div className="relative">
                        <Image
                          src={selectedCustomer.avatar}
                          width={100}
                          height={100}
                          alt={selectedCustomer.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-xl"
                        />
                        <div className="absolute -bottom-1 -end-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                            {selectedCustomer.name}
                          </h3>
                          <Badge className="bg-[#D1EBD9] text-[#2F6B43] hover:bg-[#D1EBD9] border-none px-3 font-medium rounded-full shadow-none text-xs">
                            {selectedCustomer.status === 'Active' ? t('active') : t('inactive')}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm md:text-[15px] font-medium leading-none">
                          {t('joined_in', { date: selectedCustomer.joinedDate })}
                        </p>
                        <p className="text-gray-700 font-semibold text-sm md:text-base">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>

                    {/* Referred By Card */}
                    <div className="bg-white/80 backdrop-blur-sm shadow-sm border border-white rounded-2xl p-4 w-full lg:w-auto">
                      <p className="text-[11px] text-gray-400 font-bold mb-3 tracking-widest uppercase">
                        {t('referred_by')}
                      </p>
                      <div className="flex items-center gap-3">
                        <Image
                          src={selectedCustomer.referredByImage}
                          width={48}
                          height={48}
                          alt={selectedCustomer.referredBy}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-white"
                        />
                        <div>
                          <p className="font-bold text-[#D45D8A] text-base md:text-[17px] leading-tight">
                            {selectedCustomer.referredBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Lifetime Value */}
                  <Card className="border-none bg-[#F5F5F3] rounded-2xl shadow-none">
                    <CardContent className="p-6">
                      <h4 className="text-[13px] text-gray-400 font-bold mb-6 tracking-widest uppercase">
                        {t('lifetime_value')}
                      </h4>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">{t('total_visits')}</p>
                          <p className="text-3xl md:text-4xl font-bold text-gray-800 leading-none">
                            {selectedCustomer.visits}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">{t('referral_count')}</p>
                          <p className="text-3xl md:text-4xl font-bold text-gray-800 leading-none">
                            {selectedCustomer.referrals}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Balance */}
                  <Card className="border-none bg-[#F5F5F3] rounded-2xl shadow-none">
                    <CardContent className="p-6">
                      <h4 className="text-[13px] text-gray-400 font-bold mb-6 tracking-widest uppercase">
                        {t('current_balance')}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          <Star className="w-6 h-6 md:w-7 md:h-7 fill-[#FDE6D2] text-[#FDE6D2]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl md:text-4xl font-bold text-[#D45D8A] leading-none">
                            {selectedCustomer.currentBalance}
                          </span>
                          <span className="text-sm md:text-base font-bold text-gray-400 uppercase tracking-wider leading-none">{t('pts')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 pb-2">
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold text-lg px-12 md:px-20 py-6 rounded-2xl w-full sm:w-auto min-w-[200px] shadow-none"
                  >
                    {isApproving ? t('approving') : t('approve')}
                  </Button>
                  <Button
                    onClick={handleBanCustomer}
                    variant="outline"
                    className="border-[#D45D8A] text-[#D45D8A] hover:bg-[#D45D8A] hover:text-white font-bold text-lg px-12 md:px-20 py-6 rounded-2xl w-full sm:w-auto min-w-[200px] shadow-none"
                  >
                    {t('ban')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;