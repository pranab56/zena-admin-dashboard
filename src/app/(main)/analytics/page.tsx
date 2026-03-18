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
  SheetFooter,
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
  useAllSalonAnalysisQuery,
  useSalonAnalysisDetailsQuery,
  useTopServicesQuery
} from '@/features/super_admin/analysis/analysisApi';
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Loader2,
  Search,
  User
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Salon {
  _id: string;
  salonId: string;
  businessName: string;
  city: string;
  activeStatus: string;
  subscriptionType: string;
  expiryDate: string;
  totalVisits: number;
  customersCount: number;
  totalPoints: number;
}

interface TopService {
  serviceName: string;
  totalVisits: number;
  branchCount: number;
  percentage: number;
}

export default function Analytics() {
  const { t } = useTranslation();
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all salons analysis - use a higher limit for client-side filtering
  const { data: allSalonsData, isLoading: isAllSalonsLoading } = useAllSalonAnalysisQuery({
    page: 1,
    limit: 1000,
  });

  // Fetch top services ranking
  const { data: topServicesData } = useTopServicesQuery(undefined);

  // Fetch salon details when one is selected
  const { data: salonDetailsData, isFetching: isDetailsLoading } = useSalonAnalysisDetailsQuery(selectedSalonId, {
    skip: !selectedSalonId
  });

  const allSalons = useMemo(() => allSalonsData?.data?.data || [], [allSalonsData]);

  // Client-side filtering
  const filteredSalons = useMemo(() => {
    return allSalons.filter((salon: Salon) => {
      const matchesSearch = !searchTerm ||
        salon.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || salon.activeStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allSalons, searchTerm, statusFilter]);

  // Client-side pagination
  const totalResults = filteredSalons.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const paginatedSalons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSalons.slice(start, start + itemsPerPage);
  }, [filteredSalons, currentPage]);

  const topServices = topServicesData?.data || [];

  interface SalonDetails {
    metrics: {
      monthlyVisitFreq: number;
      monthlyAvgVisitFreq: number;
      avgMonthlyRevenue: number;
      customersInLast30Days: number;
    };
    topPerformingServices: Array<{
      name: string;
      percentage: number;
    }>;
    insights: {
      bestDay: string;
      slowestDay: string;
      avgCustomerSpend: number;
    };
  }

  const handleExportPDF = (salonName: string, details: SalonDetails) => {
    if (!details) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Set Font
    doc.setFont("helvetica");

    // Header Background Accent
    doc.setFillColor(168, 213, 186); // #A8D5BA
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Title
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(salonName.toUpperCase(), 20, 25);

    doc.setFontSize(10);
    doc.text(`${t('business_analytics_header')} - ${new Date().toLocaleDateString()}`, 20, 32);

    // 1. Metrics Section
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text(t('performance_overview', { defaultValue: 'Performance Overview' }), 20, 55);

    const metricsData = [
      [t('metric', { defaultValue: 'Metric' }), t('value', { defaultValue: 'Value' })],
      [t('monthly_visit_freq'), details.metrics.monthlyVisitFreq?.toString() || "0"],
      [t('monthly_avg_visit_freq'), details.metrics.monthlyAvgVisitFreq?.toString() || "0"],
      [t('avg_monthly_revenue'), `$${details.metrics.avgMonthlyRevenue || 0}`],
      [t('customers_last_30_days'), details.metrics.customersInLast30Days?.toString() || "0"],
    ];

    autoTable(doc, {
      startY: 60,
      head: [metricsData[0]],
      body: metricsData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [168, 213, 186], textColor: [255, 255, 255], fontStyle: 'bold' },
      margin: { left: 20, right: 20 },
    });

    // 2. Top Services section
    let finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text(t('top_performing_service'), 20, finalY);

    const servicesData = details.topPerformingServices.map((s) => [s.name, `${s.percentage}%`]);

    if (servicesData.length > 0) {
      autoTable(doc, {
        startY: finalY + 5,
        head: [[t('service_name', { defaultValue: 'Service Name' }), t('percentage', { defaultValue: 'Percentage' })]],
        body: servicesData,
        theme: 'grid',
        headStyles: { fillColor: [168, 213, 186], textColor: [255, 255, 255], fontStyle: 'bold' },
        margin: { left: 20, right: 20 },
      });
      finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(t('no_services_found'), 22, finalY + 8);
      finalY += 20;
    }

    // 3. Insights section
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text(t('insights'), 20, finalY);

    const insightsData = [
      [t('best_day'), details.insights.bestDay],
      [t('slowest_day'), details.insights.slowestDay],
      [t('avg_customer_spend'), `$${details.insights.avgCustomerSpend}`],
    ];

    autoTable(doc, {
      startY: finalY + 5,
      body: insightsData,
      theme: 'plain',
      styles: { fontSize: 11 },
      margin: { left: 20, right: 20 },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text('Generated by Zena Admin Dashboard', pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save(`${salonName.replace(/\s+/g, '_')}_${t('analytics')}.pdf`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('business_analytics_header')}</h1>
          <p className="text-gray-500">{t('track_monitor_performance')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('search_salons')}
              className="pl-10 h-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-[#A8D5BA]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-10 bg-gray-50 border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder={t('performance')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="ACTIVE">{t('active')}</SelectItem>
              <SelectItem value="EXPIRED">{t('expired')}</SelectItem>
              <SelectItem value="PENDING">{t('pending')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
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
            {isAllSalonsLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[#A8D5BA]" />
                    <span>{t('loading')}...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedSalons.length > 0 ? (
              paginatedSalons.map((salon: Salon) => (
                <TableRow key={salon._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <TableCell className="py-4 font-medium">{salon.businessName}</TableCell>
                  <TableCell className="py-4 text-[#4A4A4A]">{salon.city}</TableCell>
                  <TableCell className="py-4 text-[#4A4A4A]">{salon.totalVisits}</TableCell>
                  <TableCell className="py-4 text-[#4A4A4A]">{salon.customersCount}</TableCell>
                  <TableCell className="py-4 text-[#4A4A4A]">{salon.totalPoints}</TableCell>
                  <TableCell className="py-4">
                    <Badge className={cn(
                      "border-none font-medium px-4 py-1 rounded-full shadow-none capitalize",
                      salon.activeStatus === "ACTIVE" ? "bg-[#E6F4EA] text-[#2E7D32] hover:bg-[#E6F4EA]" :
                        salon.activeStatus === "EXPIRED" ? "bg-[#FFEBEE] text-[#C62828] hover:bg-[#FFEBEE]" :
                          "bg-[#FFF4E5] text-[#B76E00] hover:bg-[#FFF4E5]"
                    )}>
                      {t(salon.activeStatus?.toLowerCase() || "")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Sheet onOpenChange={(open) => !open && setSelectedSalonId(null)}>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#A8D5BA] hover:text-[#82C09A] hover:bg-[#F1F8F1] font-medium"
                          onClick={() => setSelectedSalonId(salon._id)}
                        >
                          {t('view_details')}
                        </Button>
                      </SheetTrigger>

                      <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                          <SheetHeader className="text-start space-y-0 p-0 mb-6">
                            <SheetTitle className="text-2xl font-bold text-gray-800">
                              {salon.businessName}
                            </SheetTitle>
                            <p className="text-gray-500 font-medium capitalize">
                              {salon.city} - {t(salon.activeStatus?.toLowerCase() || '')}
                            </p>
                          </SheetHeader>

                          {isDetailsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                              <Loader2 className="h-8 w-8 animate-spin text-[#A8D5BA]" />
                              <p className="text-gray-500">{t('loading_details')}...</p>
                            </div>
                          ) : salonDetailsData?.data ? (
                            <div className="space-y-8">
                              {/* Stat Cards */}
                              <div className="grid grid-cols-4 gap-3">
                                <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                                  <p className="text-xl font-bold">{salonDetailsData.data.metrics.monthlyVisitFreq}</p>
                                  <p className="text-[10px] text-gray-400 leading-tight">{t('monthly_visit_freq')}</p>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                                  <p className="text-xl font-bold">{salonDetailsData.data.metrics.monthlyAvgVisitFreq}</p>
                                  <p className="text-[10px] text-gray-400 leading-tight">{t('monthly_avg_visit_freq')}</p>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                                  <p className="text-xl font-bold">${salonDetailsData.data.metrics.avgMonthlyRevenue}</p>
                                  <p className="text-[10px] text-gray-400 leading-tight">{t('avg_monthly_revenue')}</p>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                                  <p className="text-xl font-bold">{salonDetailsData.data.metrics.customersInLast30Days}</p>
                                  <p className="text-[10px] text-gray-400 leading-tight">{t('customers_last_30_days')}</p>
                                </div>
                              </div>

                              {/* Revenue Chart */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-800">{t('daily_revenue')} <span className="text-gray-400 font-normal">{t('last_30_days')}</span></h3>
                                <div className="h-32 flex items-end gap-1.5 px-2">
                                  {salonDetailsData.data.dailyRevenue.map((item: { date: string; revenue: number }, i: number) => {
                                    const maxRevenue = Math.max(...salonDetailsData.data.dailyRevenue.map((d: { revenue: number }) => d.revenue), 1);
                                    const height = (item.revenue / maxRevenue) * 100;
                                    return (
                                      <div
                                        key={i}
                                        className={`w-full rounded-t-sm group relative ${item.revenue > 0 ? 'bg-[#A8D5BA]' : 'bg-[#E8F5E9] hover:bg-[#A8D5BA] transition-colors cursor-pointer'}`}
                                        style={{ height: `${Math.max(height, 5)}%` }}
                                      >
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                                          {item.date}: ${item.revenue}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 px-2 overflow-hidden">
                                  <span>{salonDetailsData.data.dailyRevenue[0]?.date}</span>
                                  <span>{salonDetailsData.data.dailyRevenue[Math.floor(salonDetailsData.data.dailyRevenue.length / 2)]?.date}</span>
                                  <span>{salonDetailsData.data.dailyRevenue[salonDetailsData.data.dailyRevenue.length - 1]?.date}</span>
                                </div>
                              </div>

                              {/* Top Performing Service Overview */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-800">{t('top_performing_service')}</h3>
                                <div className="space-y-4">
                                  {salonDetailsData.data.topPerformingServices.map((item: { name: string; percentage: number }) => (
                                    <div key={item.name} className="flex items-center gap-4">
                                      <span className="text-sm text-gray-600 w-24 truncate">{item.name}</span>
                                      <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-[#A8D5BA] rounded-full"
                                          style={{ width: `${item.percentage}%` }}
                                        />
                                      </div>
                                      <span className="text-sm text-[#A8D5BA] font-medium">{item.percentage}%</span>
                                    </div>
                                  ))}
                                  {salonDetailsData.data.topPerformingServices.length === 0 && (
                                    <p className="text-sm text-gray-400">{t('no_services_found')}</p>
                                  )}
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
                                    <p className="text-sm text-gray-600">{t('best_day')} <span className="font-bold text-gray-800">{salonDetailsData.data.insights.bestDay}</span></p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 border border-gray-100 rounded-lg">
                                      <Clock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-600">{t('slowest_day')} <span className="font-bold text-gray-800">{salonDetailsData.data.insights.slowestDay}</span></p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 border border-gray-100 rounded-lg">
                                      <User className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">{t('avg_customer_spend')}: <span className="font-bold text-gray-800">${salonDetailsData.data.insights.avgCustomerSpend}</span></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-20">
                              <p className="text-gray-500">{t('select_salon_to_view_details')}</p>
                            </div>
                          )}
                        </div>

                        {salonDetailsData?.data && (
                          <SheetFooter className="p-6 border-t bg-white">
                            <Button
                              variant="outline"
                              className="w-full h-11 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                              onClick={() => handleExportPDF(salon.businessName, salonDetailsData.data)}
                            >
                              {t('export_pdf', { defaultValue: 'Export PDF' })}
                            </Button>
                          </SheetFooter>
                        )}
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

        <div className="p-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t('showing_results', {
              start: totalResults > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0,
              end: Math.min(currentPage * itemsPerPage, totalResults),
              total: totalResults,
              defaultValue: `Showing ${totalResults > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to ${Math.min(currentPage * itemsPerPage, totalResults)} of ${totalResults} results`
            })}
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
          {topServices.length > 0 ? (
            topServices.map((service: TopService) => (
              <div key={service.serviceName} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">{service.serviceName}</span>
                  <span className="text-gray-400">{t('visits_count', { count: service.totalVisits })}</span>
                </div>
                <div className="h-2 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A8D5BA] rounded-full"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">{t('no_data')}</p>
          )}
        </div>
      </Card>
    </div>
  );
}