'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useLanguage } from '../../context/LanguageContext';
import { useStoreProvider } from '../../context/StoreContext';
import { AdvancedAnalytics } from './_components/AdvancedAnalytics';
import { CustomersTab } from './_components/CustomersTab';
import { MainTabs } from './_components/MainTabs';
import { OrdersChart } from './_components/OrdersChart';
import { PageHeader } from './_components/PageHeader';
import { RevenueChart } from './_components/RevenueChart';
import { StatsSkeleton } from './_components/StatsSkeleton';
import { SummaryCards } from './_components/SummaryCards';
import { TopProducts } from './_components/TopProducts';
import { StoreBalanceWithdraw } from './_components/WithdrawDialog';
import { StatsResponse } from './types';

type PeriodKey = 'today' | 'week' | 'month' | 'year';

const LOCALE_MAP = {
  ar: 'ar-IQ',
  ku: 'ckb-IQ',
  en: 'en-US',
} as const;

export default function StatsPage() {
  const { lang, dir, t } = useLanguage();
  const { currentStore } = useStoreProvider();
  const [mainTab, setMainTab] = useState<'stats' | 'customers'>('stats');
  const [period, setPeriod] = useState<PeriodKey>('week');

  const fetcher = (url: string) => fetch(url).then(response => response.json());

  const statsUrl = currentStore?.id
    ? `/api/dashboard/stats?storeId=${currentStore.id}${currentStore.subLink ? `&storeSubLink=${currentStore.subLink}` : ''}`
    : null;

  const { data: stats, isLoading } = useSWR<StatsResponse>(statsUrl, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60_000,
  });

  const locale = LOCALE_MAP[lang];
  const availableBalance = stats?.availableBalance ?? 0;
  const customers = stats?.customers ?? [];
  const topProducts = stats?.topProducts ?? [];
  const visitCount = stats?.visitCount ?? 0;
  const uniqueVisitorCount = stats?.uniqueVisitorCount ?? 0;
  const orderCount = stats?.orderCount ?? 0;
  const productCount = stats?.productCount ?? 0;

  const periods = useMemo(
    () => [
      { id: 'today' as const, label: t.stats.today },
      { id: 'week' as const, label: t.stats.thisWeek },
      { id: 'month' as const, label: t.stats.thisMonth },
      { id: 'year' as const, label: t.stats.thisYear },
    ],
    [t.stats.thisMonth, t.stats.thisWeek, t.stats.thisYear, t.stats.today]
  );

  const ordersChartData = useMemo(() => {
    if (!stats?.revenueChart) return [];

    const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });

    return stats.revenueChart.map(item => ({
      day: dayFormatter.format(new Date(item.day)),
      value: item.orders,
      revenue: item.revenue,
    }));
  }, [locale, stats?.revenueChart]);

  const revenueChartData = useMemo(() => {
    if (!stats?.revenueChart) return [];

    const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });

    return stats.revenueChart.map(item => ({
      day: dayFormatter.format(new Date(item.day)),
      value: item.revenue,
    }));
  }, [locale, stats?.revenueChart]);

  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <section dir={dir} className="min-h-screen">
      <main className="flex-1 space-y-4 px-1 py-2 pb-16">
        <PageHeader mainTab={mainTab} customersCount={customers.length} />

        <MainTabs mainTab={mainTab} setMainTab={setMainTab} />

        {mainTab === 'customers' ? (
          <CustomersTab customers={customers} />
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {periods.map(item => (
                <button
                  key={item.id}
                  onClick={() => setPeriod(item.id)}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    period === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <StoreBalanceWithdraw availableBalanceOrder={availableBalance} />

            <SummaryCards
              availableBalance={availableBalance}
              orderCount={orderCount}
              customersCount={customers.length}
              productCount={productCount}
            />

            <RevenueChart data={revenueChartData} />
            <OrdersChart data={ordersChartData} />
            <TopProducts products={topProducts} />

            <AdvancedAnalytics
              orderCount={orderCount}
              visitCount={visitCount}
              uniqueVisitorCount={uniqueVisitorCount}
              governorateData={stats?.governorateData ?? []}
              deviceData={stats?.deviceData ?? []}
              deviceBrands={stats?.deviceBrands ?? []}
              trafficSources={stats?.trafficSources ?? []}
              visitLocations={stats?.visitLocations ?? []}
              visitEntities={stats?.visitEntities ?? []}
            />
          </>
        )}
      </main>
    </section>
  );
}
