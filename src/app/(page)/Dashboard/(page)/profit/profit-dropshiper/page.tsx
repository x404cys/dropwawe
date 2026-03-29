'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { ArrowDownToLine, TrendingUp, Wallet } from 'lucide-react';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '../../../context/LanguageContext';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ProfitData {
  totalProfit: number;
  withdrawn: number;
  remaining: number;
  daily: { day: string; profit: number }[];
  weekly: { week: string; profit: number }[];
  monthly: { month: string; profit: number }[];
}

export default function ProfitDropshipperPage() {
  const { t, dir } = useLanguage();
  const pageT = t.dashboardPages.profitDropshipper;
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [data, setData] = useState<ProfitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/dashboard/profit/profit-dropshipper');
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(pageT.loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageT.loadError, userId]);

  const handleWithdraw = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/dashboard/profit/profit-dropshipper/withdraw');
      if (res.data) {
        setData(prev =>
          prev
            ? {
                ...prev,
                totalProfit: res.data.totalProfit,
                remaining: res.data.remaining,
                withdrawn: res.data.withdrawn,
              }
            : prev
        );
      }
    } catch (err) {
      console.error(err);
      setError(pageT.withdrawError);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
    }).format(value);

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

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Loader />
      </div>
    );
  }

  if (error) return <p className="mt-6 text-center text-red-600">{error}</p>;
  if (!data) return <p className="mt-6 text-center text-neutral-600">{pageT.noData}</p>;

  const commonChartOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#525252' },
    theme: { mode: 'light' as const },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' as const },
    grid: { borderColor: '#e5e5e5', strokeDashArray: 3 },
  };

  const monthlyOptions = {
    ...commonChartOptions,
    labels: monthlyFiltered.map(item => item.month),
    legend: { position: 'bottom' as const, fontSize: '13px' },
    colors: ['#00bcff', '#00bcff', '#a3a3a3', '#d4d4d4', '#3b82f6'],
  };

  const weeklyOptions = {
    ...commonChartOptions,
    chart: { ...commonChartOptions.chart, type: 'line' as const },
    xaxis: {
      categories: weeklyFiltered.map(item => item.week),
      labels: { style: { fontSize: '12px' } },
    },
    stroke: { curve: 'smooth' as const, width: 3 },
    markers: { size: 5 },
    colors: ['#00bcff'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      },
    },
  };

  return (
    <section className="min-h-screen px-4 py-8 md:px-8">
      <div dir={dir} className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-card flex flex-col gap-2 rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 text-neutral-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">{pageT.totalProfit}</span>
            </div>
            <p className="text-3xl font-bold text-neutral-900">
              {formatCurrency(data.totalProfit)}
            </p>
          </div>

          <div className="bg-card flex flex-col gap-2 rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 text-neutral-600">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium">{pageT.remaining}</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(data.remaining)}</p>
          </div>

          <div className="bg-card flex w-full flex-col gap-2 rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-2 text-neutral-600">
              <ArrowDownToLine className="h-5 w-5" />
              <span className="text-sm font-medium">{pageT.withdrawn}</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(data.withdrawn)}</p>
          </div>
        </div>

        <div className="bg-card flex flex-col gap-3 rounded-xl border border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
              <ArrowDownToLine className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">{pageT.withdrawTitle}</h3>
              <p className="text-xs text-neutral-500">{pageT.withdrawSubtitle}</p>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Dialog>
            <DialogTrigger dir={dir} asChild>
              <Button size="lg" className="mr-auto w-full cursor-pointer bg-sky-600 md:w-40">
                {pageT.withdrawButton}
              </Button>
            </DialogTrigger>
            <DialogContent dir={dir} className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>{pageT.confirmWithdrawTitle}</DialogTitle>
                <DialogDescription>{pageT.confirmWithdrawDescription}</DialogDescription>
              </DialogHeader>
              {error && <p className="mt-2 text-red-500">{error}</p>}
              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setError(null)}>
                  {t.cancel}
                </Button>
                <Button onClick={handleWithdraw} disabled={loading}>
                  {loading ? pageT.processing : pageT.confirmWithdraw}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">{pageT.selectWeek}</label>
            <select
              className="bg-card h-11 rounded-lg border border-neutral-200 px-4 text-sm text-neutral-900 transition-colors hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 focus:outline-none"
              onChange={event => setSelectedWeek(event.target.value || null)}
              value={selectedWeek || ''}
            >
              <option value="">{pageT.allWeeks}</option>
              {data.weekly.map(item => (
                <option key={item.week} value={item.week}>
                  {item.week}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">{pageT.selectMonth}</label>
            <select
              className="bg-card h-11 rounded-lg border border-neutral-200 px-4 text-sm text-neutral-900 transition-colors hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 focus:outline-none"
              onChange={event => setSelectedMonth(event.target.value || null)}
              value={selectedMonth || ''}
            >
              <option value="">{pageT.allMonths}</option>
              {data.monthly.map(item => (
                <option key={item.month} value={item.month}>
                  {item.month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-neutral-200 p-6">
          <h2 className="mb-6 text-lg font-semibold text-neutral-900">{pageT.weeklyProfit}</h2>
          <ApexCharts
            type="area"
            series={[{ name: pageT.seriesName, data: weeklyFiltered.map(item => item.profit) }]}
            options={weeklyOptions}
            height={320}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-xl border border-neutral-200 p-6">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">{pageT.monthlyProfit}</h2>
            <ApexCharts
              type="pie"
              series={monthlyFiltered.map(item => item.profit)}
              options={monthlyOptions}
              height={320}
            />
          </div>

          <div className="bg-card rounded-xl border border-neutral-200 p-6">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">{pageT.dailyProfit}</h2>
            <div className="max-h-[320px] space-y-1 overflow-y-auto">
              {dailyFiltered.length ? (
                dailyFiltered.map(item => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm last:border-0"
                  >
                    <span className="font-medium text-neutral-700">{item.day}</span>
                    <span className="font-semibold text-sky-900">
                      {formatCurrency(item.profit)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-neutral-500">{pageT.noDailyData}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
