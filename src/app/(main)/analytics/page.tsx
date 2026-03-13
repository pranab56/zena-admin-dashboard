"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  User
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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
  { id: 2, name: "Luxe Beauty", city: "Los Angeles", visits: 980, customers: 850, points: "$850.00", status: "Average" },
  { id: 3, name: "Glow Salon", city: "Chicago", visits: 450, customers: 300, points: "$300.00", status: "Low Performing" },
  { id: 4, name: "Royal Spa", city: "Miami", visits: 2100, customers: 1800, points: "$1800.00", status: "High Performing" },
  { id: 5, name: "Modern Cuts", city: "Houston", visits: 1100, customers: 950, points: "$950.00", status: "Average" },
  { id: 6, name: "Urban Chic", city: "Seattle", visits: 600, customers: 500, points: "$500.00", status: "Average" },
  { id: 7, name: "Bella Spa", city: "San Francisco", visits: 1500, customers: 1300, points: "$1300.00", status: "High Performing" },
  { id: 8, name: "Silk & Smooth", city: "Boston", visits: 300, customers: 200, points: "$200.00", status: "Low Performing" },
  { id: 9, name: "The Grooming Room", city: "Dallas", visits: 1200, customers: 1100, points: "$1100.00", status: "High Performing" },
  { id: 10, name: "Oasis Beauty", city: "Phoenix", visits: 800, customers: 700, points: "$700.00", status: "Average" },
];

const serviceUsageRanking = [
  { name: "Haircut", bookings: 1234, progress: 40 },
  { name: "Hair Color/ Treatment", bookings: 1234, progress: 35 },
  { name: "Nail Art", bookings: 1234, progress: 30 },
  { name: "Pedicure", bookings: 1234, progress: 25 },
  { name: "Manicure", bookings: 1234, progress: 20 },
];

export default function Analytics() {
  const { t } = useTranslation();
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    return analyticsData.filter((salon) => {
      const matchesSearch =
        salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        salon.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">{t('business_analytics')}</h1>
        <p className="text-gray-500 mt-1">{t('business_analytics_desc')}</p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('search_analytics_placeholder')}
            className="ps-10 h-12 border-gray-200 rounded-lg bg-white focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={statusFilter} onValueChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full h-12 border-gray-200 py-[23px] rounded-lg bg-white text-gray-500 focus:ring-0">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_status')}</SelectItem>
              <SelectItem value="High Performing">{t('high_performing')}</SelectItem>
              <SelectItem value="Average">{t('average')}</SelectItem>
              <SelectItem value="Low Performing">{t('low_performing')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F1F8F1]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="py-4 font-semibold text-start text-[#828282]">{t('salon_name_header')}</TableHead>
              <TableHead className="py-4 font-semibold text-start text-[#828282]">{t('city')}</TableHead>
              <TableHead className="py-4 font-semibold text-start text-[#828282]">{t('total_visits')}</TableHead>
              <TableHead className="py-4 font-semibold text-start text-[#828282]">{t('customers_count_header')}</TableHead>
              <TableHead className="py-4 font-semibold text-start text-[#828282]">{t('points_header')}</TableHead>
              <TableHead className="py-4 font-semibold text-start text-[#828282]">{t('status')}</TableHead>
              <TableHead className="py-4 font-semibold text-start text-[#828282]">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((salon) => (
                <TableRow key={salon.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <TableCell className="py-4 font-medium">{salon.name}</TableCell>
                  <TableCell className="py-4 text-[#4A4A4A]">{salon.city}</TableCell>
                  <TableCell className="py-4 text-[#4A4A4A]">{salon.visits}</TableCell>
                  <TableCell className="py-4 text-[#4A4A4A]">{salon.customers}</TableCell>
                  <TableCell className="py-4 text-[#4A4A4A]">{salon.points}</TableCell>
                  <TableCell className="py-4">
                    <Badge className={cn(
                      "border-none font-medium px-4 py-1 rounded-full shadow-none",
                      salon.status === "High Performing" ? "bg-[#E6F4EA] text-[#2E7D32] hover:bg-[#E6F4EA]" :
                        salon.status === "Average" ? "bg-[#FFF4E5] text-[#B76E00] hover:bg-[#FFF4E5]" :
                          "bg-[#FFEBEE] text-[#C62828] hover:bg-[#FFEBEE]"
                    )}>
                      {salon.status === "High Performing" ? t('high_performing') : salon.status === "Average" ? t('average') : t('low_performing')}
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
                          {t('view_details')}
                        </Button>
                      </SheetTrigger>

                      {/* Sheet Content Implementation */}
                      <SheetContent className="sm:max-w-md overflow-y-auto px-4">
                        <SheetHeader className="text-start space-y-0  px-2">
                          <SheetTitle className="text-2xl font-bold bg-white text-gray-800">
                            {selectedSalon?.name || "Elite Hair & Spa"}
                          </SheetTitle>
                          <p className="text-gray-500 font-medium">
                            {selectedSalon?.city || ""} - {selectedSalon?.status === "High Performing" ? t('high_performing') : selectedSalon?.status === "Average" ? t('average') : t('low_performing')}
                          </p>
                        </SheetHeader>

                        <div className="space-y-8 mt-6">
                          {/* Stat Cards */}
                          <div className="grid grid-cols-4 gap-3">
                            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                              <p className="text-xl font-bold">$1,240</p>
                              <p className="text-[10px] text-gray-400 leading-tight">{t('monthly_visit_freq')}</p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                              <p className="text-xl font-bold">$1,440</p>
                              <p className="text-[10px] text-gray-400 leading-tight">{t('monthly_avg_visit_freq')}</p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                              <p className="text-xl font-bold">$32,100</p>
                              <p className="text-[10px] text-gray-400 leading-tight">{t('avg_monthly_revenue')}</p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                              <p className="text-xl font-bold">420</p>
                              <p className="text-[10px] text-gray-400 leading-tight">{t('customers_last_30_days')}</p>
                            </div>
                          </div>

                          {/* Revenue Chart - Custom implementation to match visual */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-800">{t('daily_revenue')} <span className="text-gray-400 font-normal">{t('last_30_days')}</span></h3>
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
                            <h3 className="text-sm font-semibold text-gray-800">{t('top_performing_service')}</h3>
                            <div className="space-y-4">
                              {[
                                { label: 'Haircut', val: 40 },
                                { label: 'Coloring', val: 30 },
                                { label: 'Manicure', val: 20 },
                                { label: 'Facial', val: 10 }
                              ].map((item) => (
                                <div key={item.label} className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600 w-20">{t(item.label.toLowerCase().replace(/ /g, '_'))}</span>
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
                            <h3 className="text-sm font-semibold text-gray-800">{t('insights')}</h3>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 border border-gray-100 rounded-lg">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600">{t('best_day')} <span className="font-bold text-gray-800">{t('friday')}</span></p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 border border-gray-100 rounded-lg">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600">{t('slowest_day')} <span className="font-bold text-gray-800">{t('monday')}</span></p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 border border-gray-100 rounded-lg">
                                  <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{t('avg_customer_spend')}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-4 pt-4 pb-8">
                            <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-200">
                              {t('export_pdf')}
                            </Button>
                            <Button className="flex-1 h-12 rounded-xl bg-[#A8D5BA] hover:bg-[#82C09A] border-none text-gray-800 shadow-none">
                              {t('open_full_report')}
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  {t('no_data')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Section */}
        <div className="p-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t('showing_results', { start: filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0, end: Math.min(currentPage * itemsPerPage, filteredData.length), total: filteredData.length, defaultValue: `Showing ${filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to ${Math.min(currentPage * itemsPerPage, filteredData.length)} of ${filteredData.length} results` })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 px-4 rounded-lg border-gray-200 text-gray-600 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 ms-1" />
              {t('previous')}
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant="ghost"
                  className={cn(
                    "h-9 w-9 p-0 rounded-lg transition-colors",
                    currentPage === page
                      ? "bg-[#A8D5BA] text-white hover:bg-[#97C4A9] hover:text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className="h-9 px-4 rounded-lg border-gray-200 text-gray-600 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              {t('next')}
              <ChevronRight className="h-4 w-4 me-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Service Ranking Card Section */}
      <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl text-start">
        <h2 className="text-lg font-bold text-gray-800">{t('top_service_ranking')}</h2>
        <p className="text-sm text-gray-400 mb-6">{t('frequency_all_branches')}</p>

        <div className="space-y-6">
          {serviceUsageRanking.map((service) => (
            <div key={service.name} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{t(service.name.toLowerCase().replace(/[\/ ]/g, '_'))}</span>
                <span className="text-gray-400">{t('bookings_count', { count: service.bookings })}</span>
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