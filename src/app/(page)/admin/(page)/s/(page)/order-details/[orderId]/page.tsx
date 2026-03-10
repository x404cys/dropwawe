'use client';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { CheckCircle2, DollarSign, MapPin, Package, Phone, User } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import OrderActions from '../OrderActions';
import axios from 'axios';
import { Order } from '@/types/Products';
import useSWR from 'swr';

interface Props {
  params: { orderId: string };
}
const fetcher = (url: string) => axios.get(url, { timeout: 10000 }).then(res => res.data);
const steps = [
  { label: 'تم استلام الطلب', state: 'RECEIVED', color: 'bg-blue-500' },
  { label: 'في الانتظار', state: 'PENDING', color: 'bg-yellow-400' },
  { label: 'قيد التجهيز', state: 'PREPARING', color: 'bg-orange-500' },
  { label: 'تم الشحن', state: 'SHIPPED', color: 'bg-indigo-500' },
  { label: 'تم التوصيل', state: 'DELIVERED', color: 'bg-green-500' },
  { label: 'تم التأكيد', state: 'CONFIRMED', color: 'bg-cyan-500' },
  { label: 'ملغي', state: 'CANCELED', color: 'bg-gray-400' },
];
export default function OrderDetailsPage({ params }: Props) {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading } = useSWR<Order>(`/api/orders/for-client/${orderId}`, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000,
    revalidateOnMount: true,
  });
  if (isLoading) {
    return <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-500">.... </div>;
  }
  return (
    <div dir="rtl" className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-3 rounded-2xl border border-black/30 bg-white p-6 shadow-md">
          <CheckCircle2 className="h-8 w-8 text-sky-500" />
          <div>
            <h1 className="text-xl font-bold text-black">تم استلام طلبك</h1>
            <p className="text-sm text-black/60">
              رقم الطلب: <span className="font-semibold">{order?.id.slice(0, 8)}</span>
            </p>
          </div>
          <span className="ml-auto font-bold text-black/80">{order?.status}</span>
        </div>
        <div className="w-full rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-md mb-4 flex items-center gap-2 font-semibold text-black">
            <CheckCircle2 className="h-4 w-4 text-sky-500" />
            حالة الطلب
          </h2>

          <div className="relative flex w-full flex-col gap-6">
            {[
              { label: 'تم الاستلام', state: 'RECEIVED', color: 'bg-blue-500' },
              { label: 'في الانتظار', state: 'PENDING', color: 'bg-yellow-500' },
              { label: 'قيد التجهيز', state: 'PROCESSING', color: 'bg-orange-500' },
              { label: 'تم الشحن', state: 'SHIPPED', color: 'bg-indigo-500' },
              { label: 'تم التوصيل', state: 'DELIVERED', color: 'bg-green-500' },
              { label: 'تم التأكيد', state: 'CONFIRMED', color: 'bg-green-600' },
              { label: 'ملغي', state: 'CANCELLED', color: 'bg-red-500' },
            ].map((step, index, arr) => {
              const currentIndex = arr.findIndex(s => s.state === order?.status);
              const isCompleted = index === currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.state} className="relative flex items-start gap-3">
                  {index !== arr.length - 1 && (
                    <div
                      className={`absolute top-6 left-[9px] h-full w-[2px] ${isCompleted ? step.color : 'bg-gray-300'}`}
                      style={{ zIndex: 0 }}
                    />
                  )}

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isCompleted ? step.color : 'border-gray-300 bg-white'} ${isCurrent ? 'ring-2 ring-sky-300' : ''}`}
                  >
                    {isCompleted && !isCurrent && step.state !== 'CANCELLED' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2.5 w-2.5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {step.state === 'CANCELLED' && (
                      <span className="text-[10px] font-bold text-white">X</span>
                    )}
                  </div>

                  <span
                    className={`mt-0.5 text-[10px] ${isCurrent ? 'font-semibold text-black' : 'text-black/60'}`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-black/30 bg-white p-6 shadow-md">
          <h2 className="flex items-center gap-2 text-lg font-bold text-black">
            <User className="h-5 w-5 text-sky-500" />
            معلومات العميل
          </h2>
          <div className="flex justify-between">
            <span className="text-black/60">الاسم</span>
            <span className="font-semibold">{order?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-black/60">
              <Phone className="h-4 w-4" />
              الهاتف
            </span>
            <span className="font-semibold">{order?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-black/60">
              <MapPin className="h-4 w-4" />
              العنوان
            </span>
            <span className="font-semibold">{order?.location}</span>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-black/30 bg-white p-6 shadow-md">
          <h2 className="flex items-center gap-2 text-lg font-bold text-black">
            <Package className="h-5 w-5 text-sky-500" />
            المنتجات
          </h2>
          <div className="space-y-3">
            {order?.items?.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-black/20 p-4"
              >
                <div>
                  <p className="font-semibold text-black">{item.product?.name}</p>
                  <p className="text-sm text-black/60">الكمية: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">
                    {formatIQD(item.price * item.quantity)} د.ع
                  </p>
                  <p className="text-xs text-black/50">{item.price} للوحدة</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-500 bg-white p-6 shadow-md">
          <h2 className="flex items-center gap-2 text-lg font-bold text-black">
            <DollarSign className="h-5 w-5 text-sky-500" />
            الإجمالي
          </h2>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-sm text-black/60">المبلغ المطلوب دفعه</span>
            <span className="text-2xl font-extrabold text-sky-600">
              {formatIQD(order?.total)} د.ع
            </span>
          </div>
        </div>
        <OrderActions orderId={order?.id as string} />
      </div>
    </div>
  );
}
