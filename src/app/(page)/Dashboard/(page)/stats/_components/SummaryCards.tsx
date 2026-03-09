import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface SummaryCardsProps {
  availableBalance: number;
  orderCount: number;
  customersCount: number;
  productCount: number;
}

export function SummaryCards({
  availableBalance,
  orderCount,
  customersCount,
  productCount,
}: SummaryCardsProps) {
  const { t } = useLanguage();

  const summaryStats = [
    {
      label: t.stats?.revenue || 'الإيرادات',
      value:
        availableBalance >= 1_000_000
          ? `${(availableBalance / 1_000_000).toFixed(1)}M`
          : availableBalance >= 1_000
            ? `${(availableBalance / 1_000).toFixed(0)}K`
            : `${availableBalance}`,
      sub: t.currency,
      change: 12.5,
      icon: DollarSign,
      color: 'text-primary',
    },
    {
      label: t.stats?.totalOrders || 'الطلبات',
      value: `${orderCount}`,
      change: 8.3,
      icon: ShoppingCart,
      color: 'text-blue-500',
    },
    {
      label: t.stats?.totalCustomers || 'العملاء',
      value: `${customersCount}`,
      change: 15.2,
      icon: Users,
      color: 'text-green-500',
    },
    {
      label: t.stats?.totalProducts || 'المنتجات',
      value: `${productCount}`,
      change: -3.1,
      icon: Package,
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {summaryStats.map(stat => (
        <div key={stat.label} className="bg-card border-border rounded-xl border p-3.5">
          <div className="mb-1.5 flex items-center justify-between">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span
              className={`flex items-center gap-0.5 text-[10px] font-medium ${
                stat.change >= 0 ? 'text-green-500' : 'text-destructive'
              }`}
            >
              {stat.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(stat.change)}%
            </span>
          </div>
          <span className="text-foreground block text-lg font-bold">
            {stat.value}
            {stat.sub && <span className="text-muted-foreground mr-1 text-[10px]">{stat.sub}</span>}
          </span>
          <span className="text-muted-foreground text-[11px]">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
