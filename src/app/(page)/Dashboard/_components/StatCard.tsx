import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  desc: string;
  href?: string;
  variant?: 'blue' | 'gray' | 'black';
}

export default function StatCard({
  title,
  value,
  icon,
  desc,
  href,
  variant = 'blue',
}: StatCardProps) {
  const isPositive = desc.includes('+');

  const variants = {
    blue: {
      container: 'bg-blue-50/80 text-blue-950 border-blue-100',
      iconBg: 'bg-blue-500 text-white',
      descPos: 'text-green-600',
      descNeg: 'text-red-500',
    },
    gray: {
      container: 'bg-white text-gray-950 border-gray-200',
      iconBg: 'bg-gray-900 text-white',
      descPos: 'text-green-600',
      descNeg: 'text-red-500',
    },
    black: {
      container: 'bg-gray-900 text-white border-gray-800',
      iconBg: 'bg-white text-gray-900',
      descPos: 'text-green-400',
      descNeg: 'text-red-400',
    },
  };

  const styles = variants[variant] ?? variants.blue;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group">
      <div className="relative overflow-hidden rounded-lg border   bg-white p-6 transition-all duration-200 hover:border-gray-300/80 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
            <div className="text-gray-600">{icon}</div>
          </div>

          {desc && (
            <div className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {desc}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm leading-tight font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold tracking-tight text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
