"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { MoreHorizontal } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";

const SalonsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const stats = [
    { label: "ACTIVE SALONS", value: "24", bg: "bg-[#F5F5F3]" },
    { label: "TOTALECOSYSTEM CUSTOMERS", value: "12,400", bg: "bg-[#F5F5F3]" },
    { label: "EXPIRING SOON", value: "04", bg: "bg-[#F5F5F3]", valueColor: "text-[#D97706]" },
  ];

  const salons = [
    { id: "SLN-9921", name: "Elite Hair & Spa", start: "12-12-2025", expiry: "12-12-2026", remaining: "Expiring with 7 days", customers: "1254", city: "Dubai", status: "Expired" },
    { id: "SLN-9921", name: "Elite Hair & Spa", start: "12-12-2025", expiry: "12-12-2026", remaining: "Expiring with 7 days", customers: "1254", city: "Dubai", status: "Expired" },
    { id: "SLN-9921", name: "Elite Hair & Spa", start: "12-12-2025", expiry: "12-12-2026", remaining: "Expiring with 7 days", customers: "1254", city: "Dubai", status: "Expired" },
    { id: "SLN-9921", name: "Elite Hair & Spa", start: "12-12-2025", expiry: "12-12-2026", remaining: "Expiring with 7 days", customers: "1254", city: "Dubai", status: "Active" },
    { id: "SLN-9921", name: "Elite Hair & Spa", start: "12-12-2025", expiry: "12-12-2026", remaining: "Expiring with 7 days", customers: "1254", city: "Dubai", status: "Active" },
    { id: "SLN-9921", name: "Elite Hair & Spa", start: "12-12-2025", expiry: "12-12-2026", remaining: "Expiring with 7 days", customers: "1254", city: "Dubai", status: "Expired" },
    { id: "SLN-9921", name: "Elite Hair & Spa", start: "12-12-2025", expiry: "12-12-2026", remaining: "Expiring with 7 days", customers: "1254", city: "Dubai", status: "Active" },
  ];

  const handleSaveSalon = () => {
    setShowAddModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="sm:px-6 lg:px-0 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Salons Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Oversee partner business performance, status, and tenant settings across the network.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-medium px-6 py-5 rounded-lg"
        >
          Create New Salon
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            className="pl-4 pr-10 py-6 bg-[#F5F5F3] border-none rounded-lg text-gray-500 placeholder:text-gray-400 focus-visible:ring-0"
            placeholder="Search by salon name, city ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select>
            <SelectTrigger className="py-6 bg-[#F5F5F3] border-none rounded-lg text-gray-500 focus:ring-0">
              <SelectValue placeholder="Search by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <tr className="bg-[#E5E9E4] hover:bg-[#E5E9E4] border-none">
                <TableHead className="text-gray-600 font-bold py-4 pl-6 uppercase text-[13px]">SALON NAME</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">START DATE</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">EXPIRY DATE</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">DAYS REMAINING</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">CUTOMERS COUNT</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">CITY</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 uppercase text-[13px]">STATUS</TableHead>
                <TableHead className="text-gray-600 font-bold py-4 pr-6 uppercase text-[13px]">ACTIONS</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {salons.map((salon, i) => (
                <TableRow key={i} className="group hover:bg-gray-50/50 border-b border-gray-50 transition-colors relative">
                  <TableCell className="py-5 pl-6">
                    <p className="font-semibold text-gray-800 text-[15px]">{salon.name}</p>
                    <p className="text-xs text-gray-400">ID: {salon.id}</p>
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium text-[15px]">{salon.start}</TableCell>
                  <TableCell className="text-gray-700 font-medium text-[15px]">{salon.expiry}</TableCell>
                  <TableCell>
                    <Badge className="bg-[#FDE6D2] text-[#D97706] hover:bg-[#FDE6D2] border-none px-4 py-1.5 font-medium rounded-lg shadow-none">
                      {salon.remaining}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium text-[15px]">{salon.customers}</TableCell>
                  <TableCell className="text-gray-700 font-medium text-[15px]">{salon.city}</TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-lg px-4 py-1.5 font-medium text-[13px] border-none shadow-none ${salon.status === 'Active'
                        ? 'bg-[#D1EBD9] text-[#2F6B43] hover:bg-[#D1EBD9]'
                        : 'bg-[#F9D8D8] text-[#D84C4C] hover:bg-[#F9D8D8]'
                        }`}
                    >
                      {salon.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                  {/* Hover View Button Tab */}
                  <Link href={`/salons-management/view`}><div className="absolute right-0 top-0 bottom-0 w-max hidden group-hover:flex items-center">
                    <div className="bg-[#A8D5BA] text-gray-800 font-medium px-4 h-full flex items-center cursor-pointer rounded-l-md shadow-lg">
                      View
                    </div>
                  </div></Link>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-10">
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          Showing <span className="font-medium text-gray-700">1</span> to <span className="font-medium text-gray-700">5</span> of <span className="font-medium text-gray-700">42</span> results
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 order-1 sm:order-2">
          <Button variant="outline" className="rounded-lg px-4 border-gray-300 text-gray-600 font-medium">Previous</Button>
          <div className="hidden min-[400px]:flex items-center gap-1 mx-2">
            <Button className="bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-medium rounded-md w-9 h-9 p-0">1</Button>
            <Button variant="ghost" className="text-gray-500 font-medium w-9 h-9 p-0">2</Button>
            <Button variant="ghost" className="text-gray-500 font-medium w-9 h-9 p-0">3</Button>
            <span className="px-2 text-gray-400">...</span>
            <Button variant="ghost" className="text-gray-500 font-medium w-9 h-9 p-0">9</Button>
          </div>
          <Button variant="outline" className="rounded-lg px-4 border-gray-300 text-gray-600 font-medium">Next</Button>
        </div>
      </div>

      {/* Add New Salon Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-[850px] w-[95vw] p-0 border-none bg-[#F5F5F3] overflow-hidden rounded-3xl max-h-[95vh] overflow-y-auto custom-scrollbar">
          <div className="p-5 sm:p-8 space-y-8">
            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Add New Salon</h2>
                <p className="text-sm text-gray-500">Register a new salon or clinic into the loyalty network.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Business Name</Label>
                  <Input
                    placeholder="Rg. Elgance Bonuty Spa"
                    className="bg-[#E9E9E7] border-none h-12 rounded-xl placeholder:text-gray-400 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label className="text-gray-700 font-medium">Business Type</Label>
                  <Select onValueChange={() => setShowWarningModal(true)}>
                    <SelectTrigger className="bg-[#E9E9E7] w-full py-6 border-none h-12 rounded-xl text-gray-500 focus:ring-0">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#D4A1AF] border-none text-gray-800">
                      <SelectItem value="salon" className="focus:bg-[#C4919F]">Salon</SelectItem>
                      <SelectItem value="spa" className="focus:bg-[#C4919F]">Spa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">City / Location</Label>
                <div className="relative">
                  <Input
                    placeholder="Al Qouz Fourth,Dubai,UAE"
                    className="bg-[#E9E9E7] border-none h-12 rounded-xl pr-10 focus-visible:ring-0"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
              </div>

              {/* Subscription Plan Section */}
              <div className="space-y-4 w-full">
                <h3 className="text-lg font-semibold text-gray-800">Subscription Plan</h3>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">Subscription Type</Label>
                  <Select>
                    <SelectTrigger className="bg-[#E9E9E7] w-full py-6 border-none h-12 rounded-xl text-gray-500 focus:ring-0">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#D4A1AF] border-none text-gray-800">
                      <SelectItem value="basic" className="focus:bg-[#C4919F]">Basic</SelectItem>
                      <SelectItem value="premium" className="focus:bg-[#C4919F]">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">Start Date</Label>
                    <div className="relative">
                      <Input
                        placeholder="12-12-2025"
                        className="bg-[#E9E9E7] border-none h-12 rounded-xl pl-10 focus-visible:ring-0"
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><path d="M3 10h18" /><path d="M8 2v4" /><path d="M16 2v4" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">Expiry Date</Label>
                    <div className="relative">
                      <Input
                        placeholder="12-12-2026"
                        className="bg-[#E9E9E7] border-none h-12 rounded-xl pl-10 pr-10 focus-visible:ring-0"
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><path d="M3 10h18" /><path d="M8 2v4" /><path d="M16 2v4" />
                      </svg>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Admin Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Assign Business Admin Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">Phone Number</Label>
                    <Input
                      placeholder="+1 (555) 000 0000"
                      className="bg-[#E9E9E7] border-none h-12 rounded-xl focus-visible:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-sm">Email Address</Label>
                    <Input
                      placeholder="contact@gmail.com"
                      className="bg-[#E9E9E7] border-none h-12 rounded-xl focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-4 ">
                <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-[#D1EBD9] rounded-xl bg-[#F0F4F1] gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="font-semibold text-gray-800">Activate Business Account</h4>
                    <p className="text-xs text-gray-500">Enable this business profile to start processing transactions within the network.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-[#D45D8A]" defaultChecked />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-[#D45D8A] text-[#D45D8A] hover:bg-[#D45D8A]/10 px-8 py-3 h-auto rounded-xl font-medium order-2 sm:order-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-medium px-8 py-3 h-auto rounded-xl shadow-none order-1 sm:order-2"
                  onClick={handleSaveSalon}
                >
                  Save Salon
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
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl p-2"
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
              Business Admin invite has been sent successfully.
            </h3>

            <div className="w-full space-y-4 mb-10 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Business Name</span>
                <span className="text-gray-500 font-medium">Elegance Beauty Spa</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Admin Number</span>
                <span className="text-gray-500 font-medium">+1 (555) 000 0000</span>
              </div>
            </div>

            <Button
              className="w-48 bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold py-6 text-lg rounded-2xl shadow-none"
              onClick={() => setShowSuccessModal(false)}
            >
              ok
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Warning Modal */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent className="max-w-[400px] p-0 border-none bg-[#E9E9E7] rounded-3xl overflow-hidden">
          <div className="relative p-10 flex flex-col items-center text-center">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl p-2"
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
              Once created, Business Type cannot be changed. Continue?
            </h3>

            <div className="flex gap-4 w-full justify-center">
              <Button
                variant="outline"
                className="w-32 bg-transparent border-[#D45D8A] text-[#D45D8A] hover:bg-[#D45D8A]/10 py-6 rounded-xl font-bold"
                onClick={() => setShowWarningModal(false)}
              >
                No
              </Button>
              <Button
                className="w-32 bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-bold py-6 rounded-xl shadow-none"
                onClick={() => setShowWarningModal(false)}
              >
                Yes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalonsManagement;