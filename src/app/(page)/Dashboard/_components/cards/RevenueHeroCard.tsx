'use client';
import { useLanguage } from '../../context/LanguageContext';

import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'path';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import useSWR from 'swr';
import { useStoreProvider } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';

export default function RevenueHeroCard() {
  const { currentStore } = useStoreProvider();
    const { theme, toggleTheme } = useTheme();
  
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data, isLoading } = useSWR(
    `/api/dashboard/profit/Revenue?storeId=${currentStore?.id}`,
    fetcher
  );
  const { t, lang } = useLanguage();
  const changePercent: number = data?.changePercent ?? 0;
  const isPositive = changePercent >= 0;

  const weeklyData =
    data?.weekly?.map((item: any) => ({
      day:
        item.day === 'Saturday'
          ? lang === 'en'
            ? 'Sat'
            : lang === 'ku'
              ? 'شەممە'
              : 'السبت'
          : item.day === 'Sunday'
            ? lang === 'en'
              ? 'Sun'
              : lang === 'ku'
                ? 'یەکشەممە'
                : 'الأحد'
            : item.day === 'Monday'
              ? lang === 'en'
                ? 'Mon'
                : lang === 'ku'
                  ? 'دووشەممە'
                  : 'الاثنين'
              : item.day === 'Tuesday'
                ? lang === 'en'
                  ? 'Tue'
                  : lang === 'ku'
                    ? 'سێشەممە'
                    : 'الثلاثاء'
                : item.day === 'Wednesday'
                  ? lang === 'en'
                    ? 'Wed'
                    : lang === 'ku'
                      ? 'چوارشەممە'
                      : 'الأربعاء'
                  : item.day === 'Thursday'
                    ? lang === 'en'
                      ? 'Thu'
                      : lang === 'ku'
                        ? 'پێنجشەممە'
                        : 'الخميس'
                    : lang === 'en'
                      ? 'Fri'
                      : lang === 'ku'
                        ? 'هەینی'
                        : 'الجمعة',

      value: item.profit,
    })) || [];
const renderDayTick = ({ x, y, payload }: any) => {
  const isDark = theme === 'dark';

  return (
    <text
      x={x}
      y={y + 10}
      textAnchor="middle"
      fill={isDark ? '#ffffff' : '#000000'}
      fontSize={10}
      fontWeight={600}
    >
      {payload.value}
    </text>
  );
};
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
      id="revenue-card"
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
            {changePercent.toFixed(1)}%
          </span>
        </div>

        <div className="mt-2">
          <span className="text-foreground text-3xl font-extrabold tracking-tight">
            {formatIQD(data.totalProfit)}
          </span>
          <span className="text-muted-foreground mr-1.5 text-sm">{t?.currency || 'د.ع'}</span>
        </div>
        <p className="text-muted-foreground mt-1 text-[11px]">
          {t.stats?.growth || 'مقارنة بالأسبوع الماضي'}
        </p>
      </div>

      <div className="h-36 px-2 pb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart  data={weeklyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}  >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#04BAF6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#04BAF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={renderDayTick}
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
              formatter={(value: string | number | readonly (string | number)[] | undefined) => [
                `${(typeof value === 'number' ? value : Number(value) || 0).toLocaleString(lang === 'ar' ? 'ar-IQ' : 'en-US')} ${t?.currency || 'د.ع'}`,
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
