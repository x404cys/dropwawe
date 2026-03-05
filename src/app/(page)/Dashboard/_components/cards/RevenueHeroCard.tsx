'use client';
import { useLanguage } from '../../context/LanguageContext';

import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'path';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

interface RevenueHeroCardProps {
  totalAmount?: number;
  isLoading?: boolean;
  changePercent?: number;
}

export default function RevenueHeroCard({
  totalAmount = 0,
  isLoading = false,
  changePercent = 12.5,
}: RevenueHeroCardProps) {
  const { t, lang } = useLanguage();
  const isPositive = changePercent >= 0;

  const WEEKLY_DATA = [
    { day: lang === 'en' ? 'Sat' : lang === 'ku' ? 'شەممە' : 'السبت', value: 320000 },
    { day: lang === 'en' ? 'Sun' : lang === 'ku' ? 'یەکشەممە' : 'الأحد', value: 450000 },
    { day: lang === 'en' ? 'Mon' : lang === 'ku' ? 'دووشەممە' : 'الاثنين', value: 280000 },
    { day: lang === 'en' ? 'Tue' : lang === 'ku' ? 'سێشەممە' : 'الثلاثاء', value: 520000 },
    { day: lang === 'en' ? 'Wed' : lang === 'ku' ? 'چوارشەممە' : 'الأربعاء', value: 390000 },
    { day: lang === 'en' ? 'Thu' : lang === 'ku' ? 'پێنجشەممە' : 'الخميس', value: 610000 },
    { day: lang === 'en' ? 'Fri' : lang === 'ku' ? 'هەینی' : 'الجمعة', value: 480000 },
  ];

  if (isLoading) {
    return (
      <div className="bg-primary/10 border-primary/20 h-48 animate-pulse rounded-2xl border" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="from-primary/15 via-primary/8 to-primary/1 border-primary/20 overflow-hidden rounded-2xl border bg-gradient-to-l"
    >
      <div className="px-5 pt-5 pb-3">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl">
              <DollarSign className="text-primary h-5 w-5" />
            </div>
            <span className="text-muted-foreground text-xs font-medium">
              {t.stats?.totalRevenue || 'إجمالي العوائد'}
            </span>
          </div>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isPositive
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-red-500/10 text-red-600'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {isPositive ? '+' : ''}
            {changePercent}%
          </span>
        </div>

        <div className="mt-2">
          <span className="text-foreground text-3xl font-extrabold tracking-tight">
            {formatIQD(totalAmount)}
          </span>
          <span className="text-muted-foreground mr-1.5 text-sm">{t?.currency || 'د.ع'}</span>
        </div>
        <p className="text-muted-foreground mt-1 text-[11px]">
          {t.stats?.growth || 'مقارنة بالأسبوع الماضي'}
        </p>
      </div>

      <div className="h-36 px-2 pb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#04BAF6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#04BAF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(200, 20%, 90%)',
                borderRadius: 8,
                fontSize: 11,
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number | undefined) => [
                `${(value ?? 0).toLocaleString(lang === 'ar' ? 'ar-IQ' : 'en-US')} ${t?.currency || 'د.ع'}`,
                t.stats?.revenue || 'العوائد',
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#18bcdb"
              strokeWidth={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
