"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useOverviewQuery,
  useTopPerformingSalonsQuery,
  useTopPerformingServiceQuery
} from "@/features/super_admin/overview/overviewApi";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { } = useTranslation();

  // Fetch API Data
  const { data: overviewData, isLoading: isOverviewLoading } = useOverviewQuery(undefined);
  const { data: topServiceData, isLoading: isTopServiceLoading } = useTopPerformingServiceQuery(undefined);
  const { data: topSalonsData, isLoading: isTopSalonsLoading } = useTopPerformingSalonsQuery(undefined);

  const stats = overviewData?.data || {};

  // Metrics Mapping
  const metrics = [
    { title: "TOTAL SALONS", value: stats.totalSalon || 0, bg: "bg-[#E3ECE4]" },
    { title: "TODAY VISITS", value: stats.visitToday || 0, bg: "bg-[#E9E3C1]" },
    { title: "AVG. VISIT FREQUENCY", value: stats.avgVisit || 0, bg: "bg-[#F3A5A0]" },
    { title: "TOTAL USERS", value: stats.totalUser || 0, bg: "bg-[#EFD1C9]" },
    { title: "POINTS ISSUED", value: stats.pointIssued || 0, bg: "bg-[#E0E0E0]" },
  ];

  interface MonthlyTrend {
    month: number;
    totalUsers: number;
  }

  interface TopService {
    serviceName: string;
    percentage: number;
    totalVisits: number;
  }

  interface TopSalon {
    businessName: string;
    totalPoints: number;
    percentage: number;
  }

  interface ActiveCustomer {
    userId?: {
      name?: string;
      phoneNumber?: string;
    };
    viewCount: number;
    totalCoins: number;
    status: string;
  }

  // Map monthly data for chart (result field)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const visitsTrend = (stats.result || []).map((item: MonthlyTrend) => ({
    month: monthNames[item.month - 1] || "",
    visits: item.totalUsers || 0
  }));

  // Top Performing Service
  const servicesData = (topServiceData?.data || []).map((item: TopService) => ({
    name: item.serviceName,
    value: item.percentage,
    visits: `${item.totalVisits} visits`
  }));

  // Top Performing Salons
  const salonsData = (topSalonsData?.data || []).map((item: TopSalon) => ({
    name: item.businessName,
    points: `${item.totalPoints} Points`,
    value: item.percentage
  }));

  // Most Active Customers (Top Users)
  const activeCustomers = (stats.mostActiveCustomer || []) as ActiveCustomer[];

  if (isOverviewLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#A8D5BA]" />
      </div>
    );
  }

  return (
    <div className="sm:px-6 lg:px-0 min-h-screen pb-10 space-y-6 md:space-y-8">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-6">
        {metrics.map((m, i) => (
          <Card key={i} className={`${m.bg} border-none shadow-sm h-32 flex flex-col justify-center px-6`}>
            <p className="text-[#6B7280] text-sm font-semibold tracking-wide uppercase">{m.title}</p>
            <p className="text-2xl font-bold mt-1 text-gray-800">{m.value}</p>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      {/* <div className="flex flex-col sm:flex-row justify-end gap-3 px-1">
        <Button className="bg-[#A8D5BA] hover:bg-[#8AA893] text-gray-800 font-medium px-6 py-5 rounded-lg flex gap-2 w-full sm:w-auto justify-center">
          <div className="p-0.5 border border-gray-600 rounded flex items-center justify-center">
            <Plus size={12} className="text-gray-700 stroke-[3]" />
          </div>
          Create New Salon
        </Button>
        <Button className="bg-[#A8D5BA] hover:bg-[#8AA893] text-gray-800 font-medium px-6 py-5 rounded-lg flex gap-2 border-none w-full sm:w-auto justify-center">
          <Users size={18} className="text-gray-700" />
          Manage Subscription
        </Button>
      </div> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Visits Trend */}
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden p-6 bg-white">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">User Growth Trend</h3>
              <p className="text-sm text-gray-500">Monthly breakdown of new users</p>
            </div>

            <Card className="bg-[#F8F8F8] border-none rounded-2xl h-[400px] shadow-none p-4">
              <div className="mb-4">
                <h4 className="font-[serif] text-xl italic text-[#333]">Growth Chart</h4>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsTrend} margin={{ top: 0, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 13 }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 13 }}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black/90 text-white px-4 py-2 rounded shadow-xl text-sm border-none">
                              <p className="font-bold">Total Users</p>
                              <p>{payload[0].value?.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="visits"
                      radius={[4, 4, 0, 0]}
                      barSize={32}
                    >
                      {visitsTrend.map((_: { month: string; visits: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={'#99BBA4'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Card>

          {/* Active Customers / Subscription Table */}
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white px-6 pt-6">
              <CardTitle className="text-lg font-semibold text-gray-800">Most Active Customers</CardTitle>
              {/* <Button variant="link" className="text-[#E08E8E] font-medium p-0 hover:underline ">View All</Button> */}
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-4 sm:px-6 pb-6 pt-2 overflow-auto max-h-[465px] custom-scrollbar transition-all">
                <Table className="min-w-[700px] md:min-w-full">
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow className="bg-[#E5E9E4] hover:bg-[#E5E9E4] border-none shadow-sm">
                      <TableHead className="text-gray-700 font-bold first:rounded-l-lg h-12">CUSTOMER NAME</TableHead>
                      <TableHead className="text-gray-700 font-bold h-12">PHONE NUMBER</TableHead>
                      <TableHead className="text-gray-700 font-bold h-12">TOTAL VISITS</TableHead>
                      <TableHead className="text-gray-700 font-bold h-12">TOTAL POINTS</TableHead>
                      <TableHead className="text-gray-700 font-bold last:rounded-r-lg h-12">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCustomers.length > 0 ? activeCustomers.map((customer: ActiveCustomer, i: number) => (
                      <TableRow key={i} className="border-b-[0.5px] border-gray-100 last:border-none hover:bg-transparent">
                        <TableCell className="py-4">
                          <p className="font-semibold text-gray-800 text-[15px]">{customer.userId?.name || "N/A"}</p>
                          {/* <p className="text-xs text-gray-400">ID: {customer._id.slice(-6).toUpperCase()}</p> */}
                        </TableCell>
                        <TableCell className="text-gray-700 font-medium text-[15px]">{customer.userId?.phoneNumber || "N/A"}</TableCell>
                        <TableCell className="text-gray-700 font-medium text-[15px]">{customer.viewCount}</TableCell>
                        <TableCell className="text-gray-700 font-medium text-[15px]">{customer.totalCoins}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "rounded-full px-4 py-1.5 font-medium text-[13px] border-none shadow-none capitalize",
                              customer.status === 'PENDING' ? 'bg-[#FFF4E5] text-[#B76E00] hover:bg-[#FFF4E5]' : 'bg-[#D1EBD9] text-[#2F6B43] hover:bg-[#D1EBD9]'
                            )}
                          >
                            {customer.status?.toLowerCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-gray-400">No active customers found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-8">
          {/* Top Performing Service */}
          <Card className="rounded-2xl border-none shadow-sm p-6 bg-white">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Top Performing Service</h3>
                <p className="text-sm text-gray-500">Based on customer engagement</p>
              </div>
              {isTopServiceLoading && <Loader2 className="h-5 w-5 animate-spin text-[#A8D5BA]" />}
            </div>
            <div className="space-y-8">
              {servicesData.length > 0 ? servicesData.map((item: { name: string; value: number; visits: string }, i: number) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-gray-500">{item.value}%</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="w-full bg-[#F3F4F6] rounded-full h-[14px]">
                      <div
                        className="bg-[#E08E8E] h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="absolute right-0 -bottom-5 text-[10px] sm:text-[11px] text-[#E08E8E] font-medium">
                      {item.visits}
                    </span>
                  </div>
                </div>
              )) : <p className="text-center text-gray-400 py-4">No service data available</p>}
            </div>
          </Card>

          {/* Top Performing Salons */}
          <Card className="rounded-2xl border-none shadow-sm p-6 bg-white">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Top Performing Salons</h3>
                <p className="text-sm text-gray-500">Based on visit activity</p>
              </div>
              {isTopSalonsLoading && <Loader2 className="h-5 w-5 animate-spin text-[#A8D5BA]" />}
            </div>
            <div className="space-y-8">
              {salonsData.length > 0 ? salonsData.map((item: { name: string; points: string; value: number }, i: number) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-gray-500">{item.points}</span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] rounded-full h-[14px]">
                    <div
                      className="bg-[#99BBA4] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              )) : <p className="text-center text-gray-400 py-4">No salon data available</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
