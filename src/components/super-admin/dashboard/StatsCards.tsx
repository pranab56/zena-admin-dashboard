import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface StatItem {
  id: number;
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface StatsCardsProps {
  stats: StatItem[];
}

/**
 * Format number:
 * 1200 -> 1.2K
 * 1000 -> 1.0K
 * 999  -> 999
 */
const formatValue = (value: number): string | number => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            className="bg-linear-to-r from-pink-100 to-pink-50 border-0 shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {formatValue(stat.value)}
                  </p>
                </div>

                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Icon className="w-6 h-6 text-pink-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
