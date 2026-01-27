"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Edit2, Image as ImageIcon, MapPin, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

interface OperatingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
    startPeriod: 'AM' | 'PM';
    endPeriod: 'AM' | 'PM';
  };
}

const SalonProfileSetup = () => {
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [salonImage, setSalonImage] = useState<string | null>(null);
  const [operatingHours, setOperatingHours] = useState<OperatingHours>({
    Monday: { enabled: true, start: '9:00', end: '8:00', startPeriod: 'AM', endPeriod: 'PM' },
    Tuesday: { enabled: true, start: '9:00', end: '8:00', startPeriod: 'AM', endPeriod: 'PM' },
    Wednesday: { enabled: true, start: '9:00', end: '8:00', startPeriod: 'AM', endPeriod: 'PM' },
    Thursday: { enabled: true, start: '9:00', end: '8:00', startPeriod: 'AM', endPeriod: 'PM' },
    Friday: { enabled: true, start: '9:00', end: '8:00', startPeriod: 'AM', endPeriod: 'PM' },
    Saturday: { enabled: true, start: '10:00', end: '6:00', startPeriod: 'AM', endPeriod: 'PM' },
    Sunday: { enabled: false, start: '', end: '', startPeriod: 'AM', endPeriod: 'PM' }
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setSalonImage(result);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDay = (day: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        // Reset times if disabling
        start: !prev[day].enabled ? '' : prev[day].start,
        end: !prev[day].enabled ? '' : prev[day].end
      }
    }));
  };

  const updateTime = (day: string, field: keyof OperatingHours[string], value: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const updateTimePeriod = (day: string, field: 'startPeriod' | 'endPeriod', value: 'AM' | 'PM') => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const formatDisplayHours = (day: string) => {
    const hours = operatingHours[day];
    if (!hours.enabled || !hours.start || !hours.end) return 'Closed';
    return `${hours.start} ${hours.startPeriod}-${hours.end} ${hours.endPeriod}`;
  };

  const getWeekdayHours = () => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const firstDayHours = operatingHours['Monday'];

    // Check if all weekdays have same hours
    const allSame = weekdays.every(day =>
      operatingHours[day].start === firstDayHours.start &&
      operatingHours[day].end === firstDayHours.end &&
      operatingHours[day].startPeriod === firstDayHours.startPeriod &&
      operatingHours[day].endPeriod === firstDayHours.endPeriod &&
      operatingHours[day].enabled === firstDayHours.enabled
    );

    if (allSame) {
      return formatDisplayHours('Monday');
    }
    return 'Varies';
  };

  const clearImage = () => {
    setSalonImage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header Section */}
      <div className="px-1">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">Salon Identity & Branding</h1>
        <p className="text-gray-500 text-sm md:text-base mt-2 max-w-2xl font-medium">
          Refine your salon&apos;s digital presence, visual identity, and core operational parameters.
        </p>
      </div>

      <div className="space-y-8 px-1">
        {/* Visual Identity Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EEF8ED] flex items-center justify-center text-[#2F6B43] text-xs font-black">01</div>
            <h3 className="text-lg font-bold text-gray-800">Visual Identity</h3>
          </div>

          <div className="relative group rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-inner h-64 md:h-80 transition-all hover:shadow-lg">
            {salonImage ? (
              <div className="relative w-full h-full isolate">
                <Image src={salonImage} alt="Salon" width={1000} height={1000} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <button
                  onClick={clearImage}
                  className="absolute top-6 right-6 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white p-3 rounded-2xl transition-all shadow-xl z-20"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-6 z-20">
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl">
                    Current Branding Asset
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-[20px] border-emerald-500" />
                  <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full border-[10px] border-pink-500" />
                </div>
                <label className="cursor-pointer flex flex-col items-center gap-6 group/label relative z-10 px-6 text-center">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl group-hover/label:scale-110 transition-transform duration-500">
                    <ImageIcon className="w-8 h-8 text-[#A8D5BA]" />
                  </div>
                  <div className="space-y-2">
                    <span className="block text-gray-900 text-lg font-black leading-tight">Upload Your Salon Masterpiece</span>
                    <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider">Recommended: 1920x1080px (MAX 5MB)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Core Profile Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EEF8ED] flex items-center justify-center text-[#2F6B43] text-xs font-black">02</div>
            <h3 className="text-lg font-bold text-gray-800">Business Profile Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Trade Location</Label>
              <div className="relative group">
                <Input
                  defaultValue="123 Beauty Lane, Beverly Hills"
                  className="bg-white border-gray-100 py-7 px-6 pr-12 rounded-2xl shadow-sm placeholder:text-gray-300 focus:border-[#A8D5BA] focus:ring-0 transition-all font-bold text-gray-700"
                />
                <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#A8D5BA] transition-colors" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand Name</Label>
              <Input
                defaultValue="Bloom Beauty Lounge"
                className="bg-white border-gray-100 py-7 px-6 rounded-2xl shadow-sm placeholder:text-gray-300 focus:border-[#A8D5BA] focus:ring-0 transition-all font-bold text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization Focus</Label>
            <Input
              defaultValue="Luxury hair & skin care"
              className="bg-white border-gray-100 py-7 px-6 rounded-2xl shadow-sm placeholder:text-gray-300 focus:border-[#A8D5BA] focus:ring-0 transition-all font-bold text-gray-700"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand Narrative</Label>
            <Textarea
              defaultValue="Experience luxury and rejuvenation at Bloom & Glow. Our master stylists specialize in contemporary coloring techniques and premium hair care treatments tailored to your unique beauty."
              className="bg-white border-gray-100 p-6 rounded-[2rem] shadow-sm placeholder:text-gray-300 focus:border-[#A8D5BA] focus:ring-0 transition-all font-medium text-gray-700 min-h-[140px] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Operational Intelligence Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EEF8ED] flex items-center justify-center text-[#2F6B43] text-xs font-black">03</div>
            <h3 className="text-lg font-bold text-gray-800">Operational Intelligence</h3>
          </div>

          <Card className="bg-white border-none rounded-[2.5rem] shadow-sm overflow-hidden group">
            <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50 bg-[#F9FAFB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight">Standard Operating Hours</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Live On-Site Display Schedule</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHoursModal(true)}
                className="h-12 w-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-[#D45D8A] hover:bg-pink-50 hover:border-pink-100 transition-all shadow-sm"
              >
                <Edit2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block">Weekdays</span>
                <span className="text-lg font-bold text-gray-700">{getWeekdayHours()}</span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block">Saturdays</span>
                <span className="text-lg font-bold text-gray-700">{formatDisplayHours('Saturday')}</span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block">Sundays</span>
                <span className={`text-lg font-bold ${operatingHours.Sunday.enabled ? "text-gray-700" : "text-red-500 underline underline-offset-8 decoration-dashed decoration-red-200"}`}>
                  {formatDisplayHours('Sunday')}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Global Preservation Action */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
          <Button className="w-full sm:w-auto h-16 bg-[#D45D8A] hover:bg-[#C14C79] text-white font-black px-12 rounded-[1.5rem] shadow-lg shadow-pink-100 transition-all hover:translate-y-[-2px] active:translate-y-0 text-lg">
            Save Brand Changes
          </Button>
        </div>

        {/* Fully Responsive Schedule Configurator */}
        <Dialog open={showHoursModal} onOpenChange={setShowHoursModal}>
          <DialogContent className="max-w-4xl p-0 border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
            <div className="p-10 space-y-10">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Master Schedule Configuration</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Define your precise operational window for each cycle</p>
              </div>

              {/* Responsive Schedule Interface */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Desktop Header Overlay */}
                <div className="hidden sm:grid grid-cols-[160px_1fr_1fr] gap-4 px-6 py-4 bg-gray-50 rounded-2xl mb-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cycle Day</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initialization</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Termination</span>
                </div>

                {Object.keys(operatingHours).map((day) => (
                  <div key={day} className="flex flex-col sm:grid sm:grid-cols-[160px_1fr_1fr] gap-4 items-center p-6 border border-gray-50 rounded-3xl transition-all hover:bg-gray-50/50 hover:border-emerald-100 group">
                    <div className="flex items-center gap-4 w-full">
                      <Checkbox
                        checked={operatingHours[day].enabled}
                        onCheckedChange={() => toggleDay(day)}
                        className="w-6 h-6 rounded-lg data-[state=checked]:bg-[#A8D5BA] data-[state=checked]:border-[#A8D5BA] border-gray-200 transition-all"
                      />
                      <span className={`text-lg font-black transition-colors ${operatingHours[day].enabled ? "text-gray-900" : "text-gray-300"}`}>{day}</span>
                    </div>

                    {/* Time Input Group: Start */}
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={operatingHours[day].start}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateTime(day, 'start', e.target.value)}
                        disabled={!operatingHours[day].enabled}
                        className="bg-white border-gray-100 text-center text-lg font-black h-12 rounded-xl focus:border-[#A8D5BA] shadow-sm disabled:opacity-30 transition-all w-[100px]"
                        placeholder="00:00"
                      />
                      <select
                        value={operatingHours[day].startPeriod}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          updateTimePeriod(day, 'startPeriod', e.target.value as 'AM' | 'PM')
                        }
                        disabled={!operatingHours[day].enabled}
                        className="bg-white border border-gray-100 rounded-xl text-xs font-black h-12 px-4 shadow-sm appearance-none cursor-pointer disabled:opacity-30 hover:bg-gray-50 transition-all uppercase"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>

                    {/* Time Input Group: End */}
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={operatingHours[day].end}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateTime(day, 'end', e.target.value)}
                        disabled={!operatingHours[day].enabled}
                        className="bg-white border-gray-100 text-center text-lg font-black h-12 rounded-xl focus:border-[#A8D5BA] shadow-sm disabled:opacity-30 transition-all w-[100px]"
                        placeholder="00:00"
                      />
                      <select
                        value={operatingHours[day].endPeriod}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          updateTimePeriod(day, 'endPeriod', e.target.value as 'AM' | 'PM')
                        }
                        disabled={!operatingHours[day].enabled}
                        className="bg-white border border-gray-100 rounded-xl text-xs font-black h-12 px-4 shadow-sm appearance-none cursor-pointer disabled:opacity-30 hover:bg-gray-50 transition-all uppercase"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setShowHoursModal(false)}
                  className="w-full sm:w-auto h-16 bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 font-black px-12 rounded-2xl shadow-lg shadow-green-100 transition-all"
                >
                  Synchronize Schedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

  );
};

export default SalonProfileSetup;