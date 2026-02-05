"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  ChevronDown,
  Clock,
  Search,
  User
} from "lucide-react";
import { useState } from "react";

interface Salon {
  id: number;
  name: string;
  city: string;
  visits: number;
  customers: number;
  points: string;
  status: string;
}

// Mock Data
const analyticsData: Salon[] = [
  { id: 1, name: "Elite Hair & Spa", city: "New York", visits: 1254, customers: 1245, points: "$1245.00", status: "High Performing" },
  { id: 2, name: "Elite Hair & Spa", city: "New York", visits: 1254, customers: 1245, points: "$1245.00", status: "High Performing" },
  { id: 3, name: "Elite Hair & Spa", city: "New York", visits: 1254, customers: 1245, points: "$1245.00", status: "High Performing" },
  { id: 4, name: "Elite Hair & Spa", city: "New York", visits: 1254, customers: 1245, points: "$1245.00", status: "High Performing" },
  { id: 5, name: "Elite Hair & Spa", city: "New York", visits: 1254, customers: 1245, points: "$1245.00", status: "High Performing" },
];

const serviceUsageRanking = [
  { name: "Haircut", bookings: 1234, progress: 40 },
  { name: "Hair Color/ Treatment", bookings: 1234, progress: 35 },
  { name: "Nail Art", bookings: 1234, progress: 30 },
  { name: "Pedicure", bookings: 1234, progress: 25 },
  { name: "Manicure", bookings: 1234, progress: 20 },
];

const revenueData = [
  { day: "1.01", value: 1240 },
  { day: "1.02", value: 1210 },
  { day: "1.03", value: 1270 },
  { day: "1.04", value: 1230 },
  { day: "1.05", value: 1260 },
  { day: "1.06", value: 1280 },
  { day: "1.07", value: 1250 },
  { day: "1.08", value: 1260 },
  { day: "1.09", value: 1230 },
  { day: "1.10", value: 1240 },
  { day: "1.11", value: 1270 },
  { day: "1.12", value: 1260 },
  { day: "1.13", value: 1240 },
  { day: "1.14", value: 1250 },
  { day: "1.15", value: 1240 },
];

export default function Analytics() {
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Deep Drive Business Analytics</h1>
        <p className="text-gray-500 mt-1">Real time performance metrics across all salon locations and service trends.</p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by salon name, city ..."
            className="pl-10 h-12 border-gray-200 rounded-lg bg-white"
          />
        </div>
        <div className="relative w-full md:w-64">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-between border-gray-200 text-gray-500">
                Search by Status
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuItem>High Performing</DropdownMenuItem>
              <DropdownMenuItem>Average</DropdownMenuItem>
              <DropdownMenuItem>Low Performing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F1F8F1]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="py-4 font-semibold text-[#828282]">SALON NAME</TableHead>
              <TableHead className="py-4 font-semibold text-[#828282]">CITY</TableHead>
              <TableHead className="py-4 font-semibold text-[#828282]">TOTAL VISITS</TableHead>
              <TableHead className="py-4 font-semibold text-[#828282]">CUTOMERS COUNT</TableHead>
              <TableHead className="py-4 font-semibold text-[#828282]">POINTS</TableHead>
              <TableHead className="py-4 font-semibold text-[#828282]">STATUS</TableHead>
              <TableHead className="py-4 font-semibold text-[#828282]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyticsData.map((salon) => (
              <TableRow key={salon.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <TableCell className="py-4 font-medium">{salon.name}</TableCell>
                <TableCell className="py-4 text-[#4A4A4A]">{salon.city}</TableCell>
                <TableCell className="py-4 text-[#4A4A4A]">{salon.visits}</TableCell>
                <TableCell className="py-4 text-[#4A4A4A]">{salon.customers}</TableCell>
                <TableCell className="py-4 text-[#4A4A4A]">{salon.points}</TableCell>
                <TableCell className="py-4">
                  <Badge className="bg-[#E6F4EA] text-[#2E7D32] border-none font-medium px-4 py-1 rounded-full shadow-none hover:bg-[#E6F4EA]">
                    {salon.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#A8D5BA] hover:text-[#82C09A] hover:bg-[#F1F8F1] font-medium"
                        onClick={() => setSelectedSalon(salon)}
                      >
                        View
                      </Button>
                    </SheetTrigger>

                    {/* Sheet Content Implementation */}
                    <SheetContent className="sm:max-w-md overflow-y-auto px-4">
                      <SheetHeader className="text-left space-y-0  px-2">
                        <SheetTitle className="text-2xl font-bold bg-white text-gray-800">
                          {selectedSalon?.name || "Elite Hair & Spa"}
                        </SheetTitle>
                        <p className="text-gray-500 font-medium">
                          {selectedSalon?.city || "New York"} - High Performing
                        </p>
                      </SheetHeader>

                      <div className="space-y-8 mt-6">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-4 gap-3">
                          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                            <p className="text-xl font-bold">$1,240</p>
                            <p className="text-[10px] text-gray-400 leading-tight">Monthly Visit Freq.</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                            <p className="text-xl font-bold">$1,440</p>
                            <p className="text-[10px] text-gray-400 leading-tight">Monthly Avg. Visit Freq.</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                            <p className="text-xl font-bold">$32,100</p>
                            <p className="text-[10px] text-gray-400 leading-tight">Avg. Monthly Revenue</p>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                            <p className="text-xl font-bold">420</p>
                            <p className="text-[10px] text-gray-400 leading-tight">Customers in last 30 days</p>
                          </div>
                        </div>

                        {/* Revenue Chart - Custom implementation to match visual */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-800">Daily Revenue <span className="text-gray-400 font-normal">(Last 30 Days)</span></h3>
                          <div className="h-32 flex items-end gap-1.5 px-2">
                            {[40, 60, 50, 80, 55, 65, 75, 90, 60, 65, 55, 78, 85, 60, 65, 70].map((h, i) => (
                              <div
                                key={i}
                                className={`w-full rounded-t-sm ${i === 7 ? 'bg-[#A8D5BA]' : 'bg-[#E8F5E9] hover:bg-[#A8D5BA] transition-colors cursor-pointer'}`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400 px-2">
                            <span>1.01</span>
                            <span>1.50</span>
                            <span>9.02</span>
                            <span>1.05</span>
                            <span>11.46</span>
                            <span>12.90</span>
                            <span>17.50</span>
                            <span>12.23</span>
                            <span>15.30</span>
                          </div>
                        </div>

                        {/* Top Performing Service Overview */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-800">Top Performing Service Overview</h3>
                          <div className="space-y-4">
                            {[
                              { label: 'Haircut', val: 40 },
                              { label: 'Coloring', val: 30 },
                              { label: 'Manicure', val: 20 },
                              { label: 'Facial', val: 10 }
                            ].map((item) => (
                              <div key={item.label} className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 w-20">{item.label}</span>
                                <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#A8D5BA] rounded-full"
                                    style={{ width: `${item.val * 2}%` }} // Adjusted for visual representation
                                  />
                                </div>
                                <span className="text-sm text-[#A8D5BA] font-medium">{item.val}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Insights */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-800">Insights</h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 border border-gray-100 rounded-lg">
                                <Calendar className="w-4 h-4 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600">Best day: <span className="font-bold text-gray-800">Friday</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 border border-gray-100 rounded-lg">
                                <Clock className="w-4 h-4 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600">Slowest day: <span className="font-bold text-gray-800">Monday</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 border border-gray-100 rounded-lg">
                                <User className="w-4 h-4 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600 font-medium">Avg: Customer Spend</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 pb-8">
                          <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-200">
                            Export PDF
                          </Button>
                          <Button className="flex-1 h-12 rounded-xl bg-[#A8D5BA] hover:bg-[#82C09A] border-none text-gray-800 shadow-none">
                            Open Full Report
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Section */}
        <div className="p-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing <span className="font-medium">1 to 5</span> of <span className="font-medium">42</span> results</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 px-4 rounded-lg border-gray-200 text-gray-600">Previous</Button>
            <div className="flex gap-1">
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg bg-[#A8D5BA] text-white">1</Button>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg text-gray-600">2</Button>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg text-gray-600">3</Button>
              <span className="flex items-center px-1 text-gray-400">...</span>
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg text-gray-600">9</Button>
            </div>
            <Button variant="outline" className="h-9 px-4 rounded-lg border-gray-200 text-gray-600">Next</Button>
          </div>
        </div>
      </div>

      {/* Service Ranking Card Section */}
      <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <h2 className="text-lg font-bold text-gray-800">Top Service Usage Ranking</h2>
        <p className="text-sm text-gray-400 mb-6">Frequency of service across all branches</p>

        <div className="space-y-6">
          {serviceUsageRanking.map((service) => (
            <div key={service.name} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{service.name}</span>
                <span className="text-gray-400">{service.bookings} bookings</span>
              </div>
              <div className="h-2 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A8D5BA] rounded-full"
                  style={{ width: `${service.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}