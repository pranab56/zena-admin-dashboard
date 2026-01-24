'use client';

import { Input } from '@/components/ui/input';
import { Bell, CheckCircle2, CreditCard, Search } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: number;
  type: 'redemption' | 'visit';
  message: string;
  timestamp: string;
  isRead: boolean;
}

const NotificationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'redemption',
      message: 'New reward redemption request from Sarah Ahmed',
      timestamp: '5 min ago',
      isRead: false,
    },
    {
      id: 2,
      type: 'redemption',
      message: 'New reward redemption request from Sarah Ahmed',
      timestamp: '5 min ago',
      isRead: false,
    },
    {
      id: 3,
      type: 'visit',
      message: 'You have pending customer visits to confirm',
      timestamp: '5 min ago',
      isRead: true,
    },
    {
      id: 4,
      type: 'visit',
      message: 'You have pending customer visits to confirm',
      timestamp: '5 min ago',
      isRead: true,
    },
    {
      id: 5,
      type: 'redemption',
      message: 'New reward redemption request from Sarah Ahmed',
      timestamp: '5 min ago',
      isRead: true,
    },
    {
      id: 6,
      type: 'visit',
      message: 'You have pending customer visits to confirm',
      timestamp: '5 min ago',
      isRead: true,
    },
    {
      id: 7,
      type: 'visit',
      message: 'You have pending customer visits to confirm',
      timestamp: '5 min ago',
      isRead: true,
    },
    {
      id: 8,
      type: 'redemption',
      message: 'New reward redemption request from Sarah Ahmed',
      timestamp: '5 min ago',
      isRead: true,
    },
    {
      id: 9,
      type: 'visit',
      message: 'You have pending customer visits to confirm',
      timestamp: '5 min ago',
      isRead: true,
    },
    {
      id: 10,
      type: 'visit',
      message: 'You have pending customer visits to confirm',
      timestamp: '5 min ago',
      isRead: true,
    },
  ]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ? true :
        activeTab === 'unread' ? !notification.isRead :
          notification.isRead;

    return matchesSearch && matchesTab;
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  const getTabLabel = (tab: 'all' | 'unread' | 'read') => {
    switch (tab) {
      case 'all':
        return `All (${totalCount})`;
      case 'unread':
        return `Unread (${unreadCount})`;
      case 'read':
        return `Read (${readCount})`;
    }
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-7 h-7 text-pink-400 fill-pink-400" />
            <h1 className="text-3xl font-normal text-gray-800">Notifications</h1>
          </div>
          <p className="text-gray-600 text-sm ml-10">
            {totalCount} Notifications
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'all'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {getTabLabel('all')}
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'unread'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {getTabLabel('unread')}
            {activeTab === 'unread' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'read'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {getTabLabel('read')}
            {activeTab === 'read' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-0">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-4"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'redemption'
                  ? 'bg-green-100'
                  : 'bg-green-100'
                  }`}
              >
                {notification.type === 'redemption' ? (
                  <CreditCard className="w-5 h-5 text-green-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-normal">
                  {notification.message}
                </p>
              </div>

              {/* Timestamp and Indicator */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-gray-500 text-sm">
                  {notification.timestamp}
                </span>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;