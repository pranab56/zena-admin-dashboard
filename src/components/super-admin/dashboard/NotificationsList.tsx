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
    <Card className="border-0 shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Latest Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = getIconComponent(notification.icon);
            return (
              <div
                key={notification.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-linear-to-r from-green-50 to-transparent hover:from-green-100 transition-colors cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${notification.type === 'redemption' ? 'bg-teal-100' : 'bg-green-100'}`}>
                  <Icon className={`w-5 h-5 ${notification.type === 'redemption' ? 'text-teal-600' : 'text-green-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;