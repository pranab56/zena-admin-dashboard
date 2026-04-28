"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { baseURL } from '@/utils/BaseURL';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetNotificationCountQuery } from '../../features/notification/notificationApi';
import { useGetMyProfileQuery } from '../../features/profile/profileApi';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: profileRes } = useGetMyProfileQuery({});
  const { data: countRes } = useGetNotificationCountQuery(undefined);
  const userData = profileRes?.data;

  const userName = userData?.name || "User";
  const userRole = userData?.role || t('super_admin');
  const userImage = userData?.image ? `${baseURL}/${userData.image}` : "";
  const unreadCount = countRes?.data || 0;
  const router = useRouter();

  const currentLangCode = i18n.language ? i18n.language.split('-')[0].toUpperCase() : 'EN';


  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang.toLowerCase());
  };


  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };


  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        {/* Left side - Menu toggle for mobile and Welcome text */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer md:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 whitespace-nowrap">
            {t('welcome')}
          </h1>
        </div>

        {/* Right side - Language, Notification and Profile */}
        <div className="flex items-center gap-3 sm:gap-8">
          {/* Language Selector Dropdown */}
          <div className="block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 md:gap-8 px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors outline-none">
                  <span className="hidden md:inline text-[15px] text-gray-600 font-medium">{t('language')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] md:text-[15px] font-bold text-gray-800">{currentLangCode}</span>
                    <ChevronDown size={18} className="text-gray-500" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl p-2 border-gray-200">
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('en')}
                  className={`cursor-pointer rounded-lg font-medium ${i18n.language?.startsWith('en') ? 'bg-green-50 text-green-700' : ''}`}
                >
                  {t('english')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('ar')}
                  className={`cursor-pointer rounded-lg font-medium ${i18n.language?.startsWith('ar') ? 'bg-green-50 text-green-700' : ''}`}
                >
                  {t('arabic')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('bn')}
                  className={`cursor-pointer rounded-lg font-medium ${i18n.language?.startsWith('bn') ? 'bg-green-50 text-green-700' : ''}`}
                >
                  {t('bengali')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Notification Bell - Hidden for Super Admn */}
            {userData?.role !== 'superadmin' && userData?.role !== 'SUPER_ADMIN' && (
              <div className="relative">
                <button onClick={() => router.push("/notifications")} className="relative flex items-center cursor-pointer justify-center transition-colors">
                  <Bell className="h-6 w-6 text-gray-700 fill-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2.5 -end-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 transition-colors text-end"
              >
                {/* User Info */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900 leading-tight">{userName}</span>
                  <span className="text-xs text-gray-500 font-medium">{userRole}</span>
                </div>

                {/* Avatar - Updated to squircle style matching design */}
                <div onClick={() => router.push("/my-profile")} className="h-10 w-10 cursor-pointer sm:h-12 sm:w-12 rounded-2xl overflow-hidden border border-gray-200 bg-[#E8D9C5] p-0.5">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#D8C7B0]">
                    <Avatar className="h-full w-full rounded-none border-none">
                      <AvatarImage src={userImage} alt={userName} className="object-cover" />
                      <AvatarFallback className="bg-transparent text-gray-700 font-bold text-sm sm:text-base">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;