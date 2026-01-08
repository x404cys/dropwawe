'use client';

import type { StoreProps } from '@/types/store/StoreType';
import useSWR from 'swr';
import StoresList from '../../_components/StoresList';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type StatsProps = {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalStoreActived: number;
  totalStores: number;
};

type APIResponse = {
  stores: StoreProps[];
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalStoreActived: number;
  totalStores: number;
};

export default function Stores() {
  const { data, error, isLoading } = useSWR<APIResponse>(
    '/api/admin/overview/stats/stores',
    fetcher
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-muted h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-muted h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  /*  if (error) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-6 text-center">
          <p className="text-destructive font-medium">خطأ في تحميل البيانات</p>
          <p className="text-muted-foreground mt-2 text-sm">يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    );
  } */

  if (!data) {
    return (
      <div className="p-8">
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5 p-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <StatCard label="اليوم" value={data?.todayCount} trend="up" />
        <StatCard label="هذا الأسبوع" value={data?.weekCount} trend="up" />
        <StatCard label="هذا الشهر" value={data?.monthCount} trend="neutral" />
        <StatCard label="إجمالي المتاجر" value={data?.totalStores} trend="neutral" />
        <StatCard label="المتاجر المفعلة" value={data?.totalStoreActived} trend="neutral" />
      </div>

      <StoresList stores={data?.stores} />
    </section>
  );
}

function StatCard({
  label,
  value,
  trend = 'neutral',
}: {
  label: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className="bg-card group rounded-lg border p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors">
            {label}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>

        {trend !== 'neutral' && (
          <div className={`text-xs font-medium ${trendColors[trend]}`}>
            {trend === 'up' ? '↗' : '↘'}
          </div>
        )}
      </div>
    </div>
  );
}
