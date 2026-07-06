"use client";

import Loading from "@/components/common/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllSalonQuery, useCreateSalonMutation, useSalonCardQuery } from "@/features/super_admin/salon/salonApi";
import { cn } from "@/lib/utils";
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { differenceInDays, format, isBefore } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

const SalonsManagement = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyApF_j3S_70p5uDk1YYkkOCQCgV3amTPMU",
    libraries,
  });

  const [mapCenter, setMapCenter] = useState({ lat: 25.2048, lng: 55.2708 }); // Default to Dubai
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // New salon form states
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Salon",
    city: "",
    location: "",
    subscriptionType: "basic",
    phone: "",
    email: "",
    password: "",
    lat: "",
    lon: ""
  });

  const normalizeSaudiPhoneInput = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('00971')) {
      digits = digits.slice(5);
    } else if (digits.startsWith('971')) {
      digits = digits.slice(3);
    } else if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    return digits.slice(0, 9);
  };

  const { data: salonsRes, isLoading: isSalonsLoading } = useAllSalonQuery({
    limit: 1000 // Fetching a large number to support front-end filtering
  });

  const { data: cardRes } = useSalonCardQuery(undefined);
  const cardData = cardRes?.data || {};

  const [createSalon, { isLoading: isCreating }] = useCreateSalonMutation();

  interface ManagedSalon {
    _id: string;
    businessName: string;
    password: string;
    city: string;
    activeStatus: string;
    startDate: string;
    expiryDate: string;
  }

  // Front-end filtering logic
  const filteredSalons = useMemo(() => {
    let filtered = (salonsRes?.data || []) as ManagedSalon[];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((s: ManagedSalon) =>
        s.businessName?.toLowerCase().includes(searchLower) ||
        s.city?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s: ManagedSalon) => s.activeStatus === statusFilter);
    }

    // Start Date filter
    if (startDate) {
      filtered = filtered.filter((s: ManagedSalon) => {
        const sDate = new Date(s.startDate);
        sDate.setHours(0, 0, 0, 0);
        const filterDate = new Date(startDate);
        filterDate.setHours(0, 0, 0, 0);
        return sDate >= filterDate;
      });
    }

    // End Date filter
    if (endDate) {
      filtered = filtered.filter((s: ManagedSalon) => {
        const eDate = new Date(s.expiryDate);
        eDate.setHours(23, 59, 59, 999);
        const filterDate = new Date(endDate);
        filterDate.setHours(23, 59, 59, 999);
        return eDate <= filterDate;
      });
    }

    return filtered;
  }, [salonsRes?.data, searchTerm, statusFilter, startDate, endDate]);

  const totalPages = Math.ceil(filteredSalons.length / itemsPerPage);
  const paginatedSalons = filteredSalons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalResults = filteredSalons.length;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Form states for new salon
  const [newSalonStartDate, setNewSalonStartDate] = useState<Date>();
  const [newSalonExpiryDate, setNewSalonExpiryDate] = useState<Date>();

  const stats = [
    { label: t('active_salons'), value: cardData.activeSalon || "0", bg: "bg-[#F5F5F3]" },
    { label: t('total_customers'), value: (cardData.totalUser || 0).toLocaleString(), bg: "bg-[#F5F5F3]" },
    { label: t('expiring_soon'), value: cardData.totalExpiringSoon || "0", bg: "bg-[#F5F5F3]", valueColor: "text-[#D97706]" },
  ];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData((prev) => ({ ...prev, lat: lat.toString(), lon: lng.toString() }));
    }
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newCoords = { lat, lng };

        // Pan to new location
        if (mapRef.current) {
          mapRef.current.panTo(newCoords);
          mapRef.current.setZoom(15);
        }

        setMapCenter(newCoords);
        setFormData((prev) => ({
          ...prev,
          lat: lat.toString(),
          lon: lng.toString(),
          location: place.formatted_address || prev.location,
        }));
      }
    }
  };

  const handleSaveSalon = async () => {
    try {
      if (!newSalonStartDate || !newSalonExpiryDate) {
        toast.error(t('dates_required', { defaultValue: 'Start and Expiry dates are required' }));
        return;
      }

      const payload = {
        ...formData,
        phone: `+971${normalizeSaudiPhoneInput(formData.phone)}`,
        startDate: newSalonStartDate.toISOString(),
        expiryDate: newSalonExpiryDate.toISOString(),
      };

      const res = await createSalon(payload).unwrap();
      if (res.success) {
        setShowAddModal(false);
        setShowSuccessModal(true);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || t('failed_to_create_salon'));
    }
  };

  if (isSalonsLoading) return <Loading />;



  return (
    <div className="sm:px-6 lg:px-0 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{t('salons_management')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('salon_desc')}
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-medium px-6 py-5 rounded-lg"
        >
          {t('create_new_salon')}
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className={`${s.bg} border-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-28 flex flex-col justify-center px-6`}>
            <p className="text-[#6B7280] text-xs font-semibold tracking-wide uppercase">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.valueColor || "text-gray-800"}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            className="ps-4 pe-10 py-6 bg-[#F5F5F3] border-none rounded-lg text-gray-500 placeholder:text-gray-400 focus-visible:ring-0"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full sm:w-[200px] py-6 bg-[#F5F5F3] border-none rounded-lg text-gray-500 focus:ring-0">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent className='w-full'>
              <SelectItem value="all">{t('all_status')}</SelectItem>
              <SelectItem value="ACTIVE">{t('active')}</SelectItem>
              <SelectItem value="EXPIRED">{t('expired')}</SelectItem>
              <SelectItem value="PENDING">{t('pending')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Picker Filters */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[160px] py-6 bg-[#F5F5F3] border-none rounded-lg text-gray-500 hover:bg-[#F5F5F3] hover:text-gray-600 justify-start font-normal",
                    !startDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="me-2 h-4 w-4" />
                  {startDate ? format(startDate, "PP") : <span>{t('start_date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setCurrentPage(1);
                  }}
                  classNames={{
                    selected: "bg-[#A8D5BA] text-gray-800 hover:bg-[#97C4A9] hover:text-gray-800 font-semibold",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[160px] py-6 bg-[#F5F5F3] border-none rounded-lg text-gray-500 hover:bg-[#F5F5F3] hover:text-gray-600 justify-start font-normal",
                    !endDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="me-2 h-4 w-4" />
                  {endDate ? format(endDate, "PP") : <span>{t('end_date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setCurrentPage(1);
                  }}
                  classNames={{
                    selected: "bg-[#A8D5BA] text-gray-800 hover:bg-[#97C4A9] hover:text-gray-800 font-semibold",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader className='bg-[#F1F8F1]'>
              <tr className=" border-none">
                <TableHead className="text-gray-600 font-bold py-4 ps-6 uppercase text-[13px]">{t('salon_name')}</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">{t('start_date')}</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">{t('expiry_date')}</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">{t('days_remaining')}</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">{t('customers_count')}</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">{t('city')}</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">{t('status')}</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {paginatedSalons.length > 0 ? (
                paginatedSalons.map((salon: {
                  _id: string;
                  businessName: string;
                  password: string;
                  startDate: string;
                  expiryDate: string;
                  visitor?: number;
                  city: string;
                }, i: number) => {
                  const expiryDate = new Date(salon.expiryDate);
                  const isExpired = isBefore(expiryDate, new Date());
                  const daysRemaining = differenceInDays(expiryDate, new Date());

                  return (
                    <TableRow key={i} className="group hover:bg-gray-50/50 border-b border-gray-50 transition-colors relative">
                      <TableCell className="py-5 ps-6 text-left">
                        <p className="font-semibold text-gray-800 text-[15px]">{salon.businessName}</p>
                        <p className="text-xs text-gray-400">ID: {salon.password?.slice(0, 12)}...</p>
                      </TableCell>
                      <TableCell className="text-gray-700 font-medium text-[15px]">{format(new Date(salon.startDate), "dd-MM-yyyy")}</TableCell>
                      <TableCell className="text-gray-700 font-medium text-[15px]">{format(new Date(salon.expiryDate), "dd-MM-yyyy")}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "hover:bg-opacity-80 border-none px-4 py-1.5 font-medium rounded-lg shadow-none",
                          daysRemaining <= 7 ? "bg-[#FDE6D2] text-[#D97706]" : "bg-green-100 text-green-700"
                        )}>
                          {daysRemaining > 0 ? `${daysRemaining} ${t('days_left')}` : t('expired')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 font-medium text-[15px]">{salon.visitor || 0}</TableCell>
                      <TableCell className="text-gray-700 font-medium text-[15px]">{salon.city}</TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-lg px-4 py-1.5 font-medium text-[13px] border-none shadow-none ${!isExpired
                            ? 'bg-[#D1EBD9] text-[#2F6B43] hover:bg-[#D1EBD9]'
                            : 'bg-[#F9D8D8] text-[#D84C4C] hover:bg-[#F9D8D8]'
                            }`}
                        >
                          {!isExpired ? t('active') : t('expired')}
                        </Badge>
                      </TableCell>

                      <Link href={`/salons-management/view?id=${salon._id}`}>
                        <div className="absolute end-0 top-0 bottom-0 w-max hidden group-hover:flex items-center">
                          <div className="bg-[#A8D5BA] text-gray-800 font-medium px-4 h-full flex items-center cursor-pointer rounded-s-md shadow-lg">
                            {t('view')}
                          </div>
                        </div>
                      </Link>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    {t('no_salons_found')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-10">
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          {t('showing_results', {
            start: paginatedSalons.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0,
            end: Math.min(currentPage * itemsPerPage, totalResults),
            total: totalResults
          })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            className="rounded-lg px-4 border-gray-300 text-gray-600 font-medium disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 me-1" />
            {t('previous')}
          </Button>
          <div className="hidden min-[400px]:flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "font-medium rounded-md w-9 h-9 p-0 transition-colors",
                  currentPage === page
                    ? "bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                )}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="rounded-lg px-4 border-gray-300 text-gray-600 font-medium disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            {t('next')}
            <ChevronRight className="h-4 w-4 ms-1" />
          </Button>
        </div>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target?.closest('.pac-container')) {
              e.preventDefault();
            }
          }}
          className="max-w-[850px] w-[95vw] p-0 border-none bg-[#F5F5F3] overflow-hidden rounded-3xl max-h-[95vh] flex flex-col"
        >
          <style dangerouslySetInnerHTML={{
            __html: `
            .pac-container {
              z-index: 9999 !important;
              pointer-events: auto !important;
            }
          `}} />
          <div className="p-5 sm:p-8 space-y-8 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{t('add_new_salon')}</h2>
                <p className="text-sm text-gray-500">{t('add_new_salon_desc')}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">{t('business_name')}</Label>
                  <Input
                    placeholder="Rg. Elgance Bonuty Spa"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="bg-[#E9E9E7] border-none h-12 rounded-xl placeholder:text-gray-400 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label className="text-gray-700 font-medium">{t('business_type')}</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(val) => setFormData({ ...formData, businessType: val })}
                  >
                    <SelectTrigger className="bg-[#E9E9E7] w-full py-6 border-none h-12 rounded-xl text-gray-500 focus:ring-0">
                      <SelectValue placeholder={t('select_type')} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#D4A1AF] border-none text-gray-800">
                      <SelectItem value="Salon" className="focus:bg-[#C4919F]">{t('salon', { defaultValue: 'Salon' })}</SelectItem>
                      <SelectItem value="Spa" className="focus:bg-[#C4919F]">{t('spa', { defaultValue: 'Spa' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">{t('city')}</Label>
                  <Input
                    placeholder="Dubai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-[#E9E9E7] border-none h-12 rounded-xl focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">{t('location_address')}</Label>
                  <div className="relative">
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                        onPlaceChanged={onPlaceChanged}
                      >
                        <Input
                          placeholder="Type address or search on map..."
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="bg-[#E9E9E7] border-none h-12 rounded-xl pe-10 focus-visible:ring-0 w-full"
                        />
                      </Autocomplete>
                    ) : (
                      <Input
                        placeholder="Downtown Blvd"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="bg-[#E9E9E7] border-none h-12 rounded-xl pe-10 focus-visible:ring-0"
                      />
                    )}
                    <svg className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Google Map Section */}
              <div className="space-y-4">
                <Label className="text-gray-700 font-medium">
                  {t('select_location_on_map', { defaultValue: 'Select Location on Map' })}
                </Label>
                <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-gray-200 relative">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={formData.lat && formData.lon ? { lat: parseFloat(formData.lat), lng: parseFloat(formData.lon) } : mapCenter}
                      zoom={13}
                      onLoad={onMapLoad}
                      onClick={onMapClick}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                      }}
                    >
                      {formData.lat && formData.lon && (
                        <Marker position={{ lat: parseFloat(formData.lat), lng: parseFloat(formData.lon) }} />
                      )}
                    </GoogleMap>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      Loading Map...
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription Plan Section */}
              <div className="space-y-4 w-full">
                <h3 className="text-lg font-semibold text-gray-800">{t('subscription_plan')}</h3>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">{t('subscription_type')}</Label>
                  <Select
                    value={formData.subscriptionType}
                    onValueChange={(val) => setFormData({ ...formData, subscriptionType: val })}
                  >
                    <SelectTrigger className="bg-[#E9E9E7] w-full py-6 border-none h-12 rounded-xl text-gray-500 focus:ring-0">
                      <SelectValue placeholder={t('select_type')} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#D4A1AF] border-none text-gray-800">
                      <SelectItem value="basic" className="focus:bg-[#C4919F]">{t('basic', { defaultValue: 'Basic' })}</SelectItem>
                      <SelectItem value="premium" className="focus:bg-[#C4919F]">{t('premium', { defaultValue: 'Premium' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">{t('start_date')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full bg-[#E9E9E7] border-none h-12 rounded-xl ps-10 focus:ring-0 text-left font-normal text-gray-500",
                            !newSalonStartDate && "text-gray-400"
                          )}
                        >

                          {newSalonStartDate ? format(newSalonStartDate, "PP") : <span>12-12-2025</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newSalonStartDate}
                          onSelect={setNewSalonStartDate}
                          classNames={{
                            selected: "bg-[#A8D5BA] text-gray-800 hover:bg-[#97C4A9] hover:text-gray-800 font-semibold",
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">{t('expiry_date')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full bg-[#E9E9E7] border-none h-12 rounded-xl ps-10 focus:ring-0 text-left font-normal text-gray-500",
                            !newSalonExpiryDate && "text-gray-400"
                          )}
                        >
                          {newSalonExpiryDate ? format(newSalonExpiryDate, "PP") : <span>12-12-2026</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newSalonExpiryDate}
                          onSelect={setNewSalonExpiryDate}
                          classNames={{
                            selected: "bg-[#A8D5BA] text-gray-800 hover:bg-[#97C4A9] hover:text-gray-800 font-semibold",
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Business Admin Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">{t('assign_admin_info')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">{t('phone')}</Label>
                    <Input
                      placeholder="+971-5XXXXXXXX"
                      value={`+971-${formData.phone}`}
                      onChange={(e) => setFormData({ ...formData, phone: normalizeSaudiPhoneInput(e.target.value) })}
                      maxLength={14}
                      inputMode="numeric"
                      className="bg-[#E9E9E7] border-none h-12 rounded-xl focus-visible:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">{t('email')}</Label>
                    <Input
                      placeholder="contact@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#E9E9E7] border-none h-12 rounded-xl focus-visible:ring-0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">{t('password')}</Label>
                  <Input
                    type="password"
                    placeholder={t('password')}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-[#E9E9E7] border-none h-12 rounded-xl focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-4 ">
                <h3 className="text-lg font-semibold text-gray-800">{t('status')}</h3>
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-[#D1EBD9] rounded-xl bg-[#F0F4F1] gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="font-semibold text-gray-800">{t('activate_account')}</h4>
                    <p className="text-xs text-gray-500">{t('activate_account_desc')}</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#D45D8A]" defaultChecked />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pb-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-[#D45D8A] text-[#D45D8A] hover:bg-[#D45D8A]/10 px-8 py-3 h-auto rounded-xl font-medium order-2 sm:order-1"
                  onClick={() => setShowAddModal(false)}
                >
                  {t('cancel')}
                </Button>
                <Button
                  className="w-full sm:w-auto bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-medium px-8 py-3 h-auto rounded-xl shadow-none order-1 sm:order-2 disabled:opacity-70"
                  onClick={handleSaveSalon}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin me-2" />
                      {t('saving', { defaultValue: 'Saving...' })}
                    </>
                  ) : t('save_salon')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-[400px] p-0 border-none bg-[#E9E9E7] rounded-3xl overflow-hidden">
          <div className="relative p-10 flex flex-col items-center text-center">
            <button
              className="absolute end-4 top-4 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl p-2"
              onClick={() => setShowSuccessModal(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="w-16 h-16 bg-[#A8D5BA] rounded-full flex items-center justify-center mb-8">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h3 className="text-xl font-medium text-gray-700 leading-tight mb-8">
              {t('invite_sent_success')}
            </h3>

            <div className="w-full space-y-4 mb-10 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">{t('business_name')}</span>
                <span className="text-gray-500 font-medium">Elegance Beauty Spa</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">{t('admin_number')}</span>
                <span className="text-gray-500 font-medium">+1 (555) 000 0000</span>
              </div>
            </div>

            <Button
              className="w-48 bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold py-6 text-lg rounded-2xl shadow-none"
              onClick={() => setShowSuccessModal(false)}
            >
              {t('ok')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warning Modal */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent className="max-w-[400px] p-0 border-none bg-[#E9E9E7] rounded-3xl overflow-hidden">
          <div className="relative p-10 flex flex-col items-center text-center">
            <button
              className="absolute end-4 top-4 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl p-2"
              onClick={() => setShowWarningModal(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="w-16 h-16 flex items-center justify-center mb-8">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L1 21H23L12 2Z" fill="#E9E29D" stroke="#E9E29D" strokeWidth="2" strokeLinejoin="round" />
                <rect x="11.5" y="10" width="1" height="6" rx="0.5" fill="#333" />
                <circle cx="12" cy="18" r="0.7" fill="#333" />
              </svg>
            </div>

            <h3 className="text-xl font-medium text-gray-700 leading-tight mb-10 px-4">
              {t('business_type_change_warning')}
            </h3>

            <div className="flex gap-4 w-full justify-center">
              <Button
                variant="outline"
                className="w-32 bg-transparent border-[#D45D8A] text-[#D45D8A] hover:bg-[#D45D8A]/10 py-6 rounded-xl font-bold"
                onClick={() => setShowWarningModal(false)}
              >
                {t('no')}
              </Button>
              <Button
                className="w-32 bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold py-6 rounded-xl shadow-none"
                onClick={() => setShowWarningModal(false)}
              >
                {t('yes')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalonsManagement;