'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { AlertCircle, DollarSign, Package, Plus, ShoppingBag, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
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
import { type OrderDetails } from './_types/order-details';
import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

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
      <section dir="rtl" className="flex min-h-screen flex-col p-4">
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-4 px-2 py-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="md:grid0-cols-4 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-52 rounded-2xl" />
          </div>
          <Skeleton className="h-40 rounded-2xl" />
        </main>
      </section>
    );
  }

  const storeUrl = `https://${currentStore?.subLink}.matager.store`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success(t.home?.linkCopied || 'تم نسخ الرابط');
  };

  const stats: StatCardProps[] = [
    {
      title: t.inventory.products,
      value: `${data.productCount}`,
      icon: <Package />,
      href: '/Dashboard/ProductManagment',
      change: 1.1,
    },
    {
      title: t.home?.visitors || 'الزوار',
      value: `${visited?.count ?? 0}`,
      icon: <Users className="h-4 w-4" />,
    },

    {
      title: t.orders.title,
      value: pendingData?.length ?? 0,
      icon: <ShoppingBag />,
      href: '/Dashboard/OrderTrackingPage',
      change: 8.3,
    },
    {
      title: t.home.revenue,
      value: formatIQD(profit?.totalAmount ?? 0),
      icon: <DollarSign />,
    },
  ];

  return (
    <>
      {data.productCount === 0 && (
        <div
          dir="rtl"
          className="from-primary/10 via-primary/5 border-primary/20 relative mx-2 mt-2 overflow-hidden rounded-2xl border bg-gradient-to-l to-transparent p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
              <AlertCircle className="text-primary h-5 w-5" />
            </div>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1 text-right">
                <h3 className="text-foreground text-sm font-bold">{t.home.addFirstProduct}</h3>
                <p className="te-foreground mt-0.5 text-[11px] leading-relaxed">
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
      <section dir="rtl" className="min-h-screen px-1 md:hidden">
        <main className="flex-1 space-y-4 px-1 py-2 pb-10">
          <div id="mobile-revenue-card">
            <RevenueHeroCard />
          </div>

          <div id="mobile-stats-cards" className="grid grid-cols-3 gap-3">
            {stats.slice(0, 3).map((item, idx) => (
              <StatCard key={idx} {...item} />
            ))}
          </div>

          <div id="mobile-quick-actions">
            <QuickActionsGrid />
          </div>

          <div id="mobile-plan-card">
            <PlanCard />
          </div>
          <UrlCard
            storeUrl={storeUrl}
            copyToClipboard={handleCopyUrl}
            theme={currentStore?.theme || ''}
            storeName={currentStore?.name || ''}
          />
          <div id="mobile-recent-orders">
            <RecentOrdersPanel orders={latestOrder ?? []} />
          </div>

          {data.productCount > 0 && (
            <div className="bg-card border-border rounded-xl border">
              <div className="flex items-center justify-between p-4 pb-3">
                <h2 className="text-foreground text-sm font-semibold">{t.home.recentProducts}</h2>
                <button
                  onClick={() => router.push('/Dashboard/ProductManagment')}
                  className="text-primary cursor-pointer text-xs font-medium"
                >
                  {t.home.viewAll}
                </button>{' '}
              </div>
              <div className="divide-border divide-y">
                {data?.lastProducts?.map(p => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="bg-muted h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={`${p.image || ''}`}
                        alt={p.name}
                        width={25}
                        height={25}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium" title={p.name}>
                        {p.name.split(' ').slice(0, 2).join(' ')}
                      </p>
                      <p className="text-muted-foreground truncate text-[11px]" title={p.category}>
                        {p.category.split(' ')[0]}
                      </p>
                    </div>

                    <span className="text-foreground text-sm font-bold whitespace-nowrap">
                      {formatIQD(p.discount ? p.price - (p.price * p.discount) / 100 : p.price)}

                      <span className="text-muted-foreground mr-0.5 text-[9px]">{t.currency}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </section>

      <section dir="rtl" className="hidden min-h-screen overflow-hidden md:block">
        <main className="flex-1 space-y-4 px-1 py-2 pb-10">
          <div id="desktop-stats-cards" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((item, idx) => (
              <StatCard key={idx} {...item} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div id="desktop-plan-card">
                <PlanCard />
              </div>

              <div id="desktop-revenue-card">
                <RevenueHeroCard />
              </div>

              <div id="desktop-recent-orders">
                <RecentOrdersPanel orders={latestOrder ?? []} />
              </div>
            </div>

            <div className="space-y-4 lg:col-span-1">
              <div id="desktop-url-card">
                <UrlCard
                  storeUrl={storeUrl}
                  copyToClipboard={handleCopyUrl}
                  theme={currentStore?.theme || ''}
                  storeName={currentStore?.name || ''}
                />
              </div>

              <div id="desktop-quick-actions">
                <QuickActionsGrid />
              </div>

              {data.productCount > 0 && (
                <div className="bg-card border-border rounded-xl border">
                  <div className="flex items-center justify-between p-4 pb-3">
                    <h2 className="text-foreground text-sm font-semibold">
                      {t.home.recentProducts}
                    </h2>
                    <button
                      onClick={() => router.push('/Dashboard/ProductManagment')}
                      className="text-primary cursor-pointer text-xs font-medium"
                    >
                      {t.home.viewAll}
                    </button>
                  </div>
                  <div className="divide-border divide-y">
                    {data?.lastProducts?.map(p => (
                      <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="bg-muted h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={`${p.image || ''}`}
                            alt={p.name}
                            width={25}
                            height={25}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="text-foreground truncate text-sm font-medium"
                            title={p.name}
                          >
                            {p.name.split(' ').slice(0, 2).join(' ')}
                          </p>
                          <p
                            className="text-muted-foreground truncate text-[11px]"
                            title={p.category}
                          >
                            {p.category.split(' ')[0]}
                          </p>
                        </div>

                        <span className="text-foreground text-sm font-bold whitespace-nowrap">
                          {formatIQD(p.discount ? p.price - (p.price * p.discount) / 100 : p.price)}
                          <span className="text-muted-foreground mr-0.5 text-[9px]">
                            {t.currency}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
