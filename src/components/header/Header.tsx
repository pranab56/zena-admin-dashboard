"use client"

import { Badge, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userName = "Jane Cooper";
  const userRole = "Admin";
  const unreadCount = 1;

  return (
    <header className="w-full border-b bg-white">
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Welcome Back!
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Notification */}
          <div className="relative">
            <button className="relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1.5 text-xs font-semibold bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </button>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 md:gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 md:px-4 hover:bg-gray-50 transition-colors"
            >
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" alt={userName} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                  JC
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-900">{userName}</span>
                <span className="text-xs text-gray-500">{userRole}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-50">
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                  My Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;