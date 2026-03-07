'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import {
  TrendingUp,
  Clock,
  WalletIcon,
  Nfc,
  ArrowDownToLine,
} from 'lucide-react';
import { MdPayments } from 'react-icons/md';
import { useStoreProvider } from '../../context/StoreContext';
import { useRouter } from 'next/navigation';

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
          prev ? { ...prev, totalProfit: res.data.totalProfit, remaining: res.data.remaining, withdrawn: res.data.withdrawn } : prev
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
    new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(num);

  const dailyFiltered = useMemo(() => {
    if (!data) return [];
    return selectedMonth ? data.daily.filter(d => d.day.startsWith(selectedMonth)) : data.daily;
  }, [data, selectedMonth]);

  const weeklyFiltered = useMemo(() => {
    if (!data) return [];
    return selectedWeek ? data.weekly.filter(w => w.week === selectedWeek) : data.weekly;
  }, [data, selectedWeek]);

  const monthlyFiltered = useMemo(() => data?.monthly ?? [], [data]);

  if (!data) return <p className="mt-6 text-center text-muted-foreground">لا توجد بيانات</p>;

  const commonChartOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#888' },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
    grid: { borderColor: 'hsl(var(--border))', strokeDashArray: 4 },
  };

  const weeklyOptions = {
    ...commonChartOptions,
    chart: { ...commonChartOptions.chart, type: 'area' as const },
    xaxis: { categories: weeklyFiltered.map(w => w.week) },
    stroke: { curve: 'smooth' as const, width: 2.5 },
    colors: ['hsl(var(--primary))'],
    fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.05 } },
  };

  const monthlyOptions = {
    ...commonChartOptions,
    labels: monthlyFiltered.map(m => m.month),
    legend: { position: 'bottom' as const },
    colors: ['hsl(var(--primary))', '#38bdf8', '#7dd3fc', '#a5f3fc', '#e0f2fe'],
  };

  return (
    <section className="min-h-screen bg-background px-4 py-6 md:px-8">
      <div dir="rtl" className="mx-auto max-w-7xl space-y-5">

        {/* Page Title */}
        <div>
          <h1 className="text-xl font-bold text-foreground">الأرباح والعائدات</h1>
          <p className="text-sm text-muted-foreground">تتبع أرباحك وعائداتك المالية</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Card: Payment Gateway Revenue */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MdPayments className="h-4 w-4" />
                <span className="text-xs font-medium">عائد بوابة الدفع</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(data.orderPayment)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Nfc className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Card: Total Revenue */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">العائد الكلي</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(data.totalProfit)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <WalletIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Withdraw Banner */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <ArrowDownToLine className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">سحب الأرباح</h3>
              <p className="text-xs text-muted-foreground">اعلام المنصة بسحب ارباحك</p>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={() => { handleWithdraw(); router.push('/Dashboard/profit/payment-order'); }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            سحب الارباح
          </button>
        </div>

        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">اختر الأسبوع</label>
            <select
              className="h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={e => setSelectedWeek(e.target.value || null)}
              value={selectedWeek || ''}
            >
              <option value="">كل الأسابيع</option>
              {data.weekly.map(w => <option key={w.week} value={w.week}>{w.week}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">اختر الشهر</label>
            <select
              className="h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={e => setSelectedMonth(e.target.value || null)}
              value={selectedMonth || ''}
            >
              <option value="">كل الشهور</option>
              {data.monthly.map(m => <option key={m.month} value={m.month}>{m.month}</option>)}
            </select>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-foreground">العائد الأسبوعي</h2>
          <ApexCharts
            type="area"
            series={[{ name: 'الأرباح', data: weeklyFiltered.map(w => w.profit) }]}
            options={weeklyOptions}
            height={300}
          />
        </div>

        {/* Monthly + Daily */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">العائد الشهري</h2>
            <ApexCharts
              type="pie"
              series={monthlyFiltered.map(m => m.profit)}
              options={monthlyOptions}
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <Clock className="h-4 w-4" /> العائد اليومي
            </h2>
            <div className="max-h-[300px] overflow-y-auto space-y-0.5">
              {dailyFiltered.length ? (
                dailyFiltered.map(d => (
                  <div key={d.day} className="flex justify-between border-b border-border/50 py-2.5 text-sm">
                    <span className="text-muted-foreground">{d.day}</span>
                    <span className="font-semibold text-primary">{formatCurrency(d.profit)}</span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">لا توجد بيانات يومية</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
