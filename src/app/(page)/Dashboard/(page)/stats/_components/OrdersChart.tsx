import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useLanguage } from '../../../context/LanguageContext';

interface OrdersChartProps {
  data: { day: string; value: number; revenue: number }[];
}

export function OrdersChart({ data }: OrdersChartProps) {
  const { t } = useLanguage();

  const formatOrdersTooltip = (value: ValueType | undefined) => {
    const normalizedValue = Array.isArray(value) ? value[0] : value;
    const orderCount =
      typeof normalizedValue === 'number' ? normalizedValue : Number(normalizedValue) || 0;

    return [`${orderCount} ${t.stats.ordersUnit}`, t.stats.ordersChart] as const;
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-card border-border rounded-xl border p-4">
      <h3 className="text-foreground mb-4 text-sm font-semibold">{t.stats.ordersChart}</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide allowDecimals={false} />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid hsl(200,20%,90%)',
                backgroundColor: 'hsl(var(--card))',
              }}
              formatter={formatOrdersTooltip}
            />
            <Bar dataKey="value" fill="hsl(191, 80%, 42%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
