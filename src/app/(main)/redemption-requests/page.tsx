"use client";

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
import { ChevronLeft, ChevronRight, LucideIcon, MoreHorizontal, Search, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';

interface RedemptionItem {
  id: number;
  phone: string;
  reward: string;
  points: number;
  status: 'Approve' | 'Pending';
}

interface StatCard {
  id: number;
  title: string;
  value: number;
  icon: LucideIcon;
  bgClass: string;
}

const RedemptionQueue = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>([
    {
      id: 1,
      phone: '+9876463212',
      reward: 'Deluxe Hair Spa Treatment',
      points: 1200,
      status: 'Approve'
    },
    {
      id: 2,
      phone: '+9876463212',
      reward: 'Classic Manicure & Polish',
      points: 1200,
      status: 'Pending'
    },
    {
      id: 3,
      phone: '+9876463212',
      reward: '20% Store-wide Discount',
      points: 1200,
      status: 'Approve'
    },
    {
      id: 4,
      phone: '+9876463212',
      reward: 'Deluxe Hair Spa Treatment',
      points: 1200,
      status: 'Pending'
    },
    {
      id: 5,
      phone: '+9876463212',
      reward: 'Gold Facial Treatment',
      points: 1200,
      status: 'Approve'
    }
  ]);

  const stats: StatCard[] = [
    {
      id: 1,
      title: 'Total Pending',
      value: 24,
      icon: Users,
      bgClass: 'bg-[#EEF8ED]'
    },
    {
      id: 2,
      title: 'Approved Today',
      value: 47,
      icon: Users,
      bgClass: 'bg-[#FFF4CC]'
    },
    {
      id: 3,
      title: 'Points Redeemed',
      value: 45000,
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

  const handleApprove = (id: number) => {
    setRedemptions(redemptions.map(item =>
      item.id === id ? { ...item, status: 'Approve' } : item
    ));
    setSelectedRow(null);
  };

  const handleDecline = (id: number) => {
    setRedemptions(redemptions.filter(item => item.id !== id));
    setSelectedRow(null);
  };

  return (
    <div className="">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.id}
                className={stat.bgClass}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
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
            Redemption Approval Queue
          </h1>
          <p className="text-gray-600">
            Review and validate customer reward claims in real-time.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by customer phone or reward name ..."
              className="pl-10 bg-white border-gray-300"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-64 bg-white">
              <SelectValue placeholder="Search by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-200 border-b border-gray-300">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Phone Number
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Reward Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Points Required
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-200 hover:bg-gray-50  ${selectedRow === item.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                  >
                    <td className="py-4 px-6 text-sm text-gray-700">{item.phone}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{item.reward}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{item.points}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-medium ${item.status === 'Approve'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-200 text-yellow-800'
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {selectedRow === item.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(item.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-100"
                            onClick={() => handleDecline(item.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => setSelectedRow(item.id)}
                              className=' bg-[#FFF4CC] hover:bg-[#FFF4CC]'
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleApprove(item.id)}>
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDecline(item.id)}>
                              Decline
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 py-4 bg-gray-50">
            <Button variant="outline" size="sm" className="border-gray-300">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary text-black min-w-10"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 min-w-10"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 min-w-10"
            >
              ...
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 min-w-10"
            >
              5
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedemptionQueue;