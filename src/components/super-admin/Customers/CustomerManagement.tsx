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
import { useState } from 'react';

const CustomerManagement = () => {
  // Demo data - customers with additional details
  const allCustomers = [
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
    {
      id: 3,
      name: 'Sarah Ahmed',
      phone: '+9876463214',
      points: 920,
      visits: 18,
      referrals: 5,
      status: 'Active',
      joinedDate: '18 Aug, 2023',
      currentBalance: 180,
      referredBy: 'Emma Wilson',
      referredByImage: 'https://i.pravatar.cc/150?img=10',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    {
      id: 4,
      name: 'John Smith',
      phone: '+9876463215',
      points: 450,
      visits: 8,
      referrals: 1,
      status: 'Active',
      joinedDate: '22 Jul, 2023',
      currentBalance: 75,
      referredBy: 'Omar Hassan',
      referredByImage: 'https://i.pravatar.cc/150?img=11',
      avatar: 'https://i.pravatar.cc/150?img=13'
    },
    {
      id: 5,
      name: 'Emma Wilson',
      phone: '+9876463216',
      points: 780,
      visits: 14,
      referrals: 4,
      status: 'Inactive',
      joinedDate: '15 Jun, 2023',
      currentBalance: 110,
      referredBy: 'John Smith',
      referredByImage: 'https://i.pravatar.cc/150?img=13',
      avatar: 'https://i.pravatar.cc/150?img=10'
    },
    {
      id: 6,
      name: 'Omar Hassan',
      phone: '+9876463217',
      points: 1050,
      visits: 22,
      referrals: 6,
      status: 'Active',
      joinedDate: '03 May, 2023',
      currentBalance: 205,
      referredBy: 'Fatima Khan',
      referredByImage: 'https://i.pravatar.cc/150?img=14',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    {
      id: 7,
      name: 'Fatima Khan',
      phone: '+9876463218',
      points: 590,
      visits: 11,
      referrals: 2,
      status: 'Active',
      joinedDate: '28 Apr, 2023',
      currentBalance: 88,
      referredBy: 'Ahmed Malik',
      referredByImage: 'https://i.pravatar.cc/150?img=15',
      avatar: 'https://i.pravatar.cc/150?img=14'
    },
    {
      id: 8,
      name: 'David Brown',
      phone: '+9876463219',
      points: 340,
      visits: 7,
      referrals: 1,
      status: 'Inactive',
      joinedDate: '10 Apr, 2023',
      currentBalance: 52,
      referredBy: 'Lisa Anderson',
      referredByImage: 'https://i.pravatar.cc/150?img=16',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 9,
      name: 'Lisa Anderson',
      phone: '+9876463220',
      points: 890,
      visits: 17,
      referrals: 4,
      status: 'Active',
      joinedDate: '02 Mar, 2023',
      currentBalance: 145,
      referredBy: 'Hassan Ibrahim',
      referredByImage: 'https://i.pravatar.cc/150?img=17',
      avatar: 'https://i.pravatar.cc/150?img=16'
    },
    {
      id: 10,
      name: 'Ahmed Malik',
      phone: '+9876463221',
      points: 720,
      visits: 13,
      referrals: 3,
      status: 'Active',
      joinedDate: '25 Feb, 2023',
      currentBalance: 102,
      referredBy: 'Sophie Taylor',
      referredByImage: 'https://i.pravatar.cc/150?img=18',
      avatar: 'https://i.pravatar.cc/150?img=15'
    },
    {
      id: 11,
      name: 'Sophie Taylor',
      phone: '+9876463222',
      points: 510,
      visits: 9,
      referrals: 2,
      status: 'Inactive',
      joinedDate: '14 Feb, 2023',
      currentBalance: 79,
      referredBy: 'Maria Garcia',
      referredByImage: 'https://i.pravatar.cc/150?img=19',
      avatar: 'https://i.pravatar.cc/150?img=18'
    },
    {
      id: 12,
      name: 'Hassan Ibrahim',
      phone: '+9876463223',
      points: 960,
      visits: 19,
      referrals: 5,
      status: 'Active',
      joinedDate: '08 Jan, 2023',
      currentBalance: 172,
      referredBy: 'Ibrahim Yusuf',
      referredByImage: 'https://i.pravatar.cc/150?img=20',
      avatar: 'https://i.pravatar.cc/150?img=17'
    },
    {
      id: 13,
      name: 'Maria Garcia',
      phone: '+9876463224',
      points: 430,
      visits: 8,
      referrals: 1,
      status: 'Active',
      joinedDate: '30 Dec, 2022',
      currentBalance: 68,
      referredBy: 'Anna Schmidt',
      referredByImage: 'https://i.pravatar.cc/150?img=21',
      avatar: 'https://i.pravatar.cc/150?img=19'
    },
    {
      id: 14,
      name: 'Ibrahim Yusuf',
      phone: '+9876463225',
      points: 670,
      visits: 12,
      referrals: 3,
      status: 'Inactive',
      joinedDate: '15 Dec, 2022',
      currentBalance: 98,
      referredBy: 'Khalid Aziz',
      referredByImage: 'https://i.pravatar.cc/150?img=22',
      avatar: 'https://i.pravatar.cc/150?img=20'
    },
    {
      id: 15,
      name: 'Anna Schmidt',
      phone: '+9876463226',
      points: 820,
      visits: 15,
      referrals: 4,
      status: 'Active',
      joinedDate: '05 Nov, 2022',
      currentBalance: 135,
      referredBy: 'Jennifer Lee',
      referredByImage: 'https://i.pravatar.cc/150?img=23',
      avatar: 'https://i.pravatar.cc/150?img=21'
    },
    {
      id: 16,
      name: 'Khalid Aziz',
      phone: '+9876463227',
      points: 550,
      visits: 10,
      referrals: 2,
      status: 'Active',
      joinedDate: '28 Oct, 2022',
      currentBalance: 84,
      referredBy: 'Abdullah Shah',
      referredByImage: 'https://i.pravatar.cc/150?img=24',
      avatar: 'https://i.pravatar.cc/150?img=22'
    },
    {
      id: 17,
      name: 'Jennifer Lee',
      phone: '+9876463228',
      points: 740,
      visits: 14,
      referrals: 3,
      status: 'Inactive',
      joinedDate: '12 Oct, 2022',
      currentBalance: 108,
      referredBy: 'Emily Davis',
      referredByImage: 'https://i.pravatar.cc/150?img=25',
      avatar: 'https://i.pravatar.cc/150?img=23'
    },
    {
      id: 18,
      name: 'Abdullah Shah',
      phone: '+9876463229',
      points: 880,
      visits: 16,
      referrals: 5,
      status: 'Active',
      joinedDate: '03 Sep, 2022',
      currentBalance: 152,
      referredBy: 'Rashid Ahmed',
      referredByImage: 'https://i.pravatar.cc/150?img=26',
      avatar: 'https://i.pravatar.cc/150?img=24'
    },
    {
      id: 19,
      name: 'Emily Davis',
      phone: '+9876463230',
      points: 390,
      visits: 7,
      referrals: 1,
      status: 'Active',
      joinedDate: '22 Aug, 2022',
      currentBalance: 61,
      referredBy: 'Olivia Martinez',
      referredByImage: 'https://i.pravatar.cc/150?img=27',
      avatar: 'https://i.pravatar.cc/150?img=25'
    },
    {
      id: 20,
      name: 'Rashid Ahmed',
      phone: '+9876463231',
      points: 1020,
      visits: 21,
      referrals: 6,
      status: 'Active',
      joinedDate: '10 Jul, 2022',
      currentBalance: 195,
      referredBy: 'Bilal Khan',
      referredByImage: 'https://i.pravatar.cc/150?img=28',
      avatar: 'https://i.pravatar.cc/150?img=26'
    },
    {
      id: 21,
      name: 'Olivia Martinez',
      phone: '+9876463232',
      points: 610,
      visits: 11,
      referrals: 2,
      status: 'Inactive',
      joinedDate: '28 Jun, 2022',
      currentBalance: 91,
      referredBy: 'Sophia Johnson',
      referredByImage: 'https://i.pravatar.cc/150?img=29',
      avatar: 'https://i.pravatar.cc/150?img=27'
    },
    {
      id: 22,
      name: 'Bilal Khan',
      phone: '+9876463233',
      points: 790,
      visits: 15,
      referrals: 4,
      status: 'Active',
      joinedDate: '15 May, 2022',
      currentBalance: 128,
      referredBy: 'Tariq Hussain',
      referredByImage: 'https://i.pravatar.cc/150?img=30',
      avatar: 'https://i.pravatar.cc/150?img=28'
    },
    {
      id: 23,
      name: 'Sophia Johnson',
      phone: '+9876463234',
      points: 470,
      visits: 9,
      referrals: 2,
      status: 'Active',
      joinedDate: '02 May, 2022',
      currentBalance: 73,
      referredBy: 'Isabella White',
      referredByImage: 'https://i.pravatar.cc/150?img=31',
      avatar: 'https://i.pravatar.cc/150?img=29'
    },
    {
      id: 24,
      name: 'Tariq Hussain',
      phone: '+9876463235',
      points: 850,
      visits: 17,
      referrals: 4,
      status: 'Inactive',
      joinedDate: '18 Apr, 2022',
      currentBalance: 142,
      referredBy: 'Aysha Rahman',
      referredByImage: 'https://i.pravatar.cc/150?img=5',
      avatar: 'https://i.pravatar.cc/150?img=30'
    },
    {
      id: 25,
      name: 'Isabella White',
      phone: '+9876463236',
      points: 520,
      visits: 10,
      referrals: 2,
      status: 'Active',
      joinedDate: '05 Mar, 2022',
      currentBalance: 82,
      referredBy: 'Mohammad Ali',
      referredByImage: 'https://i.pravatar.cc/150?img=8',
      avatar: 'https://i.pravatar.cc/150?img=31'
    },
  ];

  const [customers] = useState(allCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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

  const handleViewCustomer = (customer) => {
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
                    <img
                      src={selectedCustomer.avatar}
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
                        <img
                          src={selectedCustomer.referredByImage}
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