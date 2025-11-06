'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import FloatingNavBarForDashboard from '@/app/Dashboard/_components/FloatingNavBarForDashboard';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '../../_utils/useDashboardData';
import { FiDollarSign, FiClock } from 'react-icons/fi';
import UserActions from '../../_components/UserActions';
import Loader from '@/components/Loader';
import dynamic from 'next/dynamic';

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

  if (loading)
    return (
      <div className="flex min-h-screen justify-center bg-white py-50">
        <Loader />
      </div>
    );
  if (error) return <p className="mt-6 text-center text-red-600">{error}</p>;
  if (!data) return <p className="mt-6 text-center text-gray-600">No data available</p>;

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat('en-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);

  const commonChartOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: '#000000',
    },
    theme: { mode: 'light' as const },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
  };

  const monthlyOptions = {
    ...commonChartOptions,
    labels: data.monthly.map(m => m.month),
    legend: { position: 'bottom' as const },
    colors: [
      '#1f2937',
      '#4b5563',
      '#6b7280',
      '#9ca3af',
      '#d1d5db',
      '#f3f4f6',
      '#f87171',
      '#fbbf24',
      '#34d399',
      '#60a5fa',
      '#a78bfa',
      '#f472b6',
    ],
  };
  const monthlySeries = data.monthly.map(m => m.profit);

  const weeklyOptions = {
    ...commonChartOptions,
    chart: { ...commonChartOptions.chart, type: 'line' as const },
    xaxis: { categories: data.weekly.map(w => w.week) },
    stroke: { curve: 'smooth' as const, width: 3 },
    markers: { size: 5 },
    colors: ['#000000'],
  };
  const weeklySeries = [{ name: 'Profit', data: data.weekly.map(w => w.profit) }];

  return (
    <section className="min-h-screen bg-white py-4 text-black">
      <div dir="rtl" className="mx-auto space-y-10 py-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-black duration-300">
            <FiDollarSign className="text-3xl" />
            <div>
              <h2 className="text-lg font-semibold">العائد الكلي | Total Profit</h2>
              <p className="mt-2 text-2xl font-bold">{formatCurrency(data.totalProfit)}</p>
            </div>
          </div>
        </div>

        <div className="-lg rounded-2xl border border-gray-200 bg-white p-6 text-black">
          <h2 className="mb-4 font-semibold">العائد الأسبوعي | Weekly Profit</h2>
          <ApexCharts type="line" series={weeklySeries} options={weeklyOptions} height={300} />
        </div>
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
          <ul className="space-y-2">
            {data.daily.length ? (
              data.daily.map(d => (
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
    </section>
  );
}
