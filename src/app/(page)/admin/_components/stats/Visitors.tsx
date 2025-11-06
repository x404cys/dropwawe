'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { useAdmin } from '../../context/DataContext';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function VisitorsComparisonChart() {
  const adminData = useAdmin();

  if (adminData.loading) return <div>جارٍ التحميل...</div>;

  const series = [
    {
      name: 'زوار المنصة الكلية',
      data: [
        adminData.totalVisitors || 0,
        adminData.totalVisitors || 0,
        adminData.totalVisitors || 0,
      ],
    },
    {
      name: 'زوار المتاجر اليوم',
      data: [
        adminData.storesToday || 0,
        adminData.storesThisMonth || 0,
        adminData.storesToday || 0,
      ],
    },
    {
      name: 'زوار المتاجر هذا الشهر',
      data: [
        adminData.storesThisMonth || 0,
        adminData.storesThisMonth || 0,
        adminData.storesToday || 0,
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: true },
      toolbar: { show: true },
      id: 'visitors-chart',
    },
    dataLabels: { enabled: true },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 6,
      hover: { size: 8 },
    },
    xaxis: {
      categories: ['اليوم', 'هذا الشهر', 'إجمالي'],
      labels: { rotate: -15 },
    },
    yaxis: {
      title: { text: 'عدد الزوار' },
      labels: { minWidth: 40 },
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    tooltip: { shared: true, intersect: false },
    legend: { position: 'top', horizontalAlign: 'center' },
    grid: { borderColor: '#e0e0e0', row: { colors: ['#f9f9f9', 'transparent'], opacity: 0.5 } },
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm mt-4 mb-4">
      <h2 className="mb-4 text-lg font-bold">المتاجر مقارنة بالزوار</h2>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
}
