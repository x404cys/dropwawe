'use client';

import { motion } from 'framer-motion';
import type { JSX } from 'react';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: JSX.Element;
  color: string;
  bgColor: string;
  isHighlight?: boolean;
}

interface Stat {
  title: string;
  value?: number | string;
  icon: JSX.Element;
  color: string;
  isHighlight?: boolean;
}

export default function StatsCardDashboard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-lg border border-gray-200/60 bg-white p-6 shadow-sm transition-all duration-200 hover:border-gray-300/80 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
            <div className="text-gray-600">{stat.icon}</div>
          </div>
          <div className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            +2.1%
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm leading-tight font-medium text-gray-500">{stat.title}</h3>
          <p className="text-2xl font-semibold tracking-tight text-gray-900">
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
