import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Gift } from 'lucide-react';

export interface Notification {
  id: number;
  type: 'redemption' | 'visit';
  message: string;
  time: string;
  icon: string;
}

interface NotificationsListProps {
  notifications: Notification[];
}

const NotificationsList = ({ notifications }: NotificationsListProps) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Gift':
        return Gift;
      case 'Bell':
        return Bell;
      default:
        return Bell;
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden flex flex-col h-full ">
      <CardHeader className="px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-50 bg-[#F9FAFB]/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl tracking-tight">Latest Notifications</CardTitle>

        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-8 py-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getIconComponent(notification.icon);
            return (
              <div
                key={notification.id}
                className="flex items-center gap-5 p-5 rounded-[1.5rem] border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <div className={`p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${notification.type === 'redemption' ? 'bg-[#FFF4CC] text-[#D97706]' : 'bg-[#EEF8ED] text-[#2F6B43]'}`}>
                  <Icon className="w-5 h-5" strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium leading-snug group-hover:text-[#D45D8A] transition-colors line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">{notification.time}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-gray-100 group-hover:bg-[#A8D5BA]" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;