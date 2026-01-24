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
import { ChevronLeft, ChevronRight, Eye, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Customer {
  id: number;
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

const CustomerManagement = () => {
  // Demo data - customers with additional details
  const allCustomers: Customer[] = [
    {
      id: 1,
      name: 'Aysha Rahman',
      phone: '+9876463212',
      points: 812,
      visits: 16,
      referrals: 3,
      status: 'Active',
      joinedDate: '12 Oct, 2023',
      currentBalance: 120,
      referredBy: 'David Wilson',
      referredByImage: 'https://i.pravatar.cc/150?img=12',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 2,
      name: 'Mohammad Ali',
      phone: '+9876463213',
      points: 650,
      visits: 12,
      referrals: 2,
      status: 'Inactive',
      joinedDate: '05 Sep, 2023',
      currentBalance: 95,
      referredBy: 'Sarah Ahmed',
      referredByImage: 'https://i.pravatar.cc/150?img=9',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    // ... rest of the customers (truncated for brevity)
    // Note: Make sure all customers have the same structure as above
  ];

  const [customers] = useState<Customer[]>(allCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
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

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleBanCustomer = () => {
    console.log('Banning customer:', selectedCustomer);
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">View and manage all customers, track visits, points, rewards, and loyalty status.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex pb-5 w-full items-center gap-4">
          <Input
            placeholder="Search name, phone or ID......."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-12 w-10/12"
          />
          <div className='w-2/12'>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-12 w-full py-[23px]">
                <SelectValue placeholder="Search by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 overflow-hidden p-0">
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="bg-primary grid grid-cols-7 gap-4 p-4 font-medium text-gray-700">
              <div>Name</div>
              <div>Phone Number</div>
              <div>Total Points</div>
              <div>Total Visits</div>
              <div>Referral Count</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {paginatedCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{customer.name}</div>
                  <div className="text-gray-600">{customer.phone}</div>
                  <div className="text-gray-900">{customer.points}</div>
                  <div className="text-gray-900">{customer.visits}</div>
                  <div className="text-gray-900">{customer.referrals}</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${customer.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {customer.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Eye className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 p-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

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

                if (pageNum === 3 && currentPage > 3 && totalPages > 5) {
                  return (
                    <Button
                      key="ellipsis"
                      variant="outline"
                      size="sm"
                      className="w-10"
                      disabled
                    >
                      ...
                    </Button>
                  );
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 ${currentPage === pageNum
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : ''
                      }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="gap-1 bg-green-500 hover:bg-green-600 text-white"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
        </div>
      </div>

      {/* Customer Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0 gap-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Customer Details
            </DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="p-6 pt-0 space-y-6">
              {/* Customer Info Card */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Image
                      src={selectedCustomer.avatar}
                      width={1000}
                      height={1000}
                      alt={selectedCustomer.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {selectedCustomer.name}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {selectedCustomer.status}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Joined in {selectedCustomer.joinedDate}
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedCustomer.phone}
                      </p>
                    </div>
                  </div>

                  {/* Referred By Card */}
                  <Card className="bg-white shadow-md border-0">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 font-medium mb-3">
                        REFERRED BY
                      </p>
                      <div className="flex items-center gap-3">
                        <Image
                          src={selectedCustomer.referredByImage}
                          width={1000}
                          height={1000}
                          alt={selectedCustomer.referredBy}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-pink-500 text-lg">
                            {selectedCustomer.referredBy}
                          </p>
                          <button className="text-yellow-500 text-sm font-medium hover:underline">
                            view profile
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-6">
                {/* Lifetime Value */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="text-gray-600 font-bold text-lg mb-4">
                      LIFETIME VALUE
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Total Visits</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {selectedCustomer.visits}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Referral Count</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {selectedCustomer.referrals}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Balance */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="text-gray-600 font-bold text-lg mb-4">
                      CURRENT BALANCE
                    </h4>
                    <div className="flex items-center gap-2">
                      <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                      <span className="text-4xl font-bold text-pink-400">
                        {selectedCustomer.currentBalance}
                      </span>
                      <span className="text-2xl text-gray-600">points</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ban Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleBanCustomer}
                  className="bg-green-400 hover:bg-green-500 text-gray-800 font-bold text-lg px-16 py-6 rounded-xl"
                >
                  BAN
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;