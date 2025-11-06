'use client';

import useSWR from 'swr';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  Bell,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { ElementType } from 'react';

type DashboardData = {
  totalUsers: number;
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  ordersByStatus: { status: string; _count: { status: number } }[];
  totalSales: number;
  topProducts: { productId: string; _sum: { quantity: number } }[];
  visitorsCount: number;
  notificationsCount: number;
  productsByStore: { id: string; name: string; _count: { products: number }; subLink: string }[];
  productsByCategory: { category: string; _count: { category: number } }[];
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Dashboard() {
  const { data, error, isLoading } = useSWR<DashboardData>('/api/admin/overview/stats', fetcher);

  if (isLoading)
    return (
      <div className="bg-background min-h-screen w-full p-6">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-6">
        <p className="text-destructive text-lg">خطأ في تحميل البيانات</p>
      </div>
    );

  return (
    <div dir="rtl" className="bg-background min-h-screen w-full p-6">
      <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="المستخدمين" value={data?.totalUsers || 0} icon={Users} />
        <StatCard title="المتاجر" value={data?.totalStores || 0} icon={Store} />
        <StatCard title="المنتجات" value={data?.totalProducts || 0} icon={Package} />
        <StatCard title="الطلبات" value={data?.totalOrders || 0} icon={ShoppingCart} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="إجمالي المبيعات"
          value={data?.totalSales || 0}
          currency
          icon={DollarSign}
        />
        <StatCard title="الزوار" value={data?.visitorsCount || 0} icon={Eye} />
        <StatCard title="الإشعارات" value={data?.notificationsCount || 0} icon={Bell} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <OrdersByStatusChart ordersByStatus={data?.ordersByStatus || []} />
        <ProductsByCategoryChart productsByCategory={data?.productsByCategory || []} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TopProducts topProducts={data?.topProducts || []} />
        <ProductsByStore productsByStore={data?.productsByStore || []} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  currency,
  icon: Icon,
}: {
  title: string;
  value: number;
  currency?: boolean;
  icon: ElementType;
}) {
  return (
    <div className="group bg-card rounded-xl border p-6 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground mb-2 text-sm font-medium">{title}</p>
          <p className="text-foreground text-2xl font-bold">
            {currency ? `${value.toLocaleString()} د.ع` : value.toLocaleString()}
          </p>
        </div>
        <div className="bg-muted/50 group-hover:bg-muted rounded-lg p-3 transition-colors">
          <Icon className="text-muted-foreground h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function OrdersByStatusChart({
  ordersByStatus,
}: {
  ordersByStatus: DashboardData['ordersByStatus'];
}) {
  const chartData = ordersByStatus.map(o => ({
    name: o.status,
    count: o._count.status,
  }));

  return (
    <div className="bg-card max-h-[70vh] rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center">
        <div className="bg-muted/50 mr-3 rounded-lg p-2">
          <BarChart3 className="text-muted-foreground h-5 w-5" />
        </div>
        <h2 className="text-foreground text-xl font-semibold">الطلبات حسب الحالة</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar dataKey="count" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProductsByCategoryChart({
  productsByCategory,
}: {
  productsByCategory: DashboardData['productsByCategory'];
}) {
  return (
    <div className="bg-card max-h-[70vh] overflow-y-scroll rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center">
        <div className="bg-muted/50 mr-3 rounded-lg p-2">
          <Package className="text-muted-foreground h-5 w-5" />
        </div>
        <h2 className="text-foreground text-xl font-semibold">المنتجات حسب الفئة</h2>
      </div>

      <div className="space-y-3">
        {productsByCategory.map((category, index) => (
          <div
            key={index}
            className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg px-4 py-3 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-muted mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                <Package className="text-muted-foreground h-4 w-4" />
              </div>
              <span className="text-foreground font-medium">{category.category}</span>
            </div>
            <span className="bg-background text-foreground rounded-full border px-3 py-1 text-sm font-bold">
              {category._count.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopProducts({ topProducts }: { topProducts: DashboardData['topProducts'] }) {
  return (
    <div className="bg-card max-h-[70vh] overflow-y-scroll rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center">
        <div className="bg-muted/50 mr-3 rounded-lg p-2">
          <TrendingUp className="text-muted-foreground h-5 w-5" />
        </div>
        <h2 className="text-foreground text-xl font-semibold">أفضل المنتجات</h2>
      </div>
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div
            key={product.productId}
            className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg px-4 py-3 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-muted mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                <Package className="text-muted-foreground h-4 w-4" />
              </div>
              <span className="text-foreground font-medium">منتج {product.productId}</span>
            </div>
            <span className="bg-background text-foreground rounded-full border px-3 py-1 text-sm font-bold">
              {product._sum.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsByStore({
  productsByStore,
}: {
  productsByStore: DashboardData['productsByStore'];
}) {
  return (
    <div className="bg-card max-h-[70vh] overflow-y-scroll rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center">
        <div className="bg-muted/50 mr-3 rounded-lg p-2">
          <Store className="text-muted-foreground h-5 w-5" />
        </div>
        <h2 className="text-foreground text-xl font-semibold">المنتجات حسب المتجر</h2>
      </div>
      <div className="space-y-3">
        {productsByStore.map((store, index) => (
          <div
            key={store.id}
            className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg px-4 py-3 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-muted mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                <Store className="text-muted-foreground h-4 w-4" />
              </div>
              <span className="text-foreground font-medium">{store.subLink}</span>
            </div>
            <span className="bg-background text-foreground rounded-full border px-3 py-1 text-sm font-bold">
              {store._count.products}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
