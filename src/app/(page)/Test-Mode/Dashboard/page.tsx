'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { CiTimer } from 'react-icons/ci';
import { useDashboardData } from './context/useDashboardData';
import StatCard, { StatCardProps } from './_components/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import UrlCard from './_components/UrlCard';
import Image from 'next/image';
import PlanCard from './_components/PlanCard';

export type OrderStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';

export interface OrderDetails {
  id: string;
  fullName: string;
  location: string;
  status: OrderStatus;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data, loading } = useDashboardData(userId);
  const { data: latestOrder } = useSWR<OrderDetails[]>(
    userId ? `/api/orders/latest/${userId}` : null,
    (url: string | URL | Request) => fetch(url).then(res => res.json())
  );

  if (loading) {
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
  const fakeOrders: OrderDetails[] = [
    {
      id: 'fake-1',
      fullName: 'أحمد محمد',
      location: 'بغداد - الكرادة',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'fake-2',
      fullName: 'زينب علي',
      location: 'النجف',
      status: 'CONFIRMED',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'fake-3',
      fullName: 'حسن كريم',
      location: 'البصرة',
      status: 'CONFIRMED',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  const storeUrl = `https://dropwave1.matager.store`;

  const stats: StatCardProps[] = [
    {
      title: 'المنتجات',
      value: '12',
      icon: <Package size={18} />,
      desc: '+11.01%',
      href: '/Dashboard/ProductManagment',
      variant: 'gray',
    },
    {
      title: 'الزيارات',
      value: '142',
      icon: <Users size={18} />,
      desc: '+0.03%',
      variant: 'black',
    },
    {
      title: 'العوائد$',
      value: `${formatIQD(45000)}`,
      icon: <DollarSign size={18} />,
      desc: '+0.09%',
      href: `/Dashboard/profit/`,
      variant: 'gray',
    },
    {
      title: 'الطلبات',
      value: 7,
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
      {/* <div className="flex items-center justify-center pb-2 text-center"></div> */}
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
              {fakeOrders.map(order => (
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
              ))}

              {(!latestOrder || latestOrder.length === 0) && (
                <p className="pt-3 text-center text-xs text-gray-400">
                  بيانات تجريبية لعرض شكل الطلبات
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
