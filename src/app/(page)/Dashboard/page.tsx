'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'sonner';
import { VscEye } from 'react-icons/vsc';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { AiOutlineProduct } from 'react-icons/ai';
import { BsShop } from 'react-icons/bs';
import { FiCopy, FiEdit2 } from 'react-icons/fi';
import { HiOutlineLink } from 'react-icons/hi';
import { CiTimer } from 'react-icons/ci';
import { useDashboardData } from './_utils/useDashboardData';
import StatCard, { StatCardProps } from './_components/StatCard';
import ManagementCard from './_components/ManagementCard';
import MonthlyTargetCard from '@/components/Target';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { OrderDetails } from './(page)/orderDetails/[orderId]/page';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data, loading } = useDashboardData(userId);
  const { data: latestOrder } = useSWR<OrderDetails[]>(
    userId ? `/api/orders/latest/${userId}` : null,
    (url: string | URL | Request) => fetch(url).then(res => res.json())
  );
  useEffect(() => {
    if (status === 'loading' || loading) return;

    if (status === 'unauthenticated') {
      router.push('https://login.sahlapp.io');
    }
  }, [status, loading, data, router, session]);

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
  const storeSubLink = data.storeSlug?.subLink ?? null;
  if (storeSubLink == null) {
    router.push('/Dashboard/create-store');
  }
  const storeUrl = `https://${storeSubLink}.sahlapp.io`;

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
      <div
        dir="ltr"
        className="flex items-center justify-between rounded-lg border border-gray-200 px-2 py-2"
      >
        <div className="text-gray-black flex items-center gap-1 text-sm">
          <HiOutlineLink size={18} className="text-gray-500" />
          <span
            className="max-w-[200px] truncate text-sm select-text md:max-w-3xs"
            title={storeUrl}
          >
            {storeUrl}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push('/Dashboard/setting/store')}
            className="rounded-full p-1.5 hover:bg-gray-200"
          >
            <FiEdit2 size={16} />
          </button>
          <button onClick={copyToClipboard} className="rounded-full p-1.5 hover:bg-gray-200">
            <FiCopy size={16} />
          </button>
          <button
            onClick={() => router.push(storeUrl)}
            className="rounded-full p-1.5 hover:bg-gray-200"
          >
            <VscEye size={20} />
          </button>
        </div>
      </div>

      <div dir="rtl" className="flex min-h-screen flex-col bg-white py-2">
        <main className="flex-1 space-y-8 py-1">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((item, idx) => (
              <StatCard key={idx} {...item} />
            ))}
          </div>

          <div className="block md:hidden">
            <MonthlyTargetCard target={data.orderDone} fullTarget={9} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ManagementCard
              title="إدارة المنتجات والمتجر"
              description="تحكم كامل بالمنتجات (حذف، تعديل، إضافة، خصم)"
              button1Text="ادارة"
              button1Icon={<AiOutlineProduct />}
              button1Variant="default"
              onButton1Click={() => router.push('/Dashboard/ProductManagment')}
              button2Text="تصفح منتجات الموردين"
              button2Icon={<BsShop />}
              button2Variant="outline"
            />

            <div className="hidden md:block">
              <MonthlyTargetCard target={data.orderCount} fullTarget={9} />
            </div>
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
