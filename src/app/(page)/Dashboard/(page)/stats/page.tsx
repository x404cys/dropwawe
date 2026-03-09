'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { useLanguage } from '../../context/LanguageContext';
import { useStoreProvider } from '../../context/StoreContext';
import { StatsResponse } from './types';

import { StatsSkeleton } from './_components/StatsSkeleton';
import { PageHeader } from './_components/PageHeader';
import { MainTabs } from './_components/MainTabs';
import { CustomersTab } from './_components/CustomersTab';
import { WithdrawDialog } from './_components/WithdrawDialog';
import { SummaryCards } from './_components/SummaryCards';
import { RevenueChart } from './_components/RevenueChart';
import { OrdersChart } from './_components/OrdersChart';
import { TopProducts } from './_components/TopProducts';
import { AdvancedAnalytics } from './_components/AdvancedAnalytics';

const PERIODS = ['اليوم', 'هذا الأسبوع', 'هذا الشهر', 'هذه السنة'];

export default function StatsPage() {
  const { lang, t } = useLanguage();
  const { currentStore } = useStoreProvider();
  const { data: session } = useSession();

  const [mainTab, setMainTab] = useState<'stats' | 'customers'>('stats');
  const [period, setPeriod] = useState('هذا الأسبوع');

  const fetcher = (url: string) => fetch(url).then(r => r.json());

  const statsUrl = currentStore?.id
    ? `/api/dashboard/stats?storeId=${currentStore.id}${currentStore.subLink ? `&storeSubLink=${currentStore.subLink}` : ''}`
    : null;

  const { data: stats, isLoading } = useSWR<StatsResponse>(statsUrl, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60_000,   
  });

  const availableBalance = stats?.availableBalance ?? 0;
  const customers = stats?.customers ?? [];
  const topProducts = stats?.topProducts ?? [];
  const visitCount = stats?.visitCount ?? 0;
  const orderCount = stats?.orderCount ?? 0;
  const productCount = stats?.productCount ?? 0;

  const daysShortAr = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
  const daysShortEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const ordersChartData = useMemo(() => {
    if (!stats?.revenueChart) return [];
    return stats.revenueChart.map(item => {
      const d = new Date(item.day);
      const label = lang === 'en' ? daysShortEn[d.getDay()] : daysShortAr[d.getDay()];
      return { day: label, value: item.orders, revenue: item.revenue };
    });
  }, [stats?.revenueChart, lang]);

  const revenueChartData = useMemo(() => {
    if (!stats?.revenueChart) return [];
    return stats.revenueChart.map(item => {
      const d = new Date(item.day);
      const label = lang === 'en' ? daysShortEn[d.getDay()] : daysShortAr[d.getDay()];
      return { day: label, value: item.revenue };
    });
  }, [stats?.revenueChart, lang]);

  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <section dir="rtl" className="min-h-screen">
      <main className="flex-1 space-y-4 px-1 py-2 pb-16">
        <PageHeader mainTab={mainTab} customersCount={customers.length} />

        <MainTabs mainTab={mainTab} setMainTab={setMainTab} />

        {mainTab === 'customers' ? (
          <CustomersTab customers={customers} />
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    period === p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="bg-card border-border flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-muted-foreground text-[11px]">الرصيد المتاح للسحب</p>
                <p className="text-foreground text-lg font-bold">
                  {availableBalance.toLocaleString('ar-IQ')}
                  <span className="text-muted-foreground mr-1 text-[10px]">{t.currency}</span>
                </p>
              </div>
              <WithdrawDialog availableBalance={availableBalance} />
            </div>

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
              governorateData={stats?.governorateData ?? []}
              deviceData={stats?.deviceData ?? []}
              deviceBrands={stats?.deviceBrands ?? []}
              trafficSources={stats?.trafficSources ?? []}
            />
          </>
        )}
      </main>
    </section>
  );
}
