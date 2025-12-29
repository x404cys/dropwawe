'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { CiTimer } from 'react-icons/ci';
import { useDashboardData } from './_utils/useDashboardData';
import StatCard, { StatCardProps } from './_components/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderDetails } from './(page)/orderDetails/[orderId]/page';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import UrlCard from './_components/UrlCard';
import Image from 'next/image';
import PlanCard from './_components/PlanCard';
import { useEffect } from 'react';
import { LuTestTubeDiagonal } from 'react-icons/lu';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data, loading } = useDashboardData(userId);
  const { data: latestOrder } = useSWR<OrderDetails[]>(
    userId ? `/api/orders/latest/${userId}` : null,
    (url: string | URL | Request) => fetch(url).then(res => res.json())
  );
  try {
    useEffect(() => {
      if (status === 'loading' || loading) return;

      if (status === 'unauthenticated') {
        router.push('https://login.dropwave.cloud');
      }
    }, [status, loading, data, router, session]);
  } catch (e) {
    toast.error('unthenticated');
  }

  if (status !== 'authenticated' || loading || !data) {
    return (
      <section dir="rtl" className="flex min-h-screen flex-col bg-white p-4">
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-2 py-9">
          <Skeleton className="h-6 w-48 rounded-md bg-gray-300" />
          <div className="grid grid-cols-3 gap-6 text-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg bg-gray-300" />
            ))}
          </div>
        </main>
      </section>
    );
  }
  if (data?.storeSlug === null) {
    router.push('/Dashboard/create-store');
  }

  const storeUrl = `https://${data.storeSlug?.subLink}.dropwave.cloud`;

  const stats: StatCardProps[] = [
    {
      title: 'المنتجات',
      value: `${data.productCount}`,
      icon: <Package size={18} />,
      desc: '+11.01%',
      href: '/Dashboard/ProductManagment',
      variant: 'gray',
    },
    {
      title: 'الزيارات',
      value: `${data.visitTotal ?? 0}`,
      icon: <Users size={18} />,
      desc: '+0.03%',
      variant: 'black',
    },
    {
      title: 'العوائد$',
      value: `${formatIQD(data.profit)}`,
      icon: <DollarSign size={18} />,
      desc: '+0.09%',
      href: `/Dashboard/profit/`,
      variant: 'gray',
    },
    {
      title: 'الطلبات',
      value: data.orderCount,
      icon: <ShoppingBag size={18} />,
      desc: '+2.10%',
      href: '/Dashboard/OrderTrackingPage',
      variant: 'gray',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      toast.success(`تم نسخ الرابط إلى الحافظة! \n${storeUrl}`);
    } catch (err) {
      console.error('فشل نسخ الرابط:', err);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-center pb-2 text-center">
        <span className="flex items-center justify-between gap-2 rounded-full border border-sky-300 bg-sky-200 px-8 py-0.5 text-xs">
          {/* <LuTestTubeDiagonal className="mr-2" /> */}
          <Image className="" src={'/blood-test.gif'} width={18} height={18} alt="e" />
          <span> تجريبي</span>
        </span>
      </div>
      <div dir="rtl" className="flex min-h-screen flex-col">
        <main className="flex-1 space-y-4 py-1">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((item, idx) => (
              <StatCard key={idx} {...item} />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <UrlCard
              storeUrl={storeUrl}
              storeName={data.storeSlug?.name || 'متجري'}
              theme={data.storeSlug?.theme || 'MODERN'}
              copyToClipboard={copyToClipboard}
            />
            <PlanCard />
          </div>

          <div className="mx-auto w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">
              <h2 className="text-center text-base font-semibold text-gray-900 md:text-end">
                الطلبات الأخيرة
              </h2>
              <CiTimer className="text-lg font-bold text-gray-700" />
            </div>

            <div className="w-full divide-y divide-gray-200">
              {latestOrder && latestOrder.length > 0 ? (
                latestOrder.map(order => (
                  <div key={order.id} className="rounded-lg px-2 py-3 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">{order.fullName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-xs font-medium text-gray-700">{order.location}</span>
                      <span
                        className={`rounded-full px-4 py-0.5 text-xs font-semibold ${
                          order.status === 'CONFIRMED'
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {order.status === 'CONFIRMED' ? 'مكتملة' : 'قيد التنفيذ'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2a4 4 0 014-4h3m4 0h-3a4 4 0 00-4 4v2m-4 0v-2a4 4 0 014-4h3m4 0h-3a4 4 0 00-4 4v2m-4 0h.01"
                    />
                  </svg>
                  <p className="mt-2 text-sm">لا توجد طلبات حديثة</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
