import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';

interface StatItem {
  id: number;
  title: string;
  value: number;
  bgClass: string;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            className={`${stat.bgClass} border-none shadow-sm rounded-[2rem] overflow-hidden transition-all `}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-black text-gray-900 group-hover:scale-105 transition-transform origin-left">
                    {formatValue(stat.value)}
                  </p>
                </div>

                <div className="bg-white/50 p-3 rounded-2xl shadow-sm border border-white/50 group-hover:rotate-12 transition-transform">
                  <Image src={"/logo/cardUser.png"} alt="icon" width={32} height={32} className='w-full h-full' />
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
