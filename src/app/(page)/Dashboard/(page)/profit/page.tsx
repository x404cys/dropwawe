'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { ArrowDownToLine, Clock, Nfc, TrendingUp, WalletIcon } from 'lucide-react';
import { MdPayments } from 'react-icons/md';
import { useStoreProvider } from '../../context/StoreContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ProfitData {
  totalProfit: number;
  daily: { day: string; profit: number }[];
  weekly: { week: string; profit: number }[];
  monthly: { month: string; profit: number }[];
  orderPayment: number;
}

export default function ProfitPage() {
  const { currentStore } = useStoreProvider();
  const { t, dir } = useLanguage();
  const pageT = t.dashboardPages.profitOverview;
  const router = useRouter();
  const storeId = currentStore?.id;

  const [data, setData] = useState<ProfitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/orders/getall?storeId=${storeId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(pageT.loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageT.loadError, storeId]);

  const handleWithdraw = async () => {
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/dashboard/profit/withdraw-trader');
      if (res.data) {
        setData(prev =>
          prev
            ? {
                ...prev,
                totalProfit: res.data.totalProfit,
              }
            : prev
        );
      }
      router.push('/Dashboard/profit/payment-order');
    } catch (err) {
      console.error(err);
      setError(pageT.withdrawError);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
    }).format(num);

  const dailyFiltered = useMemo(() => {
    if (!data) return [];
    return selectedMonth
      ? data.daily.filter(item => item.day.startsWith(selectedMonth))
      : data.daily;
  }, [data, selectedMonth]);

  const weeklyFiltered = useMemo(() => {
    if (!data) return [];
    return selectedWeek ? data.weekly.filter(item => item.week === selectedWeek) : data.weekly;
  }, [data, selectedWeek]);

  const monthlyFiltered = useMemo(() => data?.monthly ?? [], [data]);

  if (!data && !loading) {
    return <p className="text-muted-foreground mt-6 text-center">{pageT.noData}</p>;
  }

  const commonChartOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#888' },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
    grid: { borderColor: 'hsl(var(--border))', strokeDashArray: 4 },
  };

  const weeklyOptions = {
    ...commonChartOptions,
    chart: { ...commonChartOptions.chart, type: 'area' as const },
    xaxis: { categories: weeklyFiltered.map(item => item.week) },
    stroke: { curve: 'smooth' as const, width: 2.5 },
    colors: ['hsl(var(--primary))'],
    fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.05 } },
  };

  const monthlyOptions = {
    ...commonChartOptions,
    labels: monthlyFiltered.map(item => item.month),
    legend: { position: 'bottom' as const },
    colors: ['hsl(var(--primary))', '#38bdf8', '#7dd3fc', '#a5f3fc', '#e0f2fe'],
  };

  if (loading && !data) {
    return <p className="text-muted-foreground mt-6 text-center">{t.loading}</p>;
  }

  return (
    <section className="bg-background min-h-screen px-4 py-6 md:px-8">
      <div dir={dir} className="mx-auto max-w-7xl space-y-5">
        <div>
          <h1 className="text-foreground text-xl font-bold">{pageT.title}</h1>
          <p className="text-muted-foreground text-sm">{pageT.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border-border bg-card flex items-center justify-between rounded-2xl border p-5 shadow-sm">
            <div>
              <div className="text-muted-foreground mb-1 flex items-center gap-2">
                <MdPayments className="h-4 w-4" />
                <span className="text-xs font-medium">{pageT.gatewayRevenue}</span>
              </div>
              <p className="text-foreground text-2xl font-bold">
                {formatCurrency(data?.orderPayment ?? 0)}
              </p>
            </div>
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <Nfc className="text-primary h-6 w-6" />
            </div>
          </div>

          <div className="border-border bg-card flex items-center justify-between rounded-2xl border p-5 shadow-sm">
            <div>
              <div className="text-muted-foreground mb-1 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">{pageT.totalRevenue}</span>
              </div>
              <p className="text-foreground text-2xl font-bold">
                {formatCurrency(data?.totalProfit ?? 0)}
              </p>
            </div>
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <WalletIcon className="text-primary h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <ArrowDownToLine className="text-muted-foreground h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-semibold">{pageT.withdrawTitle}</h3>
              <p className="text-muted-foreground text-xs">{pageT.withdrawSubtitle}</p>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleWithdraw}
            className="bg-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pageT.withdrawButton}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">{pageT.selectWeek}</label>
            <select
              className="border-border bg-card text-foreground focus:border-primary focus:ring-primary/20 h-10 rounded-xl border px-3 text-sm focus:ring-2 focus:outline-none"
              onChange={event => setSelectedWeek(event.target.value || null)}
              value={selectedWeek || ''}
            >
              <option value="">{pageT.allWeeks}</option>
              {data?.weekly.map(item => (
                <option key={item.week} value={item.week}>
                  {item.week}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">{pageT.selectMonth}</label>
            <select
              className="border-border bg-card text-foreground focus:border-primary focus:ring-primary/20 h-10 rounded-xl border px-3 text-sm focus:ring-2 focus:outline-none"
              onChange={event => setSelectedMonth(event.target.value || null)}
              value={selectedMonth || ''}
            >
              <option value="">{pageT.allMonths}</option>
              {data?.monthly.map(item => (
                <option key={item.month} value={item.month}>
                  {item.month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
          <h2 className="text-foreground mb-4 text-base font-semibold">{pageT.weeklyRevenue}</h2>
          <ApexCharts
            type="area"
            series={[{ name: pageT.seriesName, data: weeklyFiltered.map(item => item.profit) }]}
            options={weeklyOptions}
            height={300}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
            <h2 className="text-foreground mb-4 text-base font-semibold">{pageT.monthlyRevenue}</h2>
            <ApexCharts
              type="pie"
              series={monthlyFiltered.map(item => item.profit)}
              options={monthlyOptions}
              height={300}
            />
          </div>

          <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
            <h2 className="text-foreground mb-4 flex items-center gap-2 text-base font-semibold">
              <Clock className="h-4 w-4" /> {pageT.dailyRevenue}
            </h2>
            <div className="max-h-[300px] space-y-0.5 overflow-y-auto">
              {dailyFiltered.length ? (
                dailyFiltered.map(item => (
                  <div
                    key={item.day}
                    className="border-border/50 flex justify-between border-b py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{item.day}</span>
                    <span className="text-primary font-semibold">
                      {formatCurrency(item.profit)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  {pageT.noDailyData}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
