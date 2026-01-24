"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import CustomerManagement from "../../../components/super-admin/Customers/CustomerManagement";


const formatValue = (value: number): string | number => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

const page = () => {
  const data = [
    {
      id: 1,
      title: "Total Customers",
      value: 43,
      icon: Users,
    },
    {
      id: 2,
      title: "Active Customers",
      value: 8,
      icon: Users,
    },
    {
      id: 3,
      title: "Points Issued Today",
      value: 1200,
      icon: Users,
    },
  ];

  return (
    <div>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((stat) => {
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

        {/* Customer Management Section */}
        <CustomerManagement />
      </div>
    </div>
  );
};

export default page;
