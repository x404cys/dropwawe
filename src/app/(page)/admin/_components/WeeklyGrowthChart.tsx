'use client';
import { useEffect, useState } from 'react';
import { IoStatsChartOutline } from 'react-icons/io5';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface WeeklyStats {
  weeklyVisitors: number[];
  weeklyNewUsers: number[];
  weeklyConversionRates: number[];
  weeklyDates: string[];
}

export default function WeeklyGrowthChart() {
  const [series, setSeries] = useState<ApexAxisChartSeries>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/gmv/vistanduser');
        const json = await res.json();
        const stats: WeeklyStats = json.stats;

        setCategories(stats.weeklyDates);

        setSeries([
          {
            name: 'الزوار',
            data: stats.weeklyVisitors,
          },
          {
            name: 'المستخدمين الجدد',
            data: stats.weeklyNewUsers,
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 400,
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit',
    },
    dataLabels: { enabled: true },
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: 'round',
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontFamily: 'inherit',
          colors: ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'],
          fontSize: '12px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: 'inherit',
          colors: '#6b7280',
          fontSize: '12px',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: 'inherit',
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 3,
      xaxis: {
        lines: { show: false },
      },
      yaxis: {
        lines: { show: true },
      },
    },
    colors: ['#374151', '#B0C4B1'],
    fill: {
      type: 'solid',
      opacity: 0.9,
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'light',
      style: {
        fontFamily: 'inherit',
        fontSize: '12px',
      },
      y: {
        formatter: (val: number) => `${val.toLocaleString()}`,
      },
    },
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div id="state" className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-gray-50 p-2">
          <IoStatsChartOutline className="h-5 w-5 text-gray-500" />
        </div>
        <h2 className="text-lg font-medium text-gray-900">GMV Weekly</h2>
      </div>
      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading chart...</div>
        </div>
      ) : (
        <ApexChart options={options} series={series} type="line" height={400} />
      )}
    </div>
  );
}
