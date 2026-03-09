import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useLanguage } from '../../../context/../context/LanguageContext';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

interface RevenueChartProps {
  data: { day: string; value: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { t } = useLanguage();

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-card border-border rounded-xl border p-4">
      <h3 className="text-foreground mb-4 text-sm font-semibold">
        {t.stats?.revenue || 'الإيرادات'}
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(191, 80%, 42%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(191, 80%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid hsl(200,20%,90%)',
                backgroundColor: 'hsl(var(--card))',
              }}
              formatter={(value: any) => {
                const v = typeof value === 'number' ? value : Number(value) || 0;
                return [`${formatIQD(v)} ${t.currency}`, t.stats?.revenue || 'الإيرادات'];
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(191, 80%, 42%)"
              strokeWidth={2}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
