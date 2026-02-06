'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import {
  TrendingUp,
  Calendar,
  Clock,
  Wallet,
  WalletIcon,
  Nfc,
  ArrowDownToLine,
} from 'lucide-react';
import Loader from '@/components/Loader';
import { MdPayments } from 'react-icons/md';
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
import { useStoreProvider } from '../../context/StoreContext';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ProfitData {
  totalProfit: number;
  daily: { day: string; profit: number }[];
  weekly: { week: string; profit: number }[];
  monthly: { month: string; profit: number }[];
  orderPayment: number;
}

export default function ProfitPage() {
  const { data: session } = useSession();
  const { currentStore } = useStoreProvider();

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
        setError('فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);
  const handleWithdraw = async () => {
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/dashboard/profit/withdraw-trader');
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
      setError('Failed to withdraw');
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
  if (!data) return <p className="mt-6 text-center text-neutral-600">No data</p>;

  const commonChartOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#525252' },
    theme: { mode: 'light' as const },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' as const },
    grid: { borderColor: '#e5e5e5', strokeDashArray: 3 },
  };

  const weeklyOptions = {
    ...commonChartOptions,
    chart: { ...commonChartOptions.chart, type: 'area' as const },
    xaxis: { categories: weeklyFiltered.map(w => w.week) },
    stroke: { curve: 'smooth' as const, width: 3 },
    colors: ['#00bcff'],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.15,
      },
    },
  };

  const monthlyOptions = {
    ...commonChartOptions,
    labels: monthlyFiltered.map(m => m.month),
    legend: { position: 'bottom' as const },
    colors: ['#00bcff', '#38bdf8', '#7dd3fc', '#a5f3fc', '#e0f2fe'],
  };

  return (
    <section className="min-h-screen px-4 py-8 md:px-8">
      <div dir="rtl" className="mx-auto max-w-7xl space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex flex-col md:flex-row">
              <div className="">
                <div className="flex items-center gap-2 text-neutral-600">
                  <MdPayments className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    العائد الكلي - من بوابة الدفع الالكتروني
                  </span>
                </div>
                <p className="mt-2 text-3xl font-bold text-neutral-900">
                  {formatCurrency(data.orderPayment)}
                </p>
              </div>
            </div>

            <div>
              <Nfc className="h-14 w-14 text-neutral-700" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-6">
            <div className="">
              <div className="flex items-center gap-2 text-neutral-600">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">العائد الكلي</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {formatCurrency(data.totalProfit)}
              </p>
            </div>
            <div>
              <WalletIcon className="h-14 w-14 text-neutral-700" />
            </div>
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
            <label className="text-sm font-medium text-neutral-700">اختر الأسبوع</label>
            <select
              className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              onChange={e => setSelectedWeek(e.target.value || null)}
              value={selectedWeek || ''}
            >
              <option value="">كل الأسابيع</option>
              {data.weekly.map(w => (
                <option key={w.week} value={w.week}>
                  {w.week}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">اختر الشهر</label>
            <select
              className="h-11 rounded-lg border border-neutral-200 bg-white px-4 text-sm focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              onChange={e => setSelectedMonth(e.target.value || null)}
              value={selectedMonth || ''}
            >
              <option value="">كل الشهور</option>
              {data.monthly.map(m => (
                <option key={m.month} value={m.month}>
                  {m.month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Weekly */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">العائد الأسبوعي</h2>
          <ApexCharts
            type="area"
            series={[{ name: 'Profit', data: weeklyFiltered.map(w => w.profit) }]}
            options={weeklyOptions}
            height={320}
          />
        </div>

        {/* Monthly + Daily */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold">العائد الشهري</h2>
            <ApexCharts
              type="pie"
              series={monthlyFiltered.map(m => m.profit)}
              options={monthlyOptions}
              height={320}
            />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" /> العائد اليومي
            </h2>

            <div className="max-h-[320px] space-y-1 overflow-y-auto">
              {dailyFiltered.length ? (
                dailyFiltered.map(d => (
                  <div
                    key={d.day}
                    className="flex justify-between border-b border-neutral-100 py-3 text-sm"
                  >
                    <span className="text-neutral-700">{d.day}</span>
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
