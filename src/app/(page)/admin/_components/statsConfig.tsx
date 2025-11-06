import { Store as StoreIcon, Activity, TrendingUp, BarChart3 } from 'lucide-react';
import { StatCardProps } from './StatsCard';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalVisitors: number;
  ordersByStatus?: { status: string; _count: { _all: number } }[];
  totalVisitorsLandingPage?: number;
  totalStores?: number;
  storesToday?: number;
  storesThisMonth?: number;
  growthPercentage?: number;
  totalSales?: number;
  salesToday?: number;
  salesThisWeek?: number;
  salesThisMonth?: number;
  salesGrowthPercentage?: number;
}

export const getStatsConfig = (stats: Stats): StatCardProps[] => [
  {
    title: 'إجمالي المتاجر',
    value: stats.totalStores ?? 0,
    icon: <StoreIcon className="h-6 w-6" />,
    color: 'text-gray-600',
    bgColor: 'bg-white',
  },
  {
    title: 'متاجر جديدة اليوم',
    value: stats.storesToday ?? 0,
    icon: <Activity className="h-6 w-6" />,
    color: 'text-gray-600',
    bgColor: 'bg-white',
  },
  {
    title: 'متاجر هذا الشهر',
    value: stats.storesThisMonth ?? 0,
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'text-gray-600',
    bgColor: 'bg-white',
  },
  {
    title: 'نسبة النمو',
    value: stats.growthPercentage !== undefined ? `${stats.growthPercentage.toFixed(1)}%` : '0%',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    isHighlight: true,
  },
  {
    title: 'الزيارات الكلية للمتاجر عامة',
    value: stats.totalVisitors ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'الزيارات الكلية للمنصة',
    value: stats.totalVisitorsLandingPage ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },

  {
    title: 'مبيعات اليوم',
    value: stats.salesToday ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'مبيعات هذا الأسبوع',
    value: stats.salesThisWeek ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'مبيعات هذا الشهر',
    value: stats.salesThisMonth ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'نسبة نمو المبيعات',
    value:
      stats.salesGrowthPercentage !== undefined
        ? `${stats.salesGrowthPercentage.toFixed(1)}%`
        : '0%',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    isHighlight: true,
  },
];
export const getStatsConfigForPageOne = (stats: Stats): StatCardProps[] => [
  {
    title: 'إجمالي المتاجر',
    value: stats.totalStores ?? 0,
    icon: <StoreIcon className="h-6 w-6 text-black" />,
    color: 'text-gray-600',
    bgColor: 'bg-white',
  },
  {
    title: 'متاجر جديدة اليوم',
    value: stats.storesToday ?? 0,
    icon: <Activity className="h-6 w-6 text-black" />,
    color: 'text-gray-600',
    bgColor: 'bg-white',
  },
  {
    title: 'متاجر هذا الشهر',
    value: stats.storesThisMonth ?? 0,
    icon: <TrendingUp className="h-6 w-6 text-black" />,
    color: 'text-gray-600',
    bgColor: 'bg-white',
  },
  {
    title: 'نسبة النمو',
    value: stats.growthPercentage !== undefined ? `${stats.growthPercentage.toFixed(1)}%` : '0%',
    icon: <BarChart3 className="h-6 w-6 text-white" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    isHighlight: true,
  },
];
export const getStatsConfigSection1 = (stats: Stats): StatCardProps[] => [
  {
    title: 'الزيارات الكلية للمتاجر عامة',
    value: stats.totalVisitors ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'الزيارات الكلية للمنصة',
    value: stats.totalVisitorsLandingPage ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'العائد الكلي للمتاجر',
    value: stats.totalSales ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'مبيعات اليوم',
    value: stats.salesToday ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
];
export const getStatsConfigSection2 = (stats: Stats): StatCardProps[] => [
  {
    title: 'مبيعات هذا الأسبوع',
    value: stats.salesThisWeek ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'مبيعات هذا الشهر',
    value: stats.salesThisMonth ?? 0,
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'نسبة نمو المبيعات',
    value:
      stats.salesGrowthPercentage !== undefined
        ? `${stats.salesGrowthPercentage.toFixed(1)}%`
        : '0%',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    isHighlight: true,
  },
];
