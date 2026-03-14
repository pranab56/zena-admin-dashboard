"use client";
import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useGetSettingsQuery, useMySettingsMutation } from '@/features/admin/settings/settingsApi';
import { baseURL } from '@/utils/BaseURL';
import { Clock, Edit2, Image as ImageIcon, Loader2, MapPin, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { data: settingsData, isLoading: isFetching } = useGetSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] = useMySettingsMutation();

  const [showHoursModal, setShowHoursModal] = useState(false);
  const [salonImage, setSalonImage] = useState<string | null>(null);
  const [salonImageFile, setSalonImageFile] = useState<File | null>(null);
  const [locationInput, setLocationInput] = useState<string>('');
  const [locationUrl, setLocationUrl] = useState<string>('');
  const [salonName, setSalonName] = useState<string>('');
  const [services, setServices] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [operatingHours, setOperatingHours] = useState<OperatingHours>({
    Monday: { enabled: true, start: '09:00', end: '08:00', startPeriod: 'AM', endPeriod: 'PM' },
    Tuesday: { enabled: true, start: '09:00', end: '08:00', startPeriod: 'AM', endPeriod: 'PM' },
    Wednesday: { enabled: true, start: '09:00', end: '08:00', startPeriod: 'AM', endPeriod: 'PM' },
    Thursday: { enabled: true, start: '09:00', end: '08:00', startPeriod: 'AM', endPeriod: 'PM' },
    Friday: { enabled: true, start: '09:00', end: '08:00', startPeriod: 'AM', endPeriod: 'PM' },
    Saturday: { enabled: true, start: '10:00', end: '06:00', startPeriod: 'AM', endPeriod: 'PM' },
    Sunday: { enabled: false, start: '', end: '', startPeriod: 'AM', endPeriod: 'PM' }
  });

  useEffect(() => {
    if (settingsData?.data) {
      const salon = settingsData.data;
      setSalonName(salon.businessName || '');
      setServices(salon.service || '');
      setDescription(salon.description || '');
      setLocationInput(salon.location || '');

      if (salon.image) {
        if (salon.image.startsWith('http') || salon.image.startsWith('data:')) {
          setSalonImage(salon.image);
        } else {
          // Response image is "/image/...", baseURL has no trailing slash
          const imagePath = salon.image.startsWith('/') ? salon.image : `/${salon.image}`;
          setSalonImage(`${baseURL}${imagePath}`);
        }
      } else {
        setSalonImage(null);
      }

      if (salon.location) {
        setLocationUrl(convertToEmbedUrl(salon.location));
      }

      if (salon.openingTime && Array.isArray(salon.openingTime)) {
        setOperatingHours(prev => {
          const newHours = { ...prev };
          salon.openingTime.forEach((item: { day: string; openingTime?: string; closingTime?: string; isClosed: boolean }) => {
            const dayTitleCase = item.day.charAt(0).toUpperCase() + item.day.slice(1).toLowerCase();
            if (newHours[dayTitleCase]) {
              const [startTime, startPeriod] = (item.openingTime || '09:00 AM').split(' ');
              const [endTime, endPeriod] = (item.closingTime || '08:00 PM').split(' ');

              newHours[dayTitleCase] = {
                enabled: !item.isClosed,
                start: startTime,
                end: endTime,
                startPeriod: (startPeriod as 'AM' | 'PM') || 'AM',
                endPeriod: (endPeriod as 'AM' | 'PM') || 'PM'
              };
            }
          });
          return newHours;
        });
      }
    }
  }, [settingsData]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(t('invalid_image_error'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('image_size_error'));
        return;
      }

      setSalonImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setSalonImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSalonImage(null);
    setSalonImageFile(null);
  };

  const handleSave = async () => {
    try {
      // Ensure specific order: Mon, Tue, Wed, Thu, Fri, Sat, Sun
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      const formattedOpeningTime = dayOrder.map(day => {
        const hours = operatingHours[day];
        return {
          day: day.toUpperCase(),
          openingTime: hours.enabled ? `${hours.start} ${hours.startPeriod}` : "09:00 AM",
          closingTime: hours.enabled ? `${hours.end} ${hours.endPeriod}` : "08:00 PM",
          isClosed: !hours.enabled
        };
      });

      const payload = {
        businessName: salonName,
        service: services,
        location: locationInput,
        description: description,
        openingTime: formattedOpeningTime
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      if (salonImageFile) {
        formData.append('image', salonImageFile);
      }

      const res = await updateSettings(formData).unwrap();
      if (res.success) {
        toast.success(res.message || t('profile_update_success'));
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || t('profile_update_failed'));
    }
  };

  // Convert any Google Maps URL to embed URL
  const convertToEmbedUrl = (url: string): string => {
    if (url.includes('/maps/embed')) {
      return url;
    }

    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
      const shortCode = url.split('/').pop()?.split('?')[0];
      if (shortCode) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
      }
    }

    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      const [, lat, lng] = coordMatch;
      return `https://maps.google.com/maps?q=${lat},${lng}&output=embed&z=15`;
    }

    const placeMatch = url.match(/place\/([^/]+)/);
    if (placeMatch) {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
    }

    const queryMatch = url.match(/[?&]q=([^&]+)/);
    if (queryMatch) {
      const query = decodeURIComponent(queryMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }

    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
  };

  const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setLocationInput(input);

    if (!input.trim()) {
      setLocationUrl('');
      return;
    }

    const trimmedInput = input.trim();

    if (trimmedInput.includes('google.com/maps') || trimmedInput.includes('maps.app.goo.gl') || trimmedInput.includes('goo.gl/maps')) {
      const embedUrl = convertToEmbedUrl(trimmedInput);
      setLocationUrl(embedUrl);
    } else {
      const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(trimmedInput)}&output=embed&z=15`;
      setLocationUrl(embedUrl);
    }
  };

  const toggleDay = (day: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        start: !prev[day].enabled ? '09:00' : prev[day].start,
        end: !prev[day].enabled ? '08:00' : prev[day].end
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
    if (!hours.enabled || !hours.start || !hours.end) return t('closed');
    return `${hours.start} ${hours.startPeriod}-${hours.end} ${hours.endPeriod}`;
  };

  const getWeekdayHours = () => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const firstDayHours = operatingHours['Monday'];

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
    return t('varies');
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-[#2D2D2D] mb-1">{t('salon_profile_setup')}</h1>
            <p className="text-sm text-gray-500 font-normal">
              {t('salon_profile_setup_desc')}
            </p>
          </div>
          {/* <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-[#FFF9F6] px-4 py-2 rounded-2xl border border-[#FFE4D6]">
              <Star className="w-6 h-6 text-[#FFD700] fill-[#FFD700]" />
              <span className="text-2xl font-bold text-[#2D2D2D]">
                {isFetching ? '...' : (settingsData?.data?.rating || '4.8')}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1 font-normal">
              {t('good_experience')}
            </p>
          </div> */}
        </div>

        {/* Image Upload Section */}
        <div className="relative mb-6 h-52 rounded-lg overflow-hidden bg-white">
          {salonImage ? (
            <div className="relative w-full h-full">
              <Image src={salonImage} width={1000} height={1000} alt="Salon" className="w-full h-full object-cover" />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center shadow-lg">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-white text-sm font-bold tracking-tight">{t('upload_salon_image')}</span>
                <span className="text-white/70 text-[10px] uppercase font-black tracking-widest text-center">{t('recommended_image_size')}</span>
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

        {/* Location Map Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('location')}</label>
          <div className="relative h-80 rounded-lg overflow-hidden bg-gray-100 mb-3 border border-gray-300">
            {locationUrl ? (
              <iframe
                src={locationUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{t('enter_location_placeholder')}</p>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Input
              value={locationInput}
              onChange={handleLocationInputChange}
              className="bg-white border-gray-400 pe-10 h-11"
              placeholder={t('location_input_placeholder')}
            />
            <MapPin className="absolute end-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
          </div>
        </div>

        {/* Salon Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('salon_name')}</label>
          <Input
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            className="bg-white border-gray-400 h-11"
            placeholder={t('enter_salon_name_placeholder')}
            disabled={isFetching}
          />
        </div>

        {/* Services */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('services')}</label>
          <Input
            value={services}
            onChange={(e) => setServices(e.target.value)}
            className="bg-white border-gray-400 h-11"
            placeholder={t('enter_services_placeholder')}
            disabled={isFetching}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white border-gray-400 min-h-[100px] resize-none"
            placeholder={t('enter_salon_description_placeholder')}
            disabled={isFetching}
          />
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-400">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium text-gray-800">{t('operating_hours')}</span>
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
              <span className="text-gray-700">{t('monday_friday')}</span>
              <span className="text-gray-700">{getWeekdayHours()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('saturday')}</span>
              <span className="text-gray-700">{formatDisplayHours('Saturday')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('sunday')}</span>
              <span className={`text-sm ${operatingHours.Sunday.enabled ? "text-gray-700" : "text-red-500"}`}>
                {formatDisplayHours('Sunday')}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isUpdating || isFetching}
            className="w-full sm:w-auto bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 px-10 h-12 text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-green-50 transition-all active:scale-95"
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('saving_changes')}
              </span>
            ) : t('save_all_changes')}
          </Button>
        </div>

        {/* Operating Hours Modal */}
        <Dialog open={showHoursModal} onOpenChange={setShowHoursModal}>
          <DialogContent className="max-w-xl w-[95vw] sm:w-full bg-white p-0 border-none rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-1 text-start">
                    {t('select_hours_title')}
                  </h2>
                </div>
              </div>

              {/* Table Header - Hidden on Mobile */}
              {/* Table Header - Hidden on Mobile */}
              <div className="hidden sm:grid grid-cols-[140px_1fr_1fr] gap-4 mb-4 text-sm text-gray-700 font-medium text-start">
                <div>{t('day')}</div>
                <div>{t('start_time')}</div>
                <div>{t('end_time')}</div>
              </div>

              {/* Days List */}
              <div className="space-y-4 sm:space-y-3 mb-6">
                {Object.keys(operatingHours).map((day) => (
                  <div key={day} className="flex flex-col sm:grid sm:grid-cols-[140px_1fr_1fr] gap-3 sm:gap-4 items-start sm:items-center pb-4 sm:pb-0 border-b sm:border-none border-gray-100 last:border-none">
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <Checkbox
                        checked={operatingHours[day].enabled}
                        onCheckedChange={() => toggleDay(day)}
                        className="data-[state=checked]:bg-white data-[state=checked]:border-[#A8D5BA] data-[state=checked]:text-[#2F6B43] h-5 w-5 border-gray-300"
                      />
                      <span className="text-sm font-bold sm:font-normal text-gray-800 sm:text-gray-700">{t(day.toLowerCase())}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full">
                      <div className="flex flex-col sm:hidden">
                        <span className="text-[10px] text-gray-400 uppercase font-bold mb-1 text-start">{t('start')}</span>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <Input
                          value={operatingHours[day].start}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateTime(day, 'start', e.target.value)}
                          disabled={!operatingHours[day].enabled}
                          className="bg-white border-gray-400 text-center text-sm h-10 w-full"
                          placeholder="__:__"
                        />
                        <select
                          value={operatingHours[day].startPeriod}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            updateTimePeriod(day, 'startPeriod', e.target.value as 'AM' | 'PM')
                          }
                          disabled={!operatingHours[day].enabled}
                          className="bg-white border border-gray-400 rounded text-sm h-10 px-2 min-w-[60px]"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full">
                      <div className="flex flex-col sm:hidden">
                        <span className="text-[10px] text-gray-400 uppercase font-bold mb-1 text-start">{t('end')}</span>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <Input
                          value={operatingHours[day].end}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateTime(day, 'end', e.target.value)}
                          disabled={!operatingHours[day].enabled}
                          className="bg-white border-gray-400 text-center text-sm h-10 w-full"
                          placeholder="__:__"
                        />
                        <select
                          value={operatingHours[day].endPeriod}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            updateTimePeriod(day, 'endPeriod', e.target.value as 'AM' | 'PM')
                          }
                          disabled={!operatingHours[day].enabled}
                          className="bg-white border border-gray-400 rounded text-sm h-10 px-2 min-w-[60px]"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setShowHoursModal(false);
                    toast.success(t('hours_updated', { defaultValue: 'Operating hours updated' }));
                  }}
                  className="bg-[#A8D5BA] hover:bg-[#97C4A9] text-gray-800 px-12 font-bold rounded-xl"
                >
                  {t('save')}
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