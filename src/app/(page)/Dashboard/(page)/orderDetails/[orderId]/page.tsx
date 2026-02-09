'use client';

import { type JSX, use, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { GrDeliver } from 'react-icons/gr';

import {
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  ShoppingBag,
  Phone,
  Package,
  Truck,
  MapPin,
  User,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CityRegionDialog from '../../../_components/Citys_and_regions';
import { Product } from '@/types/Products';
import { useSession } from 'next-auth/react';

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
  prodcuts: Product[];
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const session = useSession();
  const [openAccept, setOpenAccept] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [cityId, setCityId] = useState('');
  const [regionId, setRegionId] = useState('');
  const statusConfig: Record<
    OrderDetails['status'],
    { color: string; bgColor: string; label: string; icon: JSX.Element }
  > = {
    PENDING: {
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
      label: 'قيد المعالجة',
      icon: <Clock className="h-4 w-4" />,
    },
    CONFIRMED: {
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
      label: 'مؤكد',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    SHIPPED: {
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      label: 'تم الشحن',
      icon: <Truck className="h-4 w-4" />,
    },
    DELIVERED: {
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200',
      label: 'تم التسليم',
      icon: <Package className="h-4 w-4" />,
    },
    CANCELLED: {
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
      label: 'ملغي',
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/orders/option/${orderId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      toast.success('تم إلغاء الطلب بنجاح');
      router.back();
    } catch {
      toast.error('حدث خطأ أثناء إلغاء الطلب');
    }
  };

  const handleAccept = async () => {
    try {
      const res = await fetch(`/api/orders/option/update/${orderId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      toast.success('تم تأكيد الطلب بنجاح');
      router.back();
    } catch {
      toast.error('حدث خطأ أثناء التأكيد');
    }
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
      <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-foreground mt-4 text-xl font-semibold">لم يتم العثور على الطلب</h2>
          <p className="text-muted-foreground mt-2 text-sm">الطلب المطلوب غير موجود أو تم حذفه</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];

  return (
    <>
      <div dir="rtl" className="bg-muted/30 min-h-screen py-8 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
            <span className="hover:text-foreground cursor-pointer">الطلبات</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">تفاصيل الطلب</span>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <h1 className="text-foreground text-3xl font-bold tracking-tight">
                الطلب #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {new Date(order.createdAt).toLocaleDateString('ar-IQ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {session.data?.user.role !== 'SUPPLIER' &&
                order.items.find(p => p.product?.isFromSupplier)?.product?.isFromSupplier && (
                  <Badge className="border border-blue-500 bg-blue-50 px-4 py-2 font-medium text-blue-500">
                    يحتوي على منتجات من مورد , بأنتظار تأكيد المورد
                  </Badge>
                )}
            </div>

            <Badge
              className={`${status.bgColor} ${status.color} flex w-fit items-center gap-2 border px-4 py-2 text-sm font-medium`}
            >
              {status.icon}
              {status.label}
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="bg-card rounded-xl border">
                <div className="bg-muted/50 border-b px-6 py-4">
                  <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold">
                    <ShoppingBag className="h-5 w-5" />
                    المنتجات ({order.items.length})
                  </h2>
                </div>
                <div className="divide-y">
                  {order.items.map(item => (
                    <div key={item.id} className="hover:bg-muted/30 flex gap-4 p-6 transition">
                      <div className="bg-muted relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border">
                        {item.product?.image ? (
                          <Image
                            src={item.product.image || '/placeholder.svg'}
                            alt={item.product.name || 'منتج'}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="text-muted-foreground h-8 w-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="text-foreground font-semibold">
                            {item.product?.name || 'منتج'}
                          </h3>
                          <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-sm">
                            {item.size && (
                              <span className="bg-muted rounded-md px-2 py-1">
                                الحجم: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="bg-muted flex items-center gap-1.5 rounded-md px-2 py-1">
                                اللون:
                                <span
                                  className="inline-block h-4 w-4 rounded-full border"
                                  style={{ backgroundColor: item.color }}
                                />
                              </span>
                            )}
                            <span className="bg-muted rounded-md px-2 py-1">
                              الكمية: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-foreground mt-2 text-lg font-semibold">
                          {(item.price * item.quantity).toLocaleString()} د.ع
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap-reverse gap-3">
                {!order.items.find(p => p.product?.isFromSupplier)?.product?.isFromSupplier && (
                  <Button
                    size="lg"
                    className="bg-foreground text-background hover:bg-foreground/90 flex-1"
                    onClick={() => setOpenAccept(true)}
                  >
                    <CheckCircle className="ml-2 h-5 w-5" />
                    تأكيد الطلب
                  </Button>
                )}
                {session.data?.user.role === 'SUPPLIER' && (
                  <Button
                    size="lg"
                    className="bg-foreground text-background hover:bg-foreground/90 flex-1 cursor-pointer"
                    onClick={() => setOpenAccept(true)}
                  >
                    <CheckCircle className="ml-2 h-5 w-5" />
                    تأكيد الطلب
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="destructive"
                  className="flex-1 cursor-pointer"
                  onClick={() => setOpenCancel(true)}
                >
                  <XCircle className="ml-2 h-5 w-5" />
                  إلغاء الطلب
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl border">
                <div className="bg-muted/50 border-b px-6 py-4">
                  <h2 className="text-foreground text-lg font-semibold">ملخص الطلب</h2>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span className="text-foreground font-medium">
                      {order.total.toLocaleString()} د.ع
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="text-foreground font-medium">-</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-base font-semibold">الإجمالي</span>
                    <span className="text-foreground text-2xl font-bold">
                      {order.total.toLocaleString()} د.ع
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border">
                <div className="bg-muted/50 border-b px-6 py-4">
                  <h2 className="text-foreground text-lg font-semibold">معلومات العميل</h2>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-start gap-3">
                    <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">الاسم</p>
                      <p className="text-foreground mt-1 font-medium">{order.fullName}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Phone className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">رقم الهاتف</p>
                      <p className="text-foreground mt-1 font-medium" dir="ltr">
                        {order.phone}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">عنوان التوصيل</p>
                      <p className="text-foreground mt-1 leading-relaxed font-medium">
                        {order.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openAccept} onOpenChange={setOpenAccept}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader className="text-right">
            <DialogTitle className="text-2xl font-bold">تأكيد الطلب</DialogTitle>
            <DialogDescription className="text-base">
              يرجى التأكد من تفاصيل الطلب قبل المتابعة. سيتم إشعار العميل بالتأكيد.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 my-4 space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">رقم الطلب</span>
              <span className="font-mono text-sm font-semibold">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">العميل</span>
              <span className="font-semibold">{order.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">عدد المنتجات</span>
              <span className="font-semibold">{order.items.length}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">المبلغ الإجمالي</span>
              <span className="text-foreground text-xl font-bold">
                {order.total.toLocaleString()} د.ع
              </span>
            </div>
          </div>

          <DialogFooter className="flex flex-col flex-wrap gap-4">
            <Button
              variant={'outline'}
              onClick={handleAccept}
              className="flex-1 border border-black"
            >
              <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
              تأكيد الطلب ,والتوصيل ذاتي
            </Button>
            <Button
              variant={'ghost'}
              onClick={() => router.push(`/Dashboard/orderDetails/al-waseet/${orderId}`)}
              className="flex-1 border border-black"
            >
              <GrDeliver className="ml-2 h-4 w-4 text-green-500" />
              التوصيل مع الوسيط
            </Button>
            <Button variant="destructive" onClick={() => setOpenAccept(false)} className="flex-1">
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader className="text-right">
            <DialogTitle className="text-destructive text-2xl font-bold">إلغاء الطلب</DialogTitle>
            <DialogDescription className="text-base">
              هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>

          <div className="border-destructive/20 bg-destructive/5 my-4 space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">رقم الطلب</span>
              <span className="font-mono text-sm font-semibold">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">العميل</span>
              <span className="font-semibold">{order.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">المبلغ</span>
              <span className="text-destructive font-bold">{order.total.toLocaleString()} د.ع</span>
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button variant="outline" onClick={() => setOpenCancel(false)} className="flex-1">
              رجوع
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">
              <XCircle className="ml-2 h-4 w-4" />
              نعم، إلغاء الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
