"use client";

import { Card } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis } from 'recharts';

const Dashboard = () => {
  // System Activity Data
  const activityData = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 68 },
    { day: 'Wed', value: 52 },
    { day: 'Thus', value: 88 },
    { day: 'Fri', value: 42 },
    { day: 'Sat', value: 35 },
    { day: 'Sun', value: 72 }
  ];

  // Top Performing Businesses
  const topBusinesses = [
    { name: 'Glamour Salon & Spa', points: '2.4kPoints', percentage: 100 },
    { name: 'Skin Pro Clinic', points: '1.84kPoints', percentage: 77 },
    { name: 'Zen Wellness Hub', points: '1.2kPoints', percentage: 50 },
    { name: 'Elite Dental Care', points: '920 Points', percentage: 38 }
  ];

  // Top Performing Services
  const topServices = [
    { name: 'Haircut', percentage: 86 },
    { name: 'Hair Color/ Treatment', percentage: 77 },
    { name: 'Nail Art', percentage: 65 },
    { name: 'Pedicure', percentage: 53 },
    { name: 'Manicure', percentage: 47 }
  ];

  // Recent Activity
  const recentActivity = [
    { id: 1, user: 'Sarah Jenkins', service: 'Free Facial', business: 'Glamour Salon', time: '14 minutesago', activityId: '#B4920' },
    { id: 2, user: 'Sarah Jenkins', service: 'Free Facial', business: 'Glamour Salon', time: '14 minutesago', activityId: '#B4920' },
    { id: 3, user: 'Sarah Jenkins', service: 'Free Facial', business: 'Glamour Salon', time: '14 minutesago', activityId: '#B4920' }
  ];

  return (
    <div className="">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-[#7A7570] text-sm uppercase tracking-wider mb-2">Total Businesses</div>
            <div className="text-3xl font-semibold">124</div>
          </Card>
          <Card className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-[#7A7570] text-sm uppercase tracking-wider mb-2">Total Users</div>
            <div className="text-3xl font-semibold">12,504</div>
          </Card>
          <Card className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-[#7A7570] text-sm uppercase tracking-wider mb-2">Rewards Redeemed</div>
            <div className="text-3xl font-semibold">890</div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* System Activity */}
          <Card className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">System Activity</h2>
              <p className="text-sm text-[#7A7570]">Today vs Last 7 Days Overview</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#7A7570', fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#E07B7B"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Performing Businesses */}
          <Card className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">Top Performing Businesses</h2>
              <p className="text-sm text-[#7A7570]">Based on customer engagement</p>
            </div>
            <div className="space-y-4">
              {topBusinesses.map((business, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#3D3935]">{business.name}</span>
                    <span className="text-sm text-[#7A7570]">{business.points}</span>
                  </div>
                  <div className="w-full bg-[#D4D2CF] rounded-full h-2">
                    <div
                      className="bg-[#8BAA8D] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${business.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <button className="text-sm text-[#E07B7B] hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#C8F0E8] rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4DB8A5" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 11l3 3L22 4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#3D3935]">
                      <span className="font-medium">{activity.user}</span> redeemed '{activity.service}' at {activity.business}.
                    </p>
                    <p className="text-xs text-[#7A7570] mt-1">
                      {activity.time} · Activity ID: {activity.activityId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing Service */}
          <Card className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">Top Performing Service</h2>
              <p className="text-sm text-[#7A7570]">Based on customer engagement</p>
            </div>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#3D3935]">{service.name}</span>
                    <span className="text-sm text-[#7A7570]">{service.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#D4D2CF] rounded-full h-2">
                    <div
                      className="bg-[#CC9999] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;