"use client";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-semibold text-gray-800">Salon Profile Setup</h1>
          </div>
          <p className="text-sm text-gray-600">
            Manage your salon&apos;s basic information and branding details.
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="relative mb-6 h-52 rounded-lg overflow-hidden bg-gray-400">
          {salonImage ? (
            <div className="relative w-full h-full">
              <Image src={salonImage} alt="Salon" width={1000} height={1000} className="w-full h-full object-cover" />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-white text-sm font-medium">Upload the image of your salon</span>
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

        {/* Location and Salon Name */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <Input
                defaultValue="123 Beauty Lane, Beverly Hills"
                className="bg-white border-gray-400 pr-10"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salon Name</label>
            <Input
              defaultValue="Bloom Beauty Lounge"
              className="bg-white border-gray-400"
            />
          </div>
        </div>

        {/* Services */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
          <Input
            defaultValue="Luxury hair & skin care"
            className="bg-white border-gray-400"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <Textarea
            defaultValue="Experience luxury and rejuvenation at Bloom & Glow. Our master stylists specialize in contemporary coloring techniques and premium hair care treatments tailored to your unique beauty."
            className="bg-white border-gray-400 min-h-[100px] resize-none"
          />
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-400">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium text-gray-800">Operating Hours</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHoursModal(true)}
              className="p-1 hover:bg-gray-100"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Monday - Friday</span>
              <span className="text-gray-700">{getWeekdayHours()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Saturday</span>
              <span className="text-gray-700">{formatDisplayHours('Saturday')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Sunday</span>
              <span className={operatingHours.Sunday.enabled ? "text-gray-700" : "text-red-500"}>
                {formatDisplayHours('Sunday')}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8">
            Save all Changes
          </Button>
        </div>

        {/* Operating Hours Modal */}
        <Dialog open={showHoursModal} onOpenChange={setShowHoursModal}>
          <DialogContent className="max-w-xl bg-gray-300 p-0 border-none">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-1">
                    Select suitable day and time for your salon
                  </h2>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-[140px_1fr_1fr] gap-4 mb-4 text-sm text-gray-700 font-medium">
                <div>Day</div>
                <div>Start Time</div>
                <div>End Time</div>
              </div>

              {/* Days List */}
              <div className="space-y-3 mb-6">
                {Object.keys(operatingHours).map((day) => (
                  <div key={day} className="grid grid-cols-[140px_1fr_1fr] gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={operatingHours[day].enabled}
                        onCheckedChange={() => toggleDay(day)}
                        className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={operatingHours[day].start}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateTime(day, 'start', e.target.value)}
                        disabled={!operatingHours[day].enabled}
                        className="bg-white border-gray-400 text-center text-sm h-9"
                        placeholder="__:__"
                      />
                      <select
                        value={operatingHours[day].startPeriod}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          updateTimePeriod(day, 'startPeriod', e.target.value as 'AM' | 'PM')
                        }
                        disabled={!operatingHours[day].enabled}
                        className="bg-white border border-gray-400 rounded text-sm h-9 px-2"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={operatingHours[day].end}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateTime(day, 'end', e.target.value)}
                        disabled={!operatingHours[day].enabled}
                        className="bg-white border-gray-400 text-center text-sm h-9"
                        placeholder="__:__"
                      />
                      <select
                        value={operatingHours[day].endPeriod}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          updateTimePeriod(day, 'endPeriod', e.target.value as 'AM' | 'PM')
                        }
                        disabled={!operatingHours[day].enabled}
                        className="bg-white border border-gray-400 rounded text-sm h-9 px-2"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowHoursModal(false)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-12"
                >
                  Save
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