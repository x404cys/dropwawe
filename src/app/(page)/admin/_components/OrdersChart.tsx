'use client';

import dynamic from 'next/dynamic';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ApexOptions } from 'apexcharts';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface OrdersByStatus {
  status: string;
  _count: { _all: number };
}

const OrdersChart = ({ ordersByStatus }: { ordersByStatus: OrdersByStatus[] }) => {
  const chartOptions: ApexOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      fontFamily: 'inherit',
    },
    stroke: { curve: 'smooth', width: 3, colors: ['#3b82f6'] },
    markers: {
      size: 5,
      colors: ['#3b82f6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 7 },
    },
    xaxis: { categories: ordersByStatus.map(o => o.status) },
    yaxis: {},
    tooltip: { theme: 'light', y: { formatter: val => val + ' طلب' } },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 3, xaxis: { lines: { show: false } } },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
  };

  const chartSeries = [{ name: 'عدد الطلبات', data: ordersByStatus.map(o => o._count._all) }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-black bg-white p-6"
    >
      <div id="state" className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-gray-50 p-2">
          <TrendingUp className="h-5 w-5 text-gray-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">الطلبات حسب الحالة</h2>
      </div>
      <div className="h-80 w-full">
        <ApexCharts
          options={chartOptions}
          series={chartSeries}
          type="line"
          height="100%"
          width="100%"
        />
      </div>
    </motion.div>
  );
};

export default OrdersChart;
