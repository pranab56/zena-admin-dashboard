import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useApplyRewardMutation,
  useCreateCustomerMutation,
  useSingleCustomerQuery,
  useUsedRewordQuery
} from '@/features/admin/customarApi/customarApi';
import { ChevronLeft, ChevronRight, Eye, Footprints, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { baseURL } from '@/utils/BaseURL';
import Link from 'next/link';

interface Customer {
  id: string | number;
  name: string;
  phone: string;
  points: number;
  visits: number;
  referrals?: number;
  status?: 'Active' | 'Inactive';
  joinedDate?: string;
  currentBalance?: number;
  referredBy?: string;
  referredByImage?: string;
  avatar?: string;
}

interface CustomerCreatePayload {
  name: string;
  phoneNumber: string;
  services?: string[];
  totalBill?: number;
  referrals?: number;
  status?: 'Active' | 'Inactive';
  joinedDate?: string;
  currentBalance?: number;
  referredBy?: string;
  referredByImage?: string;
  avatar?: string;
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
  refetch?: () => void;
}

const CustomerManagement = ({ customers = [], refetch }: CustomerManagementProps) => {
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
  }, [customers, t]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'used'>('active');
  const itemsPerPage = 10;

  // Create Manual User states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createSelectedServices, setCreateSelectedServices] = useState<string[]>([]);
  const [createTotalBill, setCreateTotalBill] = useState('');

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) {
      toast.error(t('name_required', { defaultValue: 'Name is required' }));
      return;
    }
    if (!createPhone.trim()) {
      toast.error(t('phone_required', { defaultValue: 'Phone number is required' }));
      return;
    }

    // Auto format phone number with +88 prefix if needed
    let formattedPhone = createPhone.trim();
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('880')) {
        formattedPhone = '+' + formattedPhone;
      } else if (formattedPhone.startsWith('01')) {
        formattedPhone = '+88' + formattedPhone;
      } else if (formattedPhone.startsWith('1') && formattedPhone.length === 10) {
        formattedPhone = '+880' + formattedPhone;
      }
    }

    try {
      const payload: CustomerCreatePayload = {
        name: createName.trim(),
        phoneNumber: formattedPhone,
      };

      if (createSelectedServices.length > 0) {
        payload.services = createSelectedServices;
      }

      if (createTotalBill.trim()) {
        const bill = parseFloat(createTotalBill);
        if (isNaN(bill)) {
          toast.error(t('invalid_bill', { defaultValue: 'Please enter a valid bill amount' }));
          return;
        }
        payload.totalBill = bill;
      }

      const res = await createCustomer(payload).unwrap();
      if (res.success) {
        toast.success(res.message || t('customer_created_success', { defaultValue: 'Customer created successfully' }));
        // Reset states
        setCreateName('');
        setCreatePhone('');
        setCreateSelectedServices([]);
        setCreateTotalBill('');
        setIsCreateModalOpen(false);
        // Refetch parent list
        if (refetch) {
          refetch();
        }
      } else {
        toast.error(res.message || t('create_failed', { defaultValue: 'Failed to create customer' }));
      }
    } catch (error: unknown) {
      console.error(error);
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage = err?.data?.message || err?.message || t('create_failed', { defaultValue: 'Failed to create customer' });
      toast.error(errorMessage);
    }
  };

  // Single Customer Query
  const { data: singleCustomerResponse, isLoading: isSingleLoading, refetch: singleCustomerRefetch } = useSingleCustomerQuery(selectedCustomerId, {
    skip: !selectedCustomerId
  });
  const singleCustomerData = singleCustomerResponse?.data;
  const customerUser = singleCustomerData?.user;

  // Used Rewards Query
  const { data: usedRewardsResponse, isLoading: isUsedRewardsLoading, refetch: usedRewardsRefetch } = useUsedRewordQuery(selectedCustomerId, {
    skip: !selectedCustomerId || activeTab !== 'used'
  });
  const usedRewards = usedRewardsResponse?.data?.rewards || [];

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

  const [applyReward, { isLoading: isApplying }] = useApplyRewardMutation();

  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveTab('active');
    setIsModalOpen(true);
  };

  const handleApplyReward = async (rewardId: string) => {
    try {
      const res = await applyReward(rewardId).unwrap();
      if (res.success) {
        toast.success(res.message || t('reward_approved_success', { defaultValue: 'Reward approved successfully' }));
        // Refetch queries
        singleCustomerRefetch();
        if (activeTab === 'used') {
          usedRewardsRefetch();
        }
      } else {
        toast.error(res.message || t('approve_failed'));
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }, message?: string };
      const errorMessage = err?.data?.message || err?.message || t('approve_failed', { defaultValue: 'Failed to approve reward' });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">{t('customer_management')}</h1>
            <p className="text-gray-600 text-sm md:text-base">{t('customer_management_desc')}</p>
          </div>
          <div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#A8D5BA] hover:bg-[#97C4A9] px-8 text-gray-800 font-medium py-6 rounded-xl border-none shadow-sm flex items-center gap-2 transition-all hover:translate-y-[-1px]"
            >
              <Users className="w-5 h-5" />
              {t('create_user', { defaultValue: 'Create User' })}
            </Button>
          </div>
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
            className="h-12 w-full sm:w-8/12 md:w-10/12 focus-visible:ring-[#A8D5BA]"
          />
          <div className='w-full sm:w-4/12 md:w-2/12'>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-12 w-full py-[23px] focus:ring-[#A8D5BA]">
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
        <Card className="border-0 shadow-sm overflow-hidden p-0 bg-white">
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
                {paginatedCustomers.reverse().map((customer) => (
                  <div
                    key={customer.id}
                    className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors"
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
                      <Link href={`/visits?userId=${customer.id}`}
                        className="h-9 w-9 text-gray-400 hover:text-blue-400 flex justify-center items-center transition-colors bg-white shadow-sm border border-gray-100 rounded-lg"
                      >
                        <Footprints className="h-5 w-5" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-[#A8D5BA] transition-colors bg-white shadow-sm border border-gray-100 rounded-lg"
                        onClick={() => handleViewCustomer(customer.id.toString())}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {paginatedCustomers.length === 0 && (
                  <div className="p-10 text-center text-gray-400 italic">No customers found</div>
                )}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t bg-white">
              <div className="text-sm text-gray-500 font-medium order-2 sm:order-1">
                {t('showing_results', { start: startIndex + 1, end: Math.min(startIndex + itemsPerPage, filteredCustomers.length), total: filteredCustomers.length, defaultValue: `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of ${filteredCustomers.length} customers` })}
              </div>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="gap-1 rounded-xl border-gray-200 hover:bg-gray-50 h-10 px-4 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('previous')}
                </Button>

                <div className="hidden md:flex items-center gap-1.5">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Support ellipsis if many pages
                    if (
                      totalPages <= 7 ||
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl transition-all ${currentPage === pageNum
                            ? 'bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-medium border-none shadow-md shadow-green-50'
                            : 'text-gray-500 hover:bg-gray-50 border-gray-200'
                            }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="px-1 text-gray-300">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="gap-1 rounded-xl bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 border-none font-medium px-4 h-10 shadow-md shadow-green-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all"
                >
                  {t('next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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

            {isSingleLoading ? (
              <div className="p-10 text-center text-gray-400">{t('loading')}</div>
            ) : customerUser ? (
              <div className="p-4 md:p-6 pt-0 space-y-6">
                {/* Customer Info Card */}
                <div className="bg-[#EEF8ED] rounded-2xl p-4 md:p-6 border border-green-50">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="relative">
                        <Image
                          src={customerUser.image ? `${baseURL}/${customerUser.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(customerUser.name || 'U')}&background=random`}
                          width={100}
                          height={100}
                          alt={customerUser.name || 'User'}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                            {customerUser.name}
                          </h3>
                          <Badge className="bg-white text-[#2F6B43] px-3 font-medium rounded-full shadow-none text-xs border border-green-100">
                            {customerUser.status || 'ACTIVE'}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {t('joined_in', { date: new Date(customerUser.updatedAt).toLocaleDateString() })}
                        </p>
                        <p className="text-gray-700 font-semibold text-sm">
                          {customerUser.phoneNumber}
                        </p>
                      </div>
                    </div>

                    {/* Referred By Card */}
                    {customerUser.invitedBy && (
                      <div className="bg-white rounded-2xl p-4 w-full lg:w-[240px] shadow-sm border border-white">
                        <p className="text-[11px] text-gray-400 font-bold mb-3 tracking-widest uppercase">
                          {t('referred_by')}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customerUser.invitedBy.phoneNumber || 'R')}&background=random`} width={40} height={40} alt="referrer" />
                          </div>
                          <div>
                            <p className="font-bold text-[#D45D8A] text-base truncate">
                              {customerUser.invitedBy.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lifetime and Balance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm shadow-[#E08E8E10]">
                    <h4 className="text-[13px] text-gray-400 font-bold mb-4 tracking-widest uppercase">
                      {t('lifetime_value')}
                    </h4>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">{t('total_visits')}</p>
                        <p className="text-2xl font-bold text-gray-800">{singleCustomerData.totalVisit || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">{t('referral_count')}</p>
                        <p className="text-2xl font-bold text-gray-800">{customerUser.successfulInvites || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm shadow-[#E08E8E10]">
                    <h4 className="text-[13px] text-gray-400 font-bold mb-4 tracking-widest uppercase">
                      {t('current_balance')}
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#D45D8A]">{customerUser.coins || 0}</span>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('pts')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs for Rewards */}
                <div className="space-y-4">
                  <div className="flex border-b border-gray-100">
                    <button
                      onClick={() => setActiveTab('active')}
                      className={`flex-1 py-4 text-center font-bold text-sm transition-all border-b-2 ${activeTab === 'active' ? 'border-[#A8D5BA] text-[#2F6B43]' : 'border-transparent text-gray-400'}`}
                    >
                      Active Reward
                    </button>
                    <button
                      onClick={() => setActiveTab('used')}
                      className={`flex-1 py-4 text-center font-bold text-sm transition-all border-b-2 ${activeTab === 'used' ? 'border-[#A8D5BA] text-[#2F6B43]' : 'border-transparent text-gray-400'}`}
                    >
                      Used Reward
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[200px]">
                    {activeTab === 'active' ? (
                      <div className="space-y-4">
                        {singleCustomerData.availableReward?.map((reward: { _id: string; title: string; userId: string }) => (
                          <div key={reward._id} className="bg-[#EEF8ED] rounded-2xl p-6 flex items-center justify-between border border-green-50 shadow-sm group">
                            <div className="flex items-center gap-6">
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">REWARD</p>
                                <p className="text-2xl font-black text-gray-800">{reward.title}</p>
                              </div>
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Star className="w-7 h-7 text-[#A8D5BA] fill-[#EEF8ED]" />
                              </div>
                            </div>
                            <Button
                              onClick={() => handleApplyReward(reward?.userId)}
                              disabled={isApplying}
                              className="bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold px-8 py-6 rounded-xl border-none"
                            >
                              Apply Reward
                            </Button>
                          </div>
                        ))}
                        {(!singleCustomerData.availableReward || singleCustomerData.availableReward.length === 0) && (
                          <div className="text-center py-10 text-gray-400 italic">No active rewards available</div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#E08E8E20] flex items-center justify-center">
                              <Star className="w-3.5 h-3.5 text-[#E08E8E] fill-[#E08E8E]" />
                            </div>
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">REWARD SUMMARY</span>
                          </div>
                          <p className="text-lg font-bold text-gray-700">Total Claimed: {usedRewards.length}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {usedRewards.map((reward: { _id: string; title: string; createdAt: string; discountAmount?: number }) => (
                            <div key={reward._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                                <Image src="/logo/cardUser.png" width={32} height={32} alt="reward" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 truncate">{reward.title}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-tight">Redeemed on {new Date(reward.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-pink-600" />
                                {reward.discountAmount || 0}
                              </div>
                            </div>
                          ))}
                        </div>
                        {isUsedRewardsLoading && <div className="text-center py-6 text-gray-400">{t('loading')}</div>}
                        {usedRewards.length === 0 && !isUsedRewardsLoading && (
                          <div className="text-center py-10 text-gray-400 italic">No used rewards records</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400">Customer not found</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Manual Customer Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 max-h-[96vh] flex flex-col overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
          <DialogHeader className="p-6 pb-4 shrink-0 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#EEF8ED] rounded-xl text-[#2F6B43]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-medium text-gray-950">
                  {t('create_manual_user', { defaultValue: 'Create Manual User' })}
                </DialogTitle>
                <p className="text-xs text-gray-500 mt-1">
                  Add a new offline or walk-in customer with their details.
                </p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateCustomer} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

              {/* Name & Phone Number Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="create-name" className="text-sm font-semibold text-gray-700">
                    {t('name', { defaultValue: 'Name' })} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="create-name"
                    placeholder={t('enter_name_placeholder', { defaultValue: 'e.g. Lokman Hakim' })}
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    required
                    className="h-11 border-gray-200 focus-visible:ring-[#A8D5BA] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-phone" className="text-sm font-semibold text-gray-700">
                    {t('phone_number', { defaultValue: 'Phone Number' })} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="create-phone"
                    placeholder={t('enter_phone_placeholder', { defaultValue: 'e.g. +88017XXXXXXXX' })}
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    required
                    className="h-11 border-gray-200 focus-visible:ring-[#A8D5BA] rounded-xl"
                  />
                </div>
              </div>

              {/* Services Used Grid */}
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100/80 space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-gray-800">
                    {t('services_used', { defaultValue: 'Services Used' })}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Selecting services helps you create smarter offers and increase profits.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-2">
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
                        id={`create-service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                        checked={createSelectedServices.includes(service)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCreateSelectedServices(prev => [...prev, service]);
                          } else {
                            setCreateSelectedServices(prev => prev.filter(s => s !== service));
                          }
                        }}
                        className="w-5 h-5 rounded-md border-gray-300 data-[state=checked]:bg-[#A8D5BA] data-[state=checked]:border-[#A8D5BA] transition-colors focus-visible:ring-[#A8D5BA]"
                      />
                      <Label
                        htmlFor={`create-service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-[14px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors cursor-pointer select-none"
                      >
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Bill Field */}
              <div className="space-y-2">
                <Label htmlFor="create-bill" className="text-sm font-semibold text-gray-700">
                  {t('total_bill_amount', { defaultValue: 'Total Bill Amount' })} <span className="text-xs text-gray-400 font-normal">({t('optional', { defaultValue: 'Optional' })})</span>
                </Label>
                <div className="relative">
                  <Input
                    id="create-bill"
                    placeholder="0.00"
                    type="number"
                    value={createTotalBill}
                    onChange={(e) => setCreateTotalBill(e.target.value)}
                    className="h-11 ps-6 pe-12 border-gray-200 focus-visible:ring-[#A8D5BA] rounded-xl"
                  />
                  <span className="absolute end-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-400">$</span>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isCreating}
                className="rounded-xl px-5 h-11 border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {t('cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-medium px-6 h-11 rounded-xl border-none shadow-md shadow-green-50 transition-all hover:translate-y-[-1px] disabled:opacity-50 flex items-center gap-2"
              >
                {isCreating ? t('creating', { defaultValue: 'Creating...' }) : t('create_user', { defaultValue: 'Create User' })}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;