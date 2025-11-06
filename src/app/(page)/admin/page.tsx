'use client';

import { JSX } from 'react';

import WeeklyGrowthChart from './_components/WeeklyGrowthChart';
import useSWR from 'swr';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import StatsCardDashboard from './_components/StatsCard';
import { DollarSign, Package2, Store, Users } from 'lucide-react';

export interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalVisitors: number;
  ordersByStatus?: { status: string; _count: { _all: number } }[];
  totalVisitorsLandingPage?: number;
  totalStores?: number;
  storesToday?: number;
  storesThisMonth?: number;
  weeklyStores?: number[];
  growthPercentage?: number;
  totalSales: number;
}

export default function AdminDashboard(): JSX.Element {
  const fetcher = (url: string) => fetch(url).then(res => res.json());

  const { data, isLoading } = useSWR<Stats>('/api/admin/overview/stats', fetcher);

  interface Stat {
    title: string;
    value?: number | string;
    icon: JSX.Element;
    color: string;
    isHighlight?: boolean;
  }

  const stats: Stat[] = [
    {
      title: 'المستخدمين',
      value: data?.totalUsers ?? 0,
      icon: <Users />,
      color: 'text-blue-500',
      isHighlight: true,
    },
    {
      title: 'المتاجر',
      value: data?.totalStores ?? 0,
      icon: <Store />,
      color: 'text-green-500',
    },
    {
      title: 'المنتجات',
      value: data?.totalProducts ?? 0,
      icon: <Package2 />,
      color: 'text-purple-500',
    },
    {
      title: 'المبيعات',
      value: data ? formatIQD(data.totalSales) : '0',
      icon: <DollarSign />,
      color: 'text-purple-500',
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen w-full px-2">
      <main className="flex-1 bg-white py-2">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCardDashboard stat={stat} index={index} key={index} />
          ))}
        </div>

        <div className="mt-4 mb-4"></div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
          <WeeklyGrowthChart />
        </div>
      </main>
    </div>
  );
}
