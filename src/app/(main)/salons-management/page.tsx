"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Eye,
  Filter,
  Search,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

interface Salon {
  id: number;
  name: string;
  regNo: string;
  status: 'Active' | 'Inactive';
  city: string;
  type: 'Salon' | 'Spa';
}

interface FormData {
  businessName: string;
  businessType: string;
  city: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
}

interface SuccessData {
  name: string;
  phone: string;
}

const SalonManagement = () => {
  const [salons, setSalons] = useState<Salon[]>([
    { id: 1, name: 'Elite Hair & Spa', regNo: 'EJ-11LR-9502', status: 'Active', city: 'Dubai', type: 'Salon' },
    { id: 2, name: 'Glamour Studio', regNo: 'EJ-22LR-8401', status: 'Inactive', city: 'Abu Dhabi', type: 'Spa' },
    { id: 3, name: 'Royal Beauty Center', regNo: 'EJ-33LR-7302', status: 'Active', city: 'Sharjah', type: 'Salon' },
    { id: 4, name: 'Elegance Beauty Spa', regNo: 'EJ-44LR-6203', status: 'Active', city: 'Dubai', type: 'Spa' },
    { id: 5, name: 'Modern Hair Studio', regNo: 'EJ-55LR-5104', status: 'Active', city: 'Ajman', type: 'Salon' },
    { id: 6, name: 'Luxury Spa House', regNo: 'EJ-66LR-4005', status: 'Inactive', city: 'Dubai', type: 'Spa' },
    { id: 7, name: 'Classic Hair & Beauty', regNo: 'EJ-77LR-3906', status: 'Active', city: 'Fujairah', type: 'Salon' },
    { id: 8, name: 'Prestige Salon', regNo: 'EJ-88LR-2807', status: 'Active', city: 'Dubai', type: 'Salon' },
    { id: 9, name: 'Serenity Spa', regNo: 'EJ-99LR-1708', status: 'Inactive', city: 'Ras Al Khaimah', type: 'Spa' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const router = useRouter();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    city: '',
    phoneNumber: '',
    email: '',
    isActive: true
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData>({ name: '', phone: '' });

  const toggleStatus = (id: number) => {
    setSalons(salons.map(salon =>
      salon.id === id
        ? { ...salon, status: salon.status === 'Active' ? 'Inactive' : 'Active' }
        : salon
    ));
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleOpenModal = () => {
    setShowAddModal(true);
    setFormData({
      businessName: '',
      businessType: '',
      city: '',
      phoneNumber: '',
      email: '',
      isActive: true
    });
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    if (hasChanges) {
      setShowWarningModal(true);
    } else {
      setShowAddModal(false);
    }
  };

  const handleConfirmClose = () => {
    setShowWarningModal(false);
    setShowAddModal(false);
    setHasChanges(false);
  };

  const handleSaveSalon = () => {
    const newSalon: Salon = {
      id: salons.length + 1,
      name: formData.businessName,
      regNo: `EJ-${Math.floor(Math.random() * 99)}LR-${Math.floor(Math.random() * 9999)}`,
      status: formData.isActive ? 'Active' : 'Inactive',
      city: formData.city,
      type: formData.businessType as 'Salon' | 'Spa'
    };

    setSalons([...salons, newSalon]);
    setSuccessData({ name: formData.businessName, phone: formData.phoneNumber });
    setShowAddModal(false);
    setShowSuccessModal(true);
    setHasChanges(false);
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  // Filter salons based on search and status
  const filteredSalons = salons.filter(salon => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.regNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || salon.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeSalons = salons.filter(s => s.status === 'Active').length;
  const inactiveSalons = salons.filter(s => s.status === 'Inactive').length;

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">Salons Management</h1>
              <p className="text-sm text-muted-foreground">
                Oversee partner business performance, status, and Network settings across the network
              </p>
            </div>
            <Button
              onClick={handleOpenModal}
              className="bg-[#8BAA8D] hover:bg-[#7a9980] text-white"
            >
              Create New Salon
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card >
            <CardContent className="p-5">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Active Salons
              </div>
              <div className="text-2xl font-semibold">{activeSalons}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Ecosystem Customers
              </div>
              <div className="text-2xl font-semibold">12,400</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                Inactive Salons
              </div>
              <div className="text-2xl font-semibold">{inactiveSalons}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <div className="w-10/12 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by salon name, city ..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-5"
            />
          </div>
          <div className='w-2/12'>
            <div className="w-full md:w-auto relative h-full">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={20} />
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full h-10 py-5  pl-12 rounded-lg cursor-pointer">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className=' cursor-pointer'>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Card className='p-0'>
          <Table>
            <TableHeader className='p-3'>
              <TableRow className='p-2'>
                <TableHead>Business Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No salons found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredSalons.map((salon) => (
                  <TableRow key={salon.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium text-foreground">{salon.name}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{salon.regNo}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={salon.status === 'Active'}
                          onCheckedChange={() => toggleStatus(salon.id)}
                          className="data-[state=checked]:bg-[#D4A5C8]"
                        />
                        <Badge
                          variant={salon.status === 'Active' ? 'default' : 'secondary'}
                          className={salon.status === 'Active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                          }
                        >
                          {salon.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{salon.city}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-foreground">
                        {salon.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => router.push("/salons-management/view")} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Footer Pagination */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button size="sm" className="bg-[#8BAA8D] hover:bg-[#7a9980] text-white">
            1
          </Button>
        </div>
      </div>

      {/* Add New Salon Modal */}
      <Dialog open={showAddModal} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="max-w-xl bg-background">
          <DialogHeader>
            <DialogTitle>Add New Salon</DialogTitle>
            <DialogDescription>
              Register a new salon or clinic into the loyalty network.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Eg. Elegance Beauty Spa"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange('businessType', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salon">Salon</SelectItem>
                    <SelectItem value="Spa">Spa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City / Location</Label>
              <Input
                id="city"
                placeholder="Al Qouz Fourth,Dubai,UAE"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-base font-semibold mb-3">Assign Business Admin Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1 (555) 000 0000"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-base font-semibold mb-3">Account Status</h3>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-medium">Activate Business Account</div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    Cannot process loyalty points or cashback merchant debit card
                  </div>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  className="data-[state=checked]:bg-[#D4A5C8]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="border-[#D4A5C8] text-[#D4A5C8] hover:bg-[#D4A5C8]/10">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSaveSalon}
              className="bg-[#8BAA8D] hover:bg-[#7a9980] text-white"
            >
              Save Salon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#8BAA8D] rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center">Success!</DialogTitle>
            <DialogDescription className="text-center">
              Business Admin invite has been sent successfully.
            </DialogDescription>
          </DialogHeader>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Business Name</span>
                  <span className="font-medium text-foreground">{successData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admin Number</span>
                  <span className="font-medium text-foreground">{successData.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#8BAA8D] hover:bg-[#7a9980] text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warning Modal */}
      <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#D4A5C8] rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You have unsaved changes. Are you sure you want to cancel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel onClick={() => setShowWarningModal(false)}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-[#D4A5C8] hover:bg-[#c394b7] text-white"
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SalonManagement;