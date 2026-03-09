import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useLanguage } from '../../../context/LanguageContext';

interface OrdersChartProps {
  data: { day: string; value: number; revenue: number }[];
}

export function OrdersChart({ data }: OrdersChartProps) {
  const { t } = useLanguage();

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-card border-border rounded-xl border p-4">
      <h3 className="text-foreground mb-4 text-sm font-semibold">{t.orders?.title || 'الطلبات'}</h3>
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
              formatter={(v: any) => [
                `${typeof v === 'number' ? v : Number(v) || 0} طلب`,
                'الطلبات',
              ]}
            />
            <Bar dataKey="value" fill="hsl(191, 80%, 42%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
