'use client';

import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Package, MapPin, Phone, User, CreditCard } from 'lucide-react';
import Loader from '../../../lib/Checkout/Loading';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LuCopy } from 'react-icons/lu';
import { CiShare1 } from 'react-icons/ci';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  discount: number;
  shippingType: string | null;
  hasReturnPolicy: string | null;
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  color: string;
  size: string;
  productId: string;
  product: Product;
};

export type PaymentOrder = {
  id: string;
  cartId: string;
  status: string;
  tranRef?: string | null;
  amount: number;
  createdAt: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  userId: string;
  storeId: string;
  email?: string | null;
  fullName: string;
  location: string;
  phone: string;
  items: OrderItem[];
  paymentOrder?: PaymentOrder | null;
};

export default function PaymentResultClient() {
  const params = useSearchParams();
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const cartId = params.get('cartId') ?? '';
  const [copied, setCopied] = useState(false);

  const {
    data: order,
    error,
    isLoading,
  } = useSWR<Order>(
    cartId ? `/api/storev2/payment/paytabs/order/get-payment/${cartId}` : null,
    fetcher
  );

  const isSuccess = respStatus === 'A' || respStatus === 'success';
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تفاصيل الطلب',
          text: `تفاصيل الطلب - ${isSuccess ? 'تمت بنجاح' : 'فشلت'}`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Failed to copy:', err);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen py-5">
      <div className="mx-auto max-w-3xl space-y-6">
        <div
          className={`rounded-lg p-8 text-center shadow-sm ${
            isSuccess
              ? 'border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
              : 'border border-red-200 bg-gradient-to-br from-red-50 to-rose-50'
          }`}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            {isSuccess ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>

          <h1 className={`mb-2 text-xl font-bold ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
            {isSuccess ? 'تمت عملية الدفع بنجاح' : 'فشلت عملية الدفع'}
          </h1>

          <p className={`text-lg ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
            {respMessage || 'تمت معالجة عملية الدفع'}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-6 sm:flex-row sm:gap-5">
            <Button
              onClick={() => handleShare()}
              variant={'outline'}
              className="w-full px-6 py-2 font-semibold sm:w-auto"
            >
              <span> شارك الطلب</span> <CiShare1 />
            </Button>

            <Button
              onClick={() => handleCopy()}
              variant={'default'}
              className="w-full px-6 py-2 font-semibold sm:w-auto"
            >
              <span>نسخ</span> <LuCopy />
            </Button>
          </div>
        </div>

        {order?.status === 'DELIVERED' && (
          <div className="bg-accent w-full rounded-lg border border-green-300 py-1">
            <div className="flex items-center justify-center">
              <Loader />
            </div>
            <div className="flex items-center justify-center font-semibold">طلبك في طريقه اليك</div>
          </div>
        )}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
            <CreditCard className="h-5 w-5" />
            تفاصيل المعاملة
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">رقم المعاملة</span>
              <span className="font-mono text-sm font-medium text-gray-900">
                {tranRef || 'غير متوفر'}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">الحالة</span>
              <span className={`font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {isSuccess ? 'نجحت' : 'فشلت'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">معرف السلة</span>
              <span className="font-mono text-sm font-medium text-gray-900">
                {cartId || 'غير متوفر'}
              </span>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-950"></div>
            <p className="mt-4 text-gray-600">جاري تحميل تفاصيل الطلب</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-center text-red-600">فشل تحميل تفاصيل الطلب</p>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-md">
               <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800">
                <User className="h-6 w-6 text-gray-700" />
                معلومات العميل
              </h2>

              <div className="space-y-5">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <p className="text-xs text-gray-500">الاسم الكامل</p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{order.fullName}</p>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <p className="text-xs text-gray-500">رقم الهاتف</p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{order.phone}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <p className="text-xs text-gray-500">موقع التسليم</p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{order.location}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t pt-4">
                <span className="text-lg font-semibold text-gray-700">المبلغ الإجمالي</span>
                <span className="text-2xl font-bold text-gray-900">
                  {order.total.toLocaleString()} دينار
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
                <Package className="h-5 w-5" />
                منتجات الطلب ({order.items?.length || 0})
              </h2>

              <div className="space-y-4">
                {order.items?.length ? (
                  order.items.map(item => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-sm"
                    >
                      {item.product?.image && (
                        <img
                          src={item.product.image || '/placeholder.svg'}
                          alt={item.product.name}
                          className="h-24 w-24 rounded-lg object-cover shadow-sm"
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span>
                            السعر:{' '}
                            <span className="font-medium text-gray-900">
                              {item.product?.price.toLocaleString()} دينار
                            </span>
                          </span>
                          <span>
                            الكمية:{' '}
                            <span className="font-medium text-gray-900">{item.quantity}</span>
                          </span>
                          {item.color && (
                            <span>
                              اللون:
                              <div
                                className="ml-1 inline-block h-4 w-4 rounded-full border"
                                style={{ backgroundColor: item.color }}
                              ></div>
                            </span>
                          )}
                          {item.size && (
                            <span>
                              المقاس: <span className="font-medium text-gray-900">{item.size}</span>
                            </span>
                          )}
                        </div>

                        <p className="mt-2 font-semibold text-gray-900">
                          المجموع الفرعي:{' '}
                          {((item.product?.price || 0) * item.quantity).toLocaleString()} دينار
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-gray-500">لا توجد منتجات في هذا الطلب</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
