"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userName = "Rasel Parvez";
  const userRole = "Super Admin";
  const unreadCount = 3;
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('EN');

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
            Welcome Back!
          </h1>
        </div>

        {/* Right side - Language, Notification and Profile */}
        <div className="flex items-center gap-3 sm:gap-8">
          {/* Language Selector Dropdown */}
          <div className="block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 md:gap-8 px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors outline-none">
                  <span className="hidden md:inline text-[15px] text-gray-600 font-medium">Language</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] md:text-[15px] font-bold text-gray-800">{currentLang}</span>
                    <ChevronDown size={18} className="text-gray-500" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl p-2 border-gray-200">
                <DropdownMenuItem
                  onClick={() => setCurrentLang('EN')}
                  className={`cursor-pointer rounded-lg font-medium ${currentLang === 'EN' ? 'bg-green-50 text-green-700' : ''}`}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrentLang('AR')}
                  className={`cursor-pointer rounded-lg font-medium ${currentLang === 'AR' ? 'bg-green-50 text-green-700' : ''}`}
                >
                  Arabic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => router.push("/notifications")} className="relative flex items-center cursor-pointer justify-center transition-colors">
                <Bell className="h-6 w-6 text-gray-700 fill-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 transition-colors text-right"
              >
                {/* User Info */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900 leading-tight">{userName}</span>
                  <span className="text-xs text-gray-500 font-medium">{userRole}</span>
                </div>

                {/* Avatar - Updated to squircle style matching design */}
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl overflow-hidden border border-gray-200 bg-[#E8D9C5] p-0.5">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#D8C7B0]">
                    <Avatar className="h-full w-full rounded-none border-none">
                      <AvatarImage src="" alt={userName} className="object-cover" />
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