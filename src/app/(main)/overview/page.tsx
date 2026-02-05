"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Users } from "lucide-react";
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
  // Metrics Data
  const metrics = [
    { title: "TOTAL SALONS", value: "124", bg: "bg-[#E3ECE4]" },
    { title: "Total Visit Frequency", value: "274", bg: "bg-[#E9E3C1]" },
    { title: "AVG. Visit Frequency", value: "274", bg: "bg-[#F3A5A0]" },
    { title: "TOTAL USERS", value: "12,504", bg: "bg-[#EFD1C9]" },
    { title: "TODAY REVENUE", value: "18.5K", bg: "bg-[#E0E0E0]" },
  ];

  // Subscription Data
  const subscriptions = [
    { name: "Elite Hair & Spa", id: "SLN-9921", start: "12-12-2025", expiry: "12-12-2026", plan: "Dubai", status: "Expired" },
    { name: "Elite Hair & Spa", id: "SLN-9921", start: "12-12-2025", expiry: "12-12-2026", plan: "Dubai", status: "Active" },
    { name: "Elite Hair & Spa", id: "SLN-9921", start: "12-12-2025", expiry: "12-12-2026", plan: "Dubai", status: "Expired" },
    { name: "Elite Hair & Spa", id: "SLN-9921", start: "12-12-2025", expiry: "12-12-2026", plan: "Dubai", status: "Expired" },
  ];

  // Top Performing Service
  const services = [
    { name: "Haircut", value: 85, visits: "2451 visits" },
    { name: "Hair Color/ Treatment", value: 77, visits: "2451 visits" },
    { name: "Nail Art", value: 65, visits: "2451 visits" },
    { name: "Pedicure", value: 53, visits: "2451 visits" },
    { name: "Manicure", value: 47, visits: "2451 visits" },
  ];

  // Visits Trend Data
  const visitsTrend = [
    { month: "Jan", visits: 60000 },
    { month: "Feb", visits: 105000 },
    { month: "Mar", visits: 85000 },
    { month: "Apr", visits: 120000 },
    { month: "May", visits: 90000 },
    { month: "Jun", visits: 65000 },
    { month: "Jul", visits: 80000 },
    { month: "Aug", visits: 70000 },
    { month: "Sep", visits: 60000 },
  ];

  // Top Performing Salons
  const salons = [
    { name: "Glamour Salon & Spa", points: "2.4kPoints", value: 90 },
    { name: "Skin Pro Clinic", points: "1.8kPoints", value: 75 },
    { name: "Zen Wellness Hub", points: "1.2kPoints", value: 60 },
    { name: "Elite Dental Care", points: "920 Points", value: 45 },
    { name: "Elite Dental Care", points: "920 Points", value: 45 },

  ];

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
      <div className="flex flex-col sm:flex-row justify-end gap-3 px-1">
        <Button className="bg-[#A8D5BA] hover:bg-[#8AA893] text-gray-800 font-medium px-6 py-5 rounded-lg flex gap-2 w-full sm:w-auto justify-center">
          <div className="p-0.5 border border-gray-600 rounded flex items-center justify-center">
            <Plus size={12} className="text-gray-700 stroke-[3]" />
          </div>
          Create New Salon
        </Button>
        <Button className="bg-[#A8D5BA] hover:bg-[#8AA893] text-gray-800 font-medium px-6 py-5 rounded-lg flex gap-2 border-none w-full sm:w-auto justify-center">
          <Users size={18} className="text-gray-700" />
          Mange Subscription
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Subscription Management */}
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white px-6 pt-6">
              <CardTitle className="text-lg font-semibold text-gray-800">Subscription Management</CardTitle>
              <Button variant="link" className="text-[#E08E8E] font-medium p-0 hover:underline ">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-4 sm:px-6 pb-6 pt-2 overflow-x-auto custom-scrollbar">
                <Table className="min-w-[700px] md:min-w-full">
                  <TableHeader>
                    <TableRow className="bg-[#E5E9E4] hover:bg-[#E5E9E4] border-none">
                      <TableHead className="text-gray-700 font-bold first:rounded-l-lg h-12">BUSINESS NAME</TableHead>
                      <TableHead className="text-gray-700 font-bold h-12">START DATE</TableHead>
                      <TableHead className="text-gray-700 font-bold h-12">EXPIRY DATE</TableHead>
                      <TableHead className="text-gray-700 font-bold h-12">Plan</TableHead>
                      <TableHead className="text-gray-700 font-bold last:rounded-r-lg h-12">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub, i) => (
                      <TableRow key={i} className="border-b-[0.5px] border-gray-100 last:border-none hover:bg-transparent">
                        <TableCell className="py-4">
                          <p className="font-semibold text-gray-800 text-[15px]">{sub.name}</p>
                          <p className="text-xs text-gray-400">ID: {sub.id}</p>
                        </TableCell>
                        <TableCell className="text-gray-700 font-medium text-[15px]">{sub.start}</TableCell>
                        <TableCell className="text-gray-700 font-medium text-[15px]">{sub.expiry}</TableCell>
                        <TableCell className="text-gray-700 font-medium text-[15px]">{sub.plan}</TableCell>
                        <TableCell>
                          <Badge
                            className={`rounded-full px-4 py-1.5 font-medium text-[13px] border-none shadow-none ${sub.status === 'Active'
                              ? 'bg-[#D1EBD9] text-[#2F6B43] hover:bg-[#D1EBD9]'
                              : 'bg-[#F9D8D8] text-[#D84C4C] hover:bg-[#F9D8D8]'
                              }`}
                          >
                            {sub.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Visits Trend */}
          <Card className="rounded-2xl border-none shadow-sm overflow-hidden px-3">
            <div className="">
              <h3 className="text-lg font-semibold text-gray-800">Vists Trend</h3>
              <p className="text-sm text-gray-500">Today vs Last 7 Days Overview</p>
            </div>

            <Card className="bg-[#F8F8F8] border-none rounded-2xl h-[400px] shadow-none">
              <div className="mb-4">
                <h4 className="font-[serif] text-xl italic text-[#333] px-4">Visits Trend Chart</h4>
              </div>
              <div className="h-[250px] sm:h-[280px] w-full ">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsTrend} margin={{ top: 0, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="0" stroke="#E5E5E5" />
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
                      ticks={[0, 25000, 50000, 75000, 100000, 125000]}
                      tickFormatter={(value) => value === 0 ? "0" : `${value / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black/90 text-white px-4 py-2 rounded shadow-xl text-sm border-none">
                              <p className="font-bold">Total</p>
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
                      {visitsTrend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.month === 'Apr' ? '#99BBA4' : '#E5E9E4'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-8">
          {/* Top Performing Service */}
          <Card className="rounded-2xl border-none shadow-sm p-6">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800">Top Performing Service</h3>
              <p className="text-sm text-gray-500">Based on customer engagement</p>
            </div>
            <div className="space-y-8">
              {services.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-gray-500">{item.value}%</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div className="w-full bg-[#F3F4F6] rounded-full h-[14px]">
                        <div
                          className="bg-[#E08E8E] h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                    <span className="absolute right-0 -bottom-5 text-[10px] sm:text-[11px] text-[#E08E8E] font-medium">
                      {item.visits}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing Salons */}
          <Card className="rounded-2xl border-none shadow-sm p-6">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800">Top Performing Salons</h3>
              <p className="text-sm text-gray-500">Based on customer engagement</p>
            </div>
            <div className="space-y-8">
              {salons.map((item, i) => (
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
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
