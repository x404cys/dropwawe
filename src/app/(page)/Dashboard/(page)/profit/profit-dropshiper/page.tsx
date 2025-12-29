'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { TrendingUp, Wallet, ArrowDownToLine } from 'lucide-react';
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

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ProfitData {
  totalProfit: number;
  withdrawn: number;
  remaining: number;
  daily: { day: string; profit: number }[];
  weekly: { week: string; profit: number }[];
  monthly: { month: string; profit: number }[];
}

export default function ProfitPage() {
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
        const res = await axios.get(`/api/dashboard/profit/profit-dropshipper`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('فشل تحميل البيانات / Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  const handleWithdraw = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/dashboard/profit/profit-dropshipper/withdraw');
      if (res.data) {
        setData((prev: any) =>
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
      setError('فشل سحب الأرباح / Failed to withdraw');
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
    return selectedMonth ? data.daily.filter(d => d.day.startsWith(selectedMonth)) : data.daily;
  }, [data, selectedMonth]);

  const weeklyFiltered = useMemo(() => {
    if (!data) return [];
    return selectedWeek ? data.weekly.filter(w => w.week === selectedWeek) : data.weekly;
  }, [data, selectedWeek]);

  const monthlyFiltered = useMemo(() => data?.monthly ?? [], [data]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Loader />
      </div>
    );
  if (error) return <p className="mt-6 text-center text-red-600">{error}</p>;
  if (!data) return <p className="mt-6 text-center text-neutral-600">No data available</p>;

  const commonChartOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#525252' },
    theme: { mode: 'light' as const },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' as const },
    grid: { borderColor: '#e5e5e5', strokeDashArray: 3 },
  };

  const monthlyOptions = {
    ...commonChartOptions,
    labels: monthlyFiltered.map(m => m.month),
    legend: { position: 'bottom' as const, fontSize: '13px' },
    colors: ['#00bcff', '#00bcff', '#a3a3a3', '#d4d4d4', '#3b82f6'],
  };
  const monthlySeries = monthlyFiltered.map(m => m.profit);

  const weeklyOptions = {
    ...commonChartOptions,
    chart: { ...commonChartOptions.chart, type: 'line' as const },
    xaxis: { categories: weeklyFiltered.map(w => w.week), labels: { style: { fontSize: '12px' } } },
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
  const weeklySeries = [{ name: 'Profit', data: weeklyFiltered.map(w => w.profit) }];

  return (
    <section className="min-h-screen bg-neutral-50 px-4 py-8 md:px-8">
      <div dir="rtl" className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-2 text-neutral-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">الربح الكلي </span>
            </div>
            <p className="text-3xl font-bold text-neutral-900">
              {formatCurrency(data.totalProfit)}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-2 text-neutral-600">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium">المتبقي</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(data.remaining)}</p>
          </div>

          <div className="flex w-full flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-2 text-neutral-600">
              <ArrowDownToLine className="h-5 w-5" />
              <span className="text-sm font-medium">المسحوب</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(data.withdrawn)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
              <ArrowDownToLine className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">سحب الأرباح</h3>
              <p className="text-xs text-neutral-500">اعلام المنصة بسحب ارباحك</p>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Dialog>
            <DialogTrigger dir="rtl" asChild>
              <Button size="lg" className="mr-auto w-full cursor-pointer bg-sky-600 md:w-40">
                سحب الأرباح
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl" className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>تأكيد السحب</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد أنك تريد سحب الأرباح؟ سيتم تحديث الرصيد المتبقي والمسحوب بعد العملية.
                </DialogDescription>
              </DialogHeader>
              {error && <p className="mt-2 text-red-500">{error}</p>}
              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setError(null)}>
                  إلغاء
                </Button>
                <Button onClick={handleWithdraw} disabled={loading}>
                  {loading ? 'Processing...' : 'تأكيد السحب '}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              اختر الأسبوع | Select Week
            </label>
            <select
              className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900 transition-colors hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 focus:outline-none"
              onChange={e => setSelectedWeek(e.target.value || null)}
              value={selectedWeek || ''}
            >
              <option value="">كل الأسابيع | All Weeks</option>
              {data.weekly.map(w => (
                <option key={w.week} value={w.week}>
                  {w.week}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              اختر الشهر | Select Month
            </label>
            <select
              className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900 transition-colors hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 focus:outline-none"
              onChange={e => setSelectedMonth(e.target.value || null)}
              value={selectedMonth || ''}
            >
              <option value="">كل الشهور | All Months</option>
              {data.monthly.map(m => (
                <option key={m.month} value={m.month}>
                  {m.month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-neutral-900">
            العائد الأسبوعي | Weekly Profit
          </h2>
          <ApexCharts type="area" series={weeklySeries} options={weeklyOptions} height={320} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">
              العائد الشهري | Monthly Profit
            </h2>
            <ApexCharts type="pie" series={monthlySeries} options={monthlyOptions} height={320} />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">
              العائد اليومي | Daily Profit
            </h2>
            <div className="max-h-[320px] space-y-1 overflow-y-auto">
              {dailyFiltered.length ? (
                dailyFiltered.map(d => (
                  <div
                    key={d.day}
                    className="flex items-center justify-between border-b border-neutral-100 py-3 text-sm last:border-0"
                  >
                    <span className="font-medium text-neutral-700">{d.day}</span>
                    <span className="font-semibold text-sky-900">{formatCurrency(d.profit)}</span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-neutral-500">No daily data</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
