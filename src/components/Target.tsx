'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { TbTargetArrow } from 'react-icons/tb';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function MonthlyTargetCard({
  target,
  fullTarget,
}: {
  target: number;
  fullTarget: number;
}) {
  const percentage = useMemo(() => {
    return parseFloat(((target / fullTarget) * 100).toFixed(2));
  }, [target]);

  const series = [percentage];

  const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 100,
      sparkline: { enabled: true },
      animations: {
        enabled: true,
        speed: 2000,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 1000,
        },
      },
    },

    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 100,
        hollow: { size: '75%' },
        track: { background: '#f3f4f6', margin: 3 },

        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '28px',
            fontWeight: 600,
            offsetY: -30,
            color: '#1D2939',
            formatter: val => `${val}%`,
          },
        },
      },
    },
    fill: { colors: ['#000000'] },
    stroke: { lineCap: 'round' },
    labels: ['التقدم'],
  };

  return (
    <div
      dir="rtl"
      className="max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm md:max-w-2xl"
    >
      <div className="p-4">
        <div className="mb-2 flex justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">الهدف الشهري</h3>
            <p className="text-sm text-gray-500">نسبة الإنجاز لهذا الشهر</p>
          </div>
          <TbTargetArrow className="text-2xl" />
        </div>

        <div className="relative flex justify-center">
          <ReactApexChart options={options} series={series} type="radialBar" height={200} />
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          تم الوصول إلى <strong>{target} طلبات</strong> هذا الشهر من اصل {fullTarget}
        </p>
      </div>
    </div>
  );
}
