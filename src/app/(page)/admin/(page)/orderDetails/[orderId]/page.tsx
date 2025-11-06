'use client';

import { JSX, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  ShoppingBag,
  Phone,
} from 'lucide-react';
import { IoLocationOutline } from 'react-icons/io5';
import { toast } from 'sonner';

type Product = { name?: string; image?: string };
type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product?: Product;
  size: string;
  color: string;
};
export type OrderDetails = {
  id: string;
  fullName: string;
  location: string;
  phone: string;
  createdAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const statusConfig: Record<
    OrderDetails['status'],
    { color: string; label: string; icon: JSX.Element }
  > = {
    PENDING: { color: 'bg-yellow-500', label: 'قيد المعالجة', icon: <Clock size={16} /> },
    CONFIRMED: { color: 'bg-green-500', label: 'مؤكد', icon: <CheckCircle size={16} /> },
    SHIPPED: { color: 'bg-blue-500', label: 'تم الشحن', icon: <ShoppingBag size={16} /> },
    DELIVERED: { color: 'bg-green-700', label: 'تم التسليم', icon: <CheckCircle size={16} /> },
    CANCELLED: { color: 'bg-red-500', label: 'ملغي', icon: <XCircle size={16} /> },
  };

  const deleteOrder = async () => {
    toast.custom(
      t => (
        <div className="flex w-80 flex-col gap-3 rounded-lg bg-white p-5 text-center shadow-lg">
          <span className="text-lg font-medium">هل أنت متأكد من إلغاء الطلب؟</span>
          <div className="flex justify-center gap-3">
            <button
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={async () => {
                toast.dismiss(t);
                try {
                  const res = await fetch(`/api/orders/option/${orderId}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error();
                  router.back();
                  toast.success('تم إلغاء الطلب بنجاح');
                } catch {
                  toast.error('حدث خطأ أثناء إلغاء الطلب');
                }
              }}
            >
              نعم
            </button>
            <button
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              onClick={() => toast.dismiss(t)}
            >
              لا
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const acceptOrder = async () => {
    toast.custom(
      t => (
        <div className="flex w-80 flex-col gap-3 rounded-lg bg-white p-5 text-center shadow-lg">
          <span className="text-lg font-medium">هل أنت متأكد من تأكيد الطلب؟</span>
          <div className="flex justify-center gap-3">
            <button
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              onClick={async () => {
                toast.dismiss(t);
                try {
                  const res = await fetch(`/api/orders/option/update/${orderId}`, {
                    method: 'PATCH',
                  });
                  if (!res.ok) throw new Error();
                  router.back();
                  toast.success('تم تأكيد الطلب بنجاح');
                } catch {
                  toast.error('حدث خطأ أثناء التأكيد');
                }
              }}
            >
              نعم
            </button>
            <button
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              onClick={() => toast.dismiss(t)}
            >
              لا
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/details/${orderId}`, { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data: OrderDetails = await res.json();
        setOrder(data);
      } catch {
        console.error('فشل في جلب بيانات الطلب');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!order) {
    return <div className="p-6 text-center font-bold text-red-500">لم يتم العثور على الطلب</div>;
  }

  const status = statusConfig[order.status];

  return (
    <div>
      <div dir="rtl" className="mx-auto max-w-4xl space-y-6 px-2 py-4">
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex flex-col truncate text-lg font-bold">
              <span>الطلب: {order.id.slice(0, 12)}</span>
              <span>العميل: {order.fullName}</span>
            </div>
            <Badge className={`${status.color} flex items-center gap-1 text-white`}>
              {status.icon}
              {status.label}
            </Badge>
          </div>
          <div className="space-y-2 p-4 text-sm text-gray-700 sm:text-base">
            <p className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-600" />
              <span className="font-semibold">تاريخ الطلب:</span>
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" />
              <span className="font-semibold">إجمالي الطلب:</span>
              {order.total.toLocaleString()} د.ع
            </p>
            <p className="flex items-center gap-2">
              <IoLocationOutline />
              <span className="font-semibold">العنوان:</span> {order.location}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={15} />
              <span className="font-semibold">رقم الهاتف:</span> {order.phone}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b p-4">
            <ShoppingBag size={20} className="text-gray-700" />
            <h2 className="text-lg font-bold">المنتجات</h2>
          </div>
          <div className="space-y-4 p-4">
            {order.items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border p-3 transition hover:bg-gray-50"
              >
                {/* صورة المنتج */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                  {item.product?.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name || 'منتج'}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-500">
                      لا صورة
                    </div>
                  )}
                </div>

                {/* تفاصيل المنتج */}
                <div className="flex-1 text-right">
                  <p className="font-semibold">{item.product?.name}</p>
                  <p className="text-sm">الكمية: {item.quantity}</p>
                  {/* هنا نضيف اللون والحجم إذا موجود */}
                  {item.color && (
                    <p className="text-sm">
                      اللون:{' '}
                      <span
                        className="inline-block h-4 w-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                    </p>
                  )}
                  {item.size && <p className="text-sm">الحجم: {item.size}</p>}
                </div>

                {/* السعر الإجمالي */}
                <div className="min-w-[80px] rounded bg-gray-950 px-2 py-1 text-center text-xs text-white">
                  {(item.price * item.quantity).toLocaleString()} د.ع
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* {order.status === 'PENDING' && (
          <div className="flex flex-col gap-4 md:flex-row">
            <button
              onClick={acceptOrder}
              className="flex-1 rounded-lg bg-gray-950 px-4 py-2 text-white transition hover:bg-green-700"
            >
              تأكيد الطلب
            </button>
            <button
              onClick={deleteOrder}
              className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              إلغاء الطلب
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}
