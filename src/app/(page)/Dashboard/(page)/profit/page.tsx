'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { FiDollarSign, FiClock } from 'react-icons/fi';
import Loader from '@/components/Loader';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ProfitData {
  totalProfit: number;
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

  // فلترة حسب الشهر / الأسبوع
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/orders/getall?userId=${userId}`);
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

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
    }).format(num);

  // ================== فلترة البيانات ==================
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
      <div className="flex min-h-screen justify-center bg-white py-50">
        <Loader />
      </div>
    );
  if (error) return <p className="mt-6 text-center text-red-600">{error}</p>;
  if (!data) return <p className="mt-6 text-center text-gray-600">No data available</p>;

  const commonChartOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, foreColor: '#000000' },
    theme: { mode: 'light' as const },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
  };

  // ======= الرسوم البيانية =======
  const monthlyOptions = {
    ...commonChartOptions,
    labels: monthlyFiltered.map(m => m.month),
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
  const monthlySeries = monthlyFiltered.map(m => m.profit);

  const weeklyOptions = {
    ...commonChartOptions,
    chart: { ...commonChartOptions.chart, type: 'line' as const },
    xaxis: { categories: weeklyFiltered.map(w => w.week) },
    stroke: { curve: 'smooth' as const, width: 3 },
    markers: { size: 5 },
    colors: ['#000000'],
  };
  const weeklySeries = [{ name: 'Profit', data: weeklyFiltered.map(w => w.profit) }];

  return (
    <section className="min-h-screen bg-white py-4 text-black">
      <div dir="rtl" className="mx-auto space-y-10 py-6">
        {/* إجمالي الربح */}
        <div className="grid grid-cols-1 gap-6">
          <div className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-black">
            <FiDollarSign className="text-3xl" />
            <div>
              <h2 className="text-lg font-semibold">العائد الكلي | Total Profit</h2>
              <p className="mt-2 text-2xl font-bold">{formatCurrency(data.totalProfit)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg shadow-gray-200/50 backdrop-blur-sm md:flex-row md:items-center md:gap-6">
          {/* اختيار الأسبوع */}
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">اختر الأسبوع</label>
            <select
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 outline-none hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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

          {/* فاصل عمودي */}
          <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent md:block" />

          {/* اختيار الشهر */}
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">اختر الشهر</label>
            <select
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all duration-200 outline-none hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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

        <div className="-lg rounded-2xl border border-gray-200 bg-white p-6 text-black">
          <h2 className="mb-4 font-semibold">العائد الأسبوعي | Weekly Profit</h2>
          <ApexCharts type="line" series={weeklySeries} options={weeklyOptions} height={300} />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="-lg rounded-2xl border border-gray-200 bg-white p-6 text-black">
            <h2 className="mb-4 font-semibold">العائد الشهري | Monthly Profit</h2>
            <ApexCharts type="pie" series={monthlySeries} options={monthlyOptions} height={300} />
          </div>

          <div className="-lg rounded-2xl border border-gray-200 bg-white p-6 text-black">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <FiClock className="text-xl" /> العائد اليومي | Daily Profit
            </h2>
            <ul className="space-y-2 overflow-y-scroll">
              {dailyFiltered.length ? (
                dailyFiltered.map(d => (
                  <li key={d.day} className="flex justify-between border-b py-1">
                    <span>{d.day}</span>
                    <span className="font-bold">{formatCurrency(d.profit)}</span>
                  </li>
                ))
              ) : (
                <li>No daily data</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
