'use client';

import Loading from '@/components/common/Loading';
import { Input } from '@/components/ui/input';
import { useGetAllNotificationQuery, useReadNotificationQuery } from '@/features/notification/notificationApi';
import { useGetMyProfileQuery } from '@/features/profile/profileApi';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle2, CreditCard, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Notification {
  _id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  notificationEvent?: string;
}

const NotificationsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [readingId, setReadingId] = useState<string | null>(null);

  const { data: profileRes, isLoading: isProfileLoading } = useGetMyProfileQuery(undefined);
  const { data: notificationsRes, isLoading: isNotifLoading, refetch } = useGetAllNotificationQuery(undefined);

  // Protect page from Super Admin
  useEffect(() => {
    if (profileRes?.data) {
      const role = profileRes.data.role;
      if (role === 'superadmin' || role === 'SUPER_ADMIN') {
        router.push('/');
      }
    }
  }, [profileRes, router]);

  // This query triggers when readingId is set
  const { } = useReadNotificationQuery(readingId, { skip: !readingId });

  const notifications = useMemo(() => notificationsRes?.data || [], [notificationsRes]);
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;
  const readCount = notifications.filter((n: Notification) => n.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification: Notification) => {
      const matchesSearch = notification.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab =
        activeTab === 'all' ? true :
          activeTab === 'unread' ? !notification.read :
            notification.read;

      return matchesSearch && matchesTab;
    });
  }, [notifications, searchQuery, activeTab]);

  const handleRead = (id: string) => {
    setReadingId(id);
    // Give it a brief moment to process the query, then refresh the list
    setTimeout(() => {
      refetch();
    }, 500);
  };

  const getTabLabel = (tab: 'all' | 'unread' | 'read') => {
    switch (tab) {
      case 'all':
        return `${t('all')} (${totalCount})`;
      case 'unread':
        return `${t('unread')} (${unreadCount})`;
      case 'read':
        return `${t('read')} (${readCount})`;
    }
  };

  if (isProfileLoading || isNotifLoading) return <Loading />;

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-7 h-7 text-pink-400 fill-pink-400" />
            <h1 className="text-3xl font-normal text-gray-800">{t('notifications')}</h1>
          </div>
          <p className="text-gray-600 text-sm ms-10">
            {t('notifications_count', { count: totalCount })}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 h-11 bg-white border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-gray-300">
          {(['all', 'unread', 'read'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {getTabLabel(tab)}
              {activeTab === tab && (
                <div className="absolute bottom-0 start-0 end-0 h-0.5 bg-gray-900" />
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-0">
          {filteredNotifications.map((notification: Notification) => (
            <div
              key={notification._id}
              onClick={() => handleRead(notification._id)}
              className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-4"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notification.notificationEvent === 'PURCHASE_REWARD'
                  ? 'bg-green-100'
                  : 'bg-blue-100'
                  }`}
              >
                {notification.notificationEvent === 'PURCHASE_REWARD' ? (
                  <CreditCard className="w-5 h-5 text-green-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-normal">
                  {notification.body}
                </p>
              </div>

              {/* Timestamp and Indicator */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-gray-500 text-sm text-end">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500">{t('no_notifications_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
