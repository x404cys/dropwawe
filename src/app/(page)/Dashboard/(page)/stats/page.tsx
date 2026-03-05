'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  Wallet,
  CheckCircle2,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Globe,
  Search,
  Crown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from 'sonner';
import { useLanguage } from '../../context/LanguageContext';
import { useStoreProvider } from '../../context/StoreContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

const PERIODS = ['اليوم', 'هذا الأسبوع', 'هذا الشهر', 'هذه السنة'];

// Icon lookup — maps the string the API returns to a Lucide component
const DEVICE_ICON_MAP: Record<string, React.ElementType> = {
  Smartphone,
  Monitor,
  Tablet,
};

// ─── API Response Type ─────────────────────────────────────────────────────────
interface StatsResponse {
  totalRevenue: number;
  availableBalance: number;
  orderCount: number;
  confirmedCount: number;
  pendingCount: number;
  productCount: number;
  visitCount: number;
  customers: {
    name: string;
    phone: string;
    orders: number;
    total: number;
    lastOrder: string;
  }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  revenueChart: { day: string; orders: number; revenue: number }[];
  monthlyChart: { day: string; revenue: number }[];
  // Real analytics
  governorateData: { name: string; orders: number; percentage: number }[];
  deviceData: { name: string; value: number; color: string; icon: string }[];
  deviceBrands: { name: string; percentage: number; color: string }[];
  trafficSources: { name: string; value: number; color: string; emoji: string }[];
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function StatsPage() {
  const { t, lang } = useLanguage();
  const { currentStore } = useStoreProvider();
  const { data: session } = useSession();

  const [mainTab, setMainTab] = useState<'stats' | 'customers'>('stats');
  const [period, setPeriod] = useState('هذا الأسبوع');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'governorate' | 'device' | 'pages' | 'sources'>(
    'governorate'
  );
  const [customerSearch, setCustomerSearch] = useState('');

  const fetcher = (url: string) => fetch(url).then(r => r.json());

  // ── Single API call ───────────────────────────────────────────────────────────
  const statsUrl = currentStore?.id
    ? `/api/dashboard/stats?storeId=${currentStore.id}${currentStore.subLink ? `&storeSubLink=${currentStore.subLink}` : ''}`
    : null;

  const { data: stats, isLoading } = useSWR<StatsResponse>(statsUrl, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60_000, // refresh every minute
  });

  // ── Derived data ──────────────────────────────────────────────────────────────
  const availableBalance = stats?.availableBalance ?? 0;

  // Translate day keys to Arabic/English short labels for the chart
  const daysShortAr = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
  const daysShortEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const ordersChartData = useMemo(() => {
    if (!stats?.revenueChart) return [];
    return stats.revenueChart.map(item => {
      const d = new Date(item.day);
      const label = lang === 'en' ? daysShortEn[d.getDay()] : daysShortAr[d.getDay()];
      return { day: label, value: item.orders, revenue: item.revenue };
    });
  }, [stats?.revenueChart, lang]);

  const revenueChartData = useMemo(() => {
    if (!stats?.revenueChart) return [];
    return stats.revenueChart.map(item => {
      const d = new Date(item.day);
      const label = lang === 'en' ? daysShortEn[d.getDay()] : daysShortAr[d.getDay()];
      return { day: label, value: item.revenue };
    });
  }, [stats?.revenueChart, lang]);

  const customers = stats?.customers ?? [];
  const topProducts = stats?.topProducts ?? [];
  const visitCount = stats?.visitCount ?? 0;

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        c => !customerSearch || c.name.includes(customerSearch) || c.phone.includes(customerSearch)
      ),
    [customers, customerSearch]
  );

  const topBuyer =
    customers.length > 0 ? customers.reduce((a, b) => (a.total > b.total ? a : b)) : null;

  const totalCustomerSpent = customers.reduce((s, c) => s + c.total, 0);

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
      value: `${stats?.orderCount ?? 0}`,
      change: 8.3,
      icon: ShoppingCart,
      color: 'text-blue-500',
    },
    {
      label: t.stats?.totalCustomers || 'العملاء',
      value: `${customers.length}`,
      change: 15.2,
      icon: Users,
      color: 'text-green-500',
    },
    {
      label: t.stats?.totalProducts || 'المنتجات',
      value: `${stats?.productCount ?? 0}`,
      change: -3.1,
      icon: Package,
      color: 'text-muted-foreground',
    },
  ];

  const analyticsTabs = [
    { id: 'governorate' as const, label: 'المحافظات', icon: MapPin },
    { id: 'device' as const, label: 'الأجهزة', icon: Smartphone },
    { id: 'pages' as const, label: 'الزيارات', icon: Eye },
    { id: 'sources' as const, label: 'المصادر', icon: Globe },
  ];

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0 || amount > availableBalance) {
      toast.error('يرجى إدخال مبلغ صحيح');
      return;
    }
    toast.success(`طلب سحب ${amount.toLocaleString('ar-IQ')} ${t.currency} قيد المراجعة`);
    setWithdrawAmount('');
    setWithdrawOpen(false);
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section dir="rtl" className="min-h-screen">
        <main className="flex-1 space-y-4 px-1 py-2 pb-16">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <div className="bg-muted/50 flex gap-1 rounded-xl p-1">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </main>
      </section>
    );
  }

  return (
    <section dir="rtl" className="min-h-screen">
      <main className="flex-1 space-y-4 px-1 py-2 pb-16">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div>
            <h1 className="text-foreground text-xl font-bold">
              {mainTab === 'stats'
                ? t.stats?.title || 'الإحصائيات'
                : t.customers?.title || 'العملاء'}
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {mainTab === 'stats'
                ? t.more?.statsDesc || 'تقارير المبيعات والأداء'
                : `${customers.length} ${t.customers?.customer || 'عميل'}`}
            </p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <BarChart3 className="text-primary h-5 w-5" />
          </div>
        </div>

        {/* ── Main tabs ── */}
        <div className="bg-muted/50 flex gap-1 rounded-xl p-1">
          <button
            onClick={() => setMainTab('stats')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all ${mainTab === 'stats' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            {t.stats?.title || 'الإحصائيات'}
          </button>
          <button
            onClick={() => setMainTab('customers')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all ${mainTab === 'customers' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            <Users className="h-3.5 w-3.5" />
            {t.customers?.title || 'العملاء'}
          </button>
        </div>

        {/* ════════ CUSTOMERS TAB ════════ */}
        {mainTab === 'customers' ? (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-card border-border rounded-lg border p-3 text-center">
                <Users className="text-primary mx-auto mb-1 h-4 w-4" />
                <span className="text-foreground block text-lg font-bold">{customers.length}</span>
                <span className="text-muted-foreground text-[10px]">{t.customers?.title}</span>
              </div>
              <div className="bg-card border-border rounded-lg border p-3 text-center">
                <Crown className="mx-auto mb-1 h-4 w-4 text-yellow-500" />
                <span className="text-foreground block truncate text-xs font-bold">
                  {topBuyer?.name ?? '-'}
                </span>
                <span className="text-muted-foreground text-[10px]">{t.customers?.topBuyer}</span>
              </div>
              <div className="bg-card border-border rounded-lg border p-3 text-center">
                <TrendingUp className="mx-auto mb-1 h-4 w-4 text-green-500" />
                <span className="text-foreground block text-xs font-bold">
                  {totalCustomerSpent >= 1_000_000
                    ? `${(totalCustomerSpent / 1_000_000).toFixed(1)}M`
                    : `${(totalCustomerSpent / 1_000).toFixed(0)}K`}
                </span>
                <span className="text-muted-foreground text-[10px]">{t.customers?.totalSpent}</span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
              <input
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
                placeholder={t.customers?.searchPlaceholder || 'ابحث عن عميل...'}
                className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-xl border px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Customer list */}
            <div className="bg-card border-border divide-border divide-y rounded-xl border">
              {filteredCustomers.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
                  <Users className="mb-3 h-12 w-12 opacity-30" />
                  <p className="text-sm font-medium">
                    {t.customers?.noCustomers || 'لا يوجد عملاء'}
                  </p>
                </div>
              ) : (
                filteredCustomers.map((customer, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                      <span className="text-primary text-sm font-bold">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">{customer.name}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-muted-foreground text-[11px]">{customer.phone}</span>
                        <span className="text-muted-foreground flex items-center gap-0.5 text-[11px]">
                          <ShoppingCart className="h-2.5 w-2.5" />
                          {customer.orders} {t.orders?.order}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-foreground block text-sm font-bold">
                        {customer.total.toLocaleString('ar-IQ')}
                      </span>
                      <span className="text-muted-foreground text-[10px]">{t.currency}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* ════════ STATS TAB ════════ */
          <>
            {/* Period filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${period === p ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Balance + Withdraw */}
            <div className="bg-card border-border flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-muted-foreground text-[11px]">الرصيد المتاح للسحب</p>
                <p className="text-foreground text-lg font-bold">
                  {availableBalance.toLocaleString('ar-IQ')}
                  <span className="text-muted-foreground mr-1 text-[10px]">{t.currency}</span>
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setWithdrawOpen(o => !o)}
                  className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <Wallet className="h-4 w-4" />
                  طلب سحب
                </button>
                {withdrawOpen && (
                  <div className="bg-card border-border absolute top-11 left-0 z-50 w-64 space-y-3 rounded-2xl border p-4 shadow-xl">
                    <p className="text-foreground text-center text-sm font-bold">طلب سحب أرباح</p>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="text-muted-foreground text-[11px]">الرصيد المتاح</p>
                      <p className="text-foreground text-xl font-bold">
                        {availableBalance.toLocaleString('ar-IQ')}
                        <span className="text-muted-foreground mr-1 text-xs">{t.currency}</span>
                      </p>
                    </div>
                    <div>
                      <label className="text-foreground mb-1.5 block text-xs font-medium">
                        المبلغ المطلوب ({t.currency})
                      </label>
                      <input
                        type="number"
                        placeholder="أدخل المبلغ"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="border-border bg-background text-foreground focus:ring-primary/30 w-full rounded-lg border px-3 py-2 text-center text-lg font-bold focus:ring-2 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleWithdraw}
                      className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      تأكيد طلب السحب
                    </button>
                    <p className="text-muted-foreground text-center text-[10px]">
                      سيتم تحويل المبلغ خلال 24-48 ساعة عمل
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {summaryStats.map(stat => (
                <div key={stat.label} className="bg-card border-border rounded-xl border p-3.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span
                      className={`flex items-center gap-0.5 text-[10px] font-medium ${stat.change >= 0 ? 'text-green-500' : 'text-destructive'}`}
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
                    {'sub' in stat && stat.sub && (
                      <span className="text-muted-foreground mr-1 text-[10px]">{stat.sub}</span>
                    )}
                  </span>
                  <span className="text-muted-foreground text-[11px]">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Revenue Area Chart (last 7 days) */}
            {revenueChartData.length > 0 && (
              <div className="bg-card border-border rounded-xl border p-4">
                <h3 className="text-foreground mb-4 text-sm font-semibold">
                  {t.stats?.revenue || 'الإيرادات'}
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(191, 80%, 42%)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(191, 80%, 42%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: '1px solid hsl(200,20%,90%)',
                          backgroundColor: 'hsl(var(--card))',
                        }}
                        formatter={(
                          value: string | number | readonly (string | number)[] | undefined
                        ) => {
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
            )}

            {/* Orders Bar Chart */}
            <div className="bg-card border-border rounded-xl border p-4">
              <h3 className="text-foreground mb-4 text-sm font-semibold">
                {t.orders?.title || 'الطلبات'}
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersChartData}>
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: '1px solid hsl(200,20%,90%)',
                        backgroundColor: 'hsl(var(--card))',
                      }}
                      formatter={(
                        v: string | number | readonly (string | number)[] | undefined
                      ) => [`${typeof v === 'number' ? v : Number(v) || 0} طلب`, 'الطلبات']}
                    />
                    <Bar dataKey="value" fill="hsl(191, 80%, 42%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {topProducts.length > 0 && (
              <div className="bg-card border-border rounded-xl border">
                <div className="p-4 pb-3">
                  <h3 className="text-foreground text-sm font-semibold">
                    {t.stats?.topProducts || 'أكثر المنتجات مبيعاً'}
                  </h3>
                </div>
                <div className="divide-border divide-y">
                  {topProducts.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <span className="bg-primary/10 text-primary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-medium">{p.name}</p>
                        <p className="text-muted-foreground text-[11px]">{p.sales} مبيعة</p>
                      </div>
                      <span className="text-foreground text-sm font-bold whitespace-nowrap">
                        {p.revenue.toLocaleString('ar-IQ')}
                        <span className="text-muted-foreground mr-1 text-[9px]">{t.currency}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ Advanced Analytics ══ */}
            <div className="pt-2">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="text-primary h-5 w-5" />
                <h2 className="text-foreground text-base font-bold">تحليلات متقدمة</h2>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-3">
                {analyticsTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground border'
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: Governorates */}
              {/* ── pull real arrays from API with safe fallbacks ── */}
              {(() => {
                const governorateData = stats?.governorateData ?? [];
                const deviceData = stats?.deviceData ?? [];
                const deviceBrands = stats?.deviceBrands ?? [];
                const trafficSources = stats?.trafficSources ?? [];

                return (
                  <>
                    {activeTab === 'governorate' && (
                      <div className="bg-card border-border overflow-hidden rounded-2xl border">
                        <div className="border-border border-b p-4 pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-foreground text-sm font-semibold">
                                الطلبات حسب المحافظة
                              </h3>
                              <p className="text-muted-foreground mt-0.5 text-[11px]">
                                توزيع الطلبات الجغرافي
                              </p>
                            </div>
                            <div className="bg-primary/10 rounded-lg px-2.5 py-1">
                              <span className="text-primary text-[11px] font-bold">
                                {stats?.orderCount ?? 0} طلب
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2.5 p-4">
                          {governorateData.length === 0 ? (
                            <p className="text-muted-foreground py-4 text-center text-xs">
                              لا توجد طلبات بعد
                            </p>
                          ) : (
                            governorateData.map((gov, i) => (
                              <div key={gov.name}>
                                <div className="mb-1 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${i === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                                    >
                                      {i + 1}
                                    </span>
                                    <span className="text-foreground text-xs font-medium">
                                      {gov.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-[11px]">
                                      {gov.orders} طلب
                                    </span>
                                    <span className="text-foreground w-8 text-left text-[11px] font-bold">
                                      {gov.percentage}%
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-primary/70' : 'bg-primary/40'}`}
                                    style={{ width: `${gov.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tab: Devices */}
                    {activeTab === 'device' && (
                      <div className="bg-card border-border overflow-hidden rounded-2xl border">
                        <div className="border-border border-b p-4 pb-3">
                          <h3 className="text-foreground text-sm font-semibold">نوع الأجهزة</h3>
                          <p className="text-muted-foreground mt-0.5 text-[11px]">
                            الأجهزة المستخدمة لتصفح المتجر
                          </p>
                        </div>
                        <div className="p-4">
                          <div className="mb-5 flex items-center justify-center">
                            <div className="relative h-[200px] w-[200px]">
                              <PieChart width={200} height={200}>
                                <Pie
                                  data={deviceData}
                                  cx={100}
                                  cy={100}
                                  innerRadius={60}
                                  outerRadius={90}
                                  paddingAngle={4}
                                  dataKey="value"
                                  strokeWidth={0}
                                >
                                  {deviceData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                                  formatter={(
                                    v: string | number | readonly (string | number)[] | undefined,
                                    n: string | number | undefined
                                  ) => [`${typeof v === 'number' ? v : Number(v) || 0}%`, n ?? '']}
                                />
                              </PieChart>
                              {deviceData[0] && (
                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                  <Smartphone className="text-primary mb-0.5 h-5 w-5" />
                                  <span className="text-foreground text-xl font-bold">
                                    {deviceData[0].value}%
                                  </span>
                                  <span className="text-muted-foreground text-[10px]">
                                    {deviceData[0].name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {deviceData.length === 0 ? (
                            <p className="text-muted-foreground py-2 text-center text-xs">
                              لا توجد بيانات بعد
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {deviceData.map(device => {
                                const Icon = DEVICE_ICON_MAP[device.icon] ?? Smartphone;
                                return (
                                  <div
                                    key={device.name}
                                    className="bg-muted/30 flex items-center gap-3 rounded-xl p-3"
                                  >
                                    <div
                                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                                      style={{ backgroundColor: `${device.color}15` }}
                                    >
                                      <Icon className="h-4 w-4" style={{ color: device.color }} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="mb-1 flex items-center justify-between">
                                        <span className="text-foreground text-xs font-medium">
                                          {device.name}
                                        </span>
                                        <span className="text-foreground text-xs font-bold">
                                          {device.value}%
                                        </span>
                                      </div>
                                      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                                        <div
                                          className="h-full rounded-full"
                                          style={{
                                            width: `${device.value}%`,
                                            backgroundColor: device.color,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {deviceBrands.length > 0 && (
                            <div className="border-border mt-5 border-t pt-4">
                              <h4 className="text-foreground mb-3 text-xs font-semibold">
                                الأنظمة والعلامات التجارية
                              </h4>
                              <div className="space-y-2.5">
                                {deviceBrands.map(brand => (
                                  <div key={brand.name} className="flex items-center gap-3">
                                    <span className="text-foreground w-20 flex-shrink-0 truncate text-xs font-medium">
                                      {brand.name}
                                    </span>
                                    <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${brand.percentage}%`,
                                          backgroundColor: brand.color,
                                        }}
                                      />
                                    </div>
                                    <span className="text-foreground w-8 flex-shrink-0 text-left text-[11px] font-bold">
                                      {brand.percentage}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tab: Page Visits */}
                    {activeTab === 'pages' && (
                      <div className="bg-card border-border overflow-hidden rounded-2xl border">
                        <div className="border-border border-b p-4 pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-foreground text-sm font-semibold">
                                زيارات المتجر
                              </h3>
                              <p className="text-muted-foreground mt-0.5 text-[11px]">
                                إجمالي زيارات متجرك
                              </p>
                            </div>
                            <div className="rounded-lg bg-green-500/10 px-2.5 py-1">
                              <span className="text-[11px] font-bold text-green-600">
                                {visitCount.toLocaleString('ar-IQ')} زيارة
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 p-6">
                          <Eye className="text-primary h-10 w-10 opacity-70" />
                          <p className="text-foreground text-2xl font-extrabold">
                            {visitCount.toLocaleString('ar-IQ')}
                          </p>
                          <p className="text-muted-foreground text-xs">إجمالي الزيارات</p>
                          <p className="text-muted-foreground mt-1 text-[11px]">
                            {Math.round(visitCount * 0.75).toLocaleString('ar-IQ')} زائر فريد
                            تقريباً
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tab: Traffic Sources */}
                    {activeTab === 'sources' && (
                      <div className="bg-card border-border overflow-hidden rounded-2xl border">
                        <div className="border-border border-b p-4 pb-3">
                          <h3 className="text-foreground text-sm font-semibold">مصادر الزيارات</h3>
                          <p className="text-muted-foreground mt-0.5 text-[11px]">
                            من أين يأتي زبائنك
                          </p>
                        </div>
                        {trafficSources.length === 0 ? (
                          <p className="text-muted-foreground py-8 text-center text-xs">
                            لا توجد بيانات بعد
                          </p>
                        ) : (
                          <>
                            <div className="flex items-center justify-center py-4">
                              <PieChart width={200} height={200}>
                                <Pie
                                  data={trafficSources}
                                  cx={100}
                                  cy={100}
                                  innerRadius={50}
                                  outerRadius={85}
                                  paddingAngle={3}
                                  dataKey="value"
                                  strokeWidth={0}
                                >
                                  {trafficSources.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                                  formatter={(
                                    v: string | number | readonly (string | number)[] | undefined,
                                    n: string | number | undefined
                                  ) => [`${typeof v === 'number' ? v : Number(v) || 0}%`, n ?? '']}
                                />
                              </PieChart>
                            </div>
                            <div className="space-y-2 px-4 pb-4">
                              {trafficSources.map(source => (
                                <div
                                  key={source.name}
                                  className="bg-muted/30 flex items-center gap-3 rounded-xl p-3"
                                >
                                  <div
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
                                    style={{ backgroundColor: `${source.color}12` }}
                                  >
                                    {source.emoji}
                                  </div>
                                  <div className="flex-1">
                                    <div className="mb-1 flex items-center justify-between">
                                      <span className="text-foreground text-xs font-medium">
                                        {source.name}
                                      </span>
                                      <span className="text-foreground text-xs font-bold">
                                        {source.value}%
                                      </span>
                                    </div>
                                    <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${source.value}%`,
                                          backgroundColor: source.color,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </>
        )}
      </main>
    </section>
  );
}
