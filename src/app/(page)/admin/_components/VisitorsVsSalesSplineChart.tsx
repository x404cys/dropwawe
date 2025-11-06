/* import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  weeklyVisitors: number[];
  weeklyStores: number[];
}

export default function VisitorsVsSalesSplineChart({ weeklyVisitors, weeklyStores }: Props) {
  const series = [
    { name: 'زوار صفحة الهبوط', data: weeklyVisitors },
    { name: 'عدد المتاجر الأسبوعية', data: weeklyStores },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: 'area', height: 350, toolbar: { show: true } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: weeklyVisitors.map((_, i) => `الأسبوع ${i + 1}`),
      labels: { style: { fontFamily: 'inherit' } },
    },
    yaxis: { labels: { style: { fontFamily: 'inherit' } } },
    colors: ['#3b82f6', '#10b981'],
    legend: { position: 'top', horizontalAlign: 'center' },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] },
    },
    tooltip: { shared: true, intersect: false },
  };

  return (
    <Card className="shadow-md">
      <CardContent>
        <ApexChart options={options} series={series} type="area" height={350} />
      </CardContent>
    </Card>
  );
}
 */