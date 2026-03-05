'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { AlertCircle, DollarSign, Package, Plus, ShoppingBag, Sparkles, Users } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Order } from '@/types/Products';
import { useLanguage } from './context/LanguageContext';
import { useStoreProvider } from './context/StoreContext';
import { useDashboardData } from './context/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import StatCard, { StatCardProps } from './_components/cards/StatCard';
import RevenueHeroCard from './_components/cards/RevenueHeroCard';
import QuickActionsGrid from './_components/cards/QuickActionsGrid';
import UrlCard from './_components/cards/UrlCard';
import PlanCard from './_components/cards/PlanCard';
import RecentOrdersPanel from './_components/cards/RecentOrdersPanel';
import { OrderDetails } from '../Test-Mode/Dashboard/(page)/orderDetails/[orderId]/page';
import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ProfitResponse = {
  totalAmount: number;
};

export default function Dashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { currentStore } = useStoreProvider();

  const { data, loading } = useDashboardData(userId);

  const fetcher = (url: string) => fetch(url).then(res => res.json());

  const { data: latestOrder } = useSWR<OrderDetails[]>(
    userId ? `/api/orders/latest/${userId}` : null,
    fetcher
  );

  const { data: profit, isLoading: profitLoading } = useSWR<ProfitResponse>(
    currentStore?.id ? `/api/dashboard/profit/total-profit-dashboard/${currentStore.id}` : null,
    fetcher
  );

  const { data: visited } = useSWR(
    currentStore?.subLink ? `/api/visit/${currentStore?.subLink}` : null,
    fetcher
  );

  const { data: pendingData } = useSWR<Order[]>(
    currentStore?.id ? `/api/dashboard/order/pending/${currentStore.id}` : null,
    fetcher,
    { refreshInterval: 1000, revalidateOnFocus: true }
  );

  if (status !== 'authenticated' || loading || !data) {
    return (
      <section dir="rtl" className="bg-muted flex min-h-screen flex-col p-4">
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-4 px-2 py-6">
          <Skeleton className="bg-muted h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="bg-muted h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="bg-muted h-20 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="bg-muted h-52 rounded-2xl" />
            <Skeleton className="bg-muted h-52 rounded-2xl" />
          </div>
          <Skeleton className="bg-muted h-40 rounded-2xl" />
        </main>
      </section>
    );
  }

  const storeUrl = `https://${currentStore?.subLink}.matager.store`;

  const stats: StatCardProps[] = [
    {
      title: t.inventory.products,
      value: `${data.productCount}`,
      icon: <Package size={15} />,
      href: '/Dashboard/ProductManagment',
    },
    {
      title: t.home?.visitors || 'الزيارات',
      value: `${visited?.count ?? 0}`,
      icon: <Users size={15} />,
    },

    {
      title: t.orders.title,
      value: pendingData?.length ?? 0,
      icon: <ShoppingBag size={15} />,
      href: '/Dashboard/OrderTrackingPage',
    },
  ];

  return (
    <section dir="rtl" className="min-h-screen">
      <main className="flex-1 space-y-4 px-1 py-2 pb-10">
        {data.productCount === 0 && (
          <div className="from-primary/10 via-primary/5 border-primary/20 relative overflow-hidden rounded-2xl border bg-gradient-to-l to-transparent p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                <AlertCircle className="text-primary h-5 w-5" />
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1 text-right">
                  <h3 className="text-foreground text-sm font-bold">{t.home.addFirstProduct}</h3>
                  <p className="text-muted-foreground mt-0.5 text-[11px] leading-relaxed">
                    {t.home.addFirstProductDesc}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  onClick={() => router.push('Dashboard/ProductManagment/add-product')}
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.home.addProductNow}
                </Button>
              </div>
            </div>
          </div>
        )}
        <RevenueHeroCard
          totalAmount={profit?.totalAmount ?? 0}
          isLoading={profitLoading}
          changePercent={12.5}
        />

        <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
          {stats.map((item, idx) => (
            <StatCard key={idx} {...item} />
          ))}
        </div>

        <QuickActionsGrid />

        <PlanCard />

        <RecentOrdersPanel orders={latestOrder ?? []} />
      </main>
    </section>
  );
}
