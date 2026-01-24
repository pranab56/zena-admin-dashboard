"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userName = "John Doe";
  const userRole = "Admin";
  const unreadCount = 3;
  const router = useRouter();

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="flex h-20 items-center justify-end px-8">
        {/* Right side - Notification and Profile */}
        <div className="flex items-center gap-6">
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
              className="flex items-center gap-3 transition-colors"
            >
              {/* User Info */}
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{userName}</span>
                <span className="text-xs text-gray-500">{userRole}</span>
              </div>

              {/* Avatar */}
              <Avatar className="h-12 w-12 border-2 border-gray-300">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-white text-gray-700 font-medium text-base">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>

              {/* Dropdown Arrow */}

            </button>


          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;