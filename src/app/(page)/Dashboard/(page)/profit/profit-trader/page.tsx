'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Clock3, Nfc, TrendingUp, WalletIcon } from 'lucide-react';
import Loader from '@/components/Loader';
import { MdPayments } from 'react-icons/md';
import { useLanguage } from '../../../context/LanguageContext';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export type PaymentOrder = {
  id: string;
  orderId: string;
  cartId: string;
  tranRef: string | null;
  amount: number;
  currency: string;
  status: string;
  respCode: string | null;
  respMessage: string | null;
  token: string | null;
  customerEmail: string | null;
  signature: string | null;
  createdAt: string;
};

export type OrderFromTraderPayment = {
  paymentOrder: PaymentOrder | null;
};

interface ProfitData {
  totalProfit: number;
  daily: { day: string; profit: number }[];
  weekly: { week: string; profit: number }[];
  monthly: { month: string; profit: number }[];
  orderFromTraderPayment: OrderFromTraderPayment[];
}

export default function ProfitTraderPage() {
  const { t, dir } = useLanguage();
  const pageT = t.dashboardPages.profitSupplier;
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
        const res = await axios.get('/api/orders/getall/getall-for-supplier');
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
      <div className="bg-card flex min-h-screen justify-center py-50">
        <Loader />
      </div>
    );
  }

  if (error) return <p className="mt-6 text-center text-red-600">{error}</p>;
  if (!data) return <p className="text-muted-foreground mt-6 text-center">{pageT.noData}</p>;

  const commonChartOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#000000' },
    theme: { mode: 'light' as const },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
  };

  const monthlyOptions = {
    ...commonChartOptions,
    labels: monthlyFiltered.map(item => item.month),
    legend: { position: 'bottom' as const },
    colors: [
      '#1f2937',
      '#4b5563',
      '#6b7280',
      '#9ca3af',
      '#f472b6',
      '#f87171',
      '#34d399',
      '#60a5fa',
    ],
  };

  const weeklyOptions = {
    ...commonChartOptions,
    chart: { ...commonChartOptions.chart, type: 'line' as const },
    xaxis: { categories: weeklyFiltered.map(item => item.week) },
    stroke: { curve: 'smooth' as const, width: 3 },
    markers: { size: 5 },
    colors: ['#000000'],
  };

  const paymentGatewayAmount =
    data.orderFromTraderPayment.find(item => item.paymentOrder?.amount)?.paymentOrder?.amount ?? 0;

  return (
    <section className="bg-card min-h-screen py-4 text-black">
      <div dir={dir} className="mx-auto space-y-10 py-6">
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
          <div className="bg-card flex w-full justify-between rounded-xl border border-neutral-200 p-6 md:flex-row">
            <div>
              <div className="flex items-center gap-2 text-neutral-600">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">{pageT.totalRevenue}</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {formatCurrency(data.totalProfit)}
              </p>
            </div>
            <div>
              <WalletIcon className="h-14 w-14 text-neutral-700" />
            </div>
          </div>

          <div className="bg-card flex w-full items-center justify-between rounded-xl border border-neutral-200 p-6">
            <div>
              <div className="flex items-center gap-2 text-neutral-600">
                <MdPayments className="h-5 w-5" />
                <span className="text-sm font-medium">{pageT.paymentGatewayRevenue}</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {formatCurrency(paymentGatewayAmount)}
              </p>
            </div>
            <div>
              <Nfc className="h-14 w-14 text-neutral-700" />
            </div>
          </div>
        </div>

        <div className="border-border/80 flex flex-col items-stretch gap-3 rounded-2xl border bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg shadow-gray-200/50 backdrop-blur-sm md:flex-row md:items-center md:gap-6">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-foreground text-sm font-semibold">{pageT.selectWeek}</label>
            <select
              className="border-border bg-card text-foreground rounded-xl border px-4 py-3 shadow-sm transition-all duration-200 outline-none hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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

          <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent md:block" />

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-foreground text-sm font-semibold">{pageT.selectMonth}</label>
            <select
              className="border-border bg-card text-foreground rounded-xl border px-4 py-3 shadow-sm transition-all duration-200 outline-none hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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

        <div className="border-border bg-card rounded-2xl border p-6 text-black">
          <h2 className="mb-4 font-semibold">{pageT.weeklyProfit}</h2>
          <ApexCharts
            type="line"
            series={[{ name: pageT.seriesName, data: weeklyFiltered.map(item => item.profit) }]}
            options={weeklyOptions}
            height={300}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="border-border bg-card rounded-2xl border p-6 text-black">
            <h2 className="mb-4 font-semibold">{pageT.monthlyProfit}</h2>
            <ApexCharts
              type="pie"
              series={monthlyFiltered.map(item => item.profit)}
              options={monthlyOptions}
              height={300}
            />
          </div>

          <div className="border-border bg-card rounded-2xl border p-6 text-black">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Clock3 className="text-xl" /> {pageT.dailyProfit}
            </h2>
            <ul className="space-y-2 overflow-y-scroll">
              {dailyFiltered.length ? (
                dailyFiltered.map(item => (
                  <li key={item.day} className="flex justify-between border-b py-1">
                    <span>{item.day}</span>
                    <span className="font-bold">{formatCurrency(item.profit)}</span>
                  </li>
                ))
              ) : (
                <li>{pageT.noDailyData}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
