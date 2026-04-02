'use client';

import { useLanguage } from '../../../context/LanguageContext';
import { type JSX, type ReactNode, useEffect, useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Mail,
  CreditCard,
  Store as StoreIcon,
  TicketPercent,
  Hash,
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
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import axios from 'axios';
import { SubscriptionResponse } from '@/types/users/User';
import {
  type CouponDetails,
  type OrderDetails,
  type OrderStatus,
} from '../../../_types/order-details';

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border">
      <div className="bg-muted/50 border-b px-6 py-4">
        <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold">
          {icon}
          {title}
        </h2>
      </div>
      <div className="space-y-4 p-6">{children}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueDir,
  strong,
}: {
  label: string;
  value?: ReactNode;
  valueDir?: 'rtl' | 'ltr' | 'auto';
  strong?: boolean;
}) {
  if (value === null || value === undefined || value === '') return null;

  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div
        dir={valueDir}
        className={`text-foreground max-w-[65%] text-end break-words ${
          strong ? 'font-semibold' : 'font-medium'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const { t, lang, dir } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const session = useSession();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAccept, setOpenAccept] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const locale = lang === 'en' ? 'en-US' : 'ar-IQ';
  const BreadcrumbIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const hasSupplierProducts = !!order?.items.some(item => item.product?.isFromSupplier);
  const confirmActionLabel =
    order?.status === 'SHIPPED' ? t.orders.confirmDelivery : t.orders.confirmOrder;

  const statusConfig: Record<
    OrderStatus,
    { color: string; bgColor: string; label: string; icon: JSX.Element }
  > = {
    PENDING: {
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
      label: t.orders.processing,
      icon: <Clock className="h-4 w-4" />,
    },
    PAYMENT_PENDING: {
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50 border-yellow-200',
      label: t.orders.paymentPending,
      icon: <CreditCard className="h-4 w-4" />,
    },
    CONFIRMED: {
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
      label: t.orders.confirmed,
      icon: <CheckCircle className="h-4 w-4" />,
    },
    SHIPPED: {
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      label: t.orders.transit,
      icon: <Truck className="h-4 w-4" />,
    },
    DELIVERED: {
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200',
      label: t.orders.completed,
      icon: <Package className="h-4 w-4" />,
    },
    PAYMENT_FAILED: {
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
      label: t.orders.paymentFailed,
      icon: <XCircle className="h-4 w-4" />,
    },
    CANCELLED: {
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
      label: t.orders.cancelled,
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  const fetchSubscription = (url: string) =>
    axios.get(url, { timeout: 10000 }).then(res => res.data);

  const { data: subscriptionData } = useSWR<SubscriptionResponse>(
    '/api/plans/subscriptions/check',
    fetchSubscription,
    {
      revalidateOnFocus: true,
      refreshInterval: 5000,
      revalidateOnMount: true,
    }
  );

  const formatAmount = (amount?: number | null, currency = t.currency) =>
    amount === null || amount === undefined ? '-' : `${amount.toLocaleString(locale)} ${currency}`;

  const formatDateTime = (value?: string | null) =>
    value
      ? new Date(value).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

  const formatPaymentMethod = (value?: string | null) => {
    if (!value) return null;
    const normalized = value.trim().toUpperCase();

    if (
      normalized.includes('COD') ||
      normalized.includes('CASH') ||
      normalized.includes('DELIVERY')
    ) {
      return t.orders.cashOnDelivery;
    }

    if (
      normalized.includes('ONLINE') ||
      normalized.includes('CARD') ||
      normalized.includes('PAY') ||
      normalized.includes('ELECTRONIC')
    ) {
      return t.orders.electronicPayment;
    }

    return value;
  };

  const formatOrderStatusLabel = (value?: OrderStatus | null) => {
    if (!value) return null;

    switch (value) {
      case 'PENDING':
        return t.orders.processing;
      case 'PAYMENT_PENDING':
        return t.orders.paymentPending;
      case 'CONFIRMED':
        return t.orders.confirmed;
      case 'SHIPPED':
        return t.orders.transit;
      case 'DELIVERED':
        return t.orders.completed;
      case 'PAYMENT_FAILED':
        return t.orders.paymentFailed;
      case 'CANCELLED':
        return t.orders.cancelled;
      default:
        return value;
    }
  };

  const formatPaymentStatusLabel = (value?: string | null) => {
    if (!value) return null;

    const normalized = value.trim().toUpperCase();

    switch (normalized) {
      case 'PAYMENT_PENDING':
        return t.orders.paymentPending;
      case 'PAYMENT_FAILED':
      case 'FAILED':
      case 'FAIL':
        return t.orders.paymentFailed;
      default:
        return value;
    }
  };

  const formatCouponType = (type?: CouponDetails['type']) => {
    if (!type) return null;

    switch (type) {
      case 'PERCENTAGE':
        return t.coupons.percentage;
      case 'FIXED':
        return t.coupons.fixedAmount;
      case 'FREE_SHIPPING':
        return t.coupons.freeShipping;
      default:
        return type;
    }
  };

  const formatCouponScope = (scope?: CouponDetails['scope']) => {
    if (!scope) return null;

    switch (scope) {
      case 'GLOBAL':
        return t.all;
      case 'STORE':
        return t.coupons.store;
      case 'PRODUCT':
        return t.inventory.product;
      default:
        return scope;
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/orders/option/${orderId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      toast.success(t.orders.cancelSuccess);
      router.back();
    } catch {
      toast.error(t.orders.cancelError);
    }
  };

  const handleAccept = async () => {
    try {
      const res = await fetch(`/api/orders/option/update/${orderId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      toast.success(t.orders.confirmSuccess);
      router.back();
    } catch {
      toast.error(t.orders.confirmError);
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
        console.error(t.orders.loadFailed);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, [orderId, t.orders.loadFailed]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-[640px] w-full" />
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
          <h2 className="text-foreground mt-4 text-xl font-semibold">
            {t.orders.orderNotFoundTitle}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">{t.orders.orderNotFoundDescription}</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] ?? {
    color: 'text-muted-foreground',
    bgColor: 'bg-muted border-border',
    label: formatOrderStatusLabel(order.status) ?? order.status,
    icon: <Clock className="h-4 w-4" />,
  };
  const canManageOrderStatus = order.status === 'PENDING' || order.status === 'SHIPPED';
  const canConfirm =
    canManageOrderStatus && (session.data?.user.role === 'SUPPLIER' || !hasSupplierProducts);
  const canCancel = canManageOrderStatus;
  const customerEmail = order.email ?? order.paymentOrder?.customerEmail ?? order.user?.email;
  const paymentMethodLabel =
    formatPaymentMethod(order.paymentMethod) ?? formatPaymentMethod(order.store?.methodPayment);
  const shippingAmount = order.store?.shippingPrice ?? null;
  const discountAmount = order.discount && order.discount > 0 ? order.discount : null;
  const finalTotal =
    order.finalTotal && order.finalTotal > 0
      ? order.finalTotal
      : order.total - (order.discount ?? 0) > 0
        ? order.total - (order.discount ?? 0)
        : order.total;
  const storeLink = order.store?.subLink ? `https://${order.store.subLink}.matager.store` : null;
  const itemCount = order.items.length;

  return (
    <>
      <div dir={dir} className="mb-12 min-h-screen px-2 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
            <span className="hover:text-foreground cursor-pointer">{t.orders.title}</span>
            <BreadcrumbIcon className="h-4 w-4" />
            <span className="text-foreground">{t.orders.orderDetails}</span>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  {t.orders.order} #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                {order.orderSource === 'TRADER_ORDER' && order.orderId && (
                  <Badge variant="outline" className="w-fit px-3 py-1 text-xs font-medium">
                    {t.orders.originalOrder}: #{order.orderId.slice(0, 8).toUpperCase()}
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {formatDateTime(order.createdAt)}
              </p>

              {session.data?.user.role !== 'SUPPLIER' && hasSupplierProducts && (
                <Badge className="border border-blue-500 bg-blue-50 px-4 py-2 font-medium text-blue-500">
                  {t.orders.supplierProductsPending}
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
              <InfoCard
                title={`${t.orders.products} (${itemCount})`}
                icon={<ShoppingBag className="h-5 w-5" />}
              >
                <div className="divide-y">
                  {order.items.length === 0 ? (
                    <p className="text-muted-foreground py-4 text-sm">{t.orders.noProducts}</p>
                  ) : (
                    order.items.map(item => (
                      <div key={item.id} className="hover:bg-muted/20 space-y-4 py-6 transition">
                        <div className="flex gap-4">
                          <div className="bg-muted relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border">
                            {item.product?.image ? (
                              <Image
                                src={item.product.image}
                                alt={item.product.name || t.inventory.product}
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
                            <div className="space-y-2">
                              <div>
                                <h3 className="text-foreground font-semibold">
                                  {item.product?.name || t.inventory.product}
                                </h3>
                                {item.product?.description && (
                                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                    {item.product.description}
                                  </p>
                                )}
                              </div>

                              <div className="text-muted-foreground flex flex-wrap gap-3 text-sm">
                                {item.product?.category && (
                                  <span className="bg-muted rounded-md px-2 py-1">
                                    {t.inventory.category}: {item.product.category}
                                  </span>
                                )}
                                {item.size && (
                                  <span className="bg-muted rounded-md px-2 py-1">
                                    {t.orders.size}: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="bg-muted flex items-center gap-1.5 rounded-md px-2 py-1">
                                    {t.orders.color}:
                                    <span
                                      className="inline-block h-4 w-4 rounded-full border"
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span dir="ltr">{item.color}</span>
                                  </span>
                                )}
                                <span className="bg-muted rounded-md px-2 py-1">
                                  {t.orders.quantity}: {item.quantity}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                              <DetailRow
                                label={t.inventory.price}
                                value={formatAmount(item.price)}
                              />
                              <DetailRow
                                label={t.orders.total}
                                value={formatAmount(item.price * item.quantity)}
                                strong
                              />
                              <DetailRow
                                label={t.inventory.wholesalePrice}
                                value={
                                  item.wholesalePrice !== null && item.wholesalePrice !== undefined
                                    ? formatAmount(item.wholesalePrice)
                                    : null
                                }
                              />
                              <DetailRow
                                label={t.orders.traderProfit}
                                value={
                                  item.traderProfit !== null && item.traderProfit !== undefined
                                    ? formatAmount(item.traderProfit)
                                    : null
                                }
                              />
                              <DetailRow
                                label={t.orders.supplierProfit}
                                value={
                                  item.supplierProfit !== null && item.supplierProfit !== undefined
                                    ? formatAmount(item.supplierProfit)
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </InfoCard>

              <div className="flex flex-wrap-reverse gap-3">
                {canConfirm && (
                  <Button
                    size="lg"
                    className="bg-foreground text-background hover:bg-foreground/90 flex-1 cursor-pointer"
                    onClick={() => setOpenAccept(true)}
                  >
                    <CheckCircle className="ml-2 h-5 w-5" />
                    {confirmActionLabel}
                  </Button>
                )}

                {canCancel && (
                  <Button
                    size="lg"
                    variant="destructive"
                    className="flex-1 cursor-pointer"
                    onClick={() => setOpenCancel(true)}
                  >
                    <XCircle className="ml-2 h-5 w-5" />
                    {t.orders.cancelOrder}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <InfoCard title={t.orders.summary} icon={<Hash className="h-5 w-5" />}>
                <DetailRow label={t.orders.subtotal} value={formatAmount(order.total)} />
                <DetailRow
                  label={t.orders.discountAmount}
                  value={discountAmount ? formatAmount(discountAmount) : null}
                />
                <DetailRow
                  label={t.orders.shipping}
                  value={shippingAmount !== null ? formatAmount(shippingAmount) : '-'}
                />
                <Separator />
                <DetailRow label={t.orders.finalTotal} value={formatAmount(finalTotal)} strong />
              </InfoCard>

              <InfoCard title={t.orders.customerInfo} icon={<User className="h-5 w-5" />}>
                <DetailRow label={t.orders.name} value={order.fullName || '-'} />
                <DetailRow label={t.profile.email} value={customerEmail} valueDir="ltr" />
                <DetailRow label={t.orders.phone} value={order.phone || '-'} valueDir="ltr" />
                <DetailRow label={t.orders.deliveryAddress} value={order.location || '-'} />
              </InfoCard>

              {(order.paymentOrder || paymentMethodLabel) && (
                <InfoCard title={t.orders.paymentDetails} icon={<CreditCard className="h-5 w-5" />}>
                  <DetailRow label={t.orders.paymentMethod} value={paymentMethodLabel} />
                  <DetailRow
                    label={t.orders.statusLabel}
                    value={
                      order.paymentOrder?.status
                        ? formatPaymentStatusLabel(order.paymentOrder.status)
                        : formatOrderStatusLabel(order.status)
                    }
                    valueDir="auto"
                  />
                  <DetailRow
                    label={t.orders.amount}
                    value={
                      order.paymentOrder
                        ? formatAmount(order.paymentOrder.amount, order.paymentOrder.currency)
                        : null
                    }
                  />
                  <DetailRow
                    label={t.orders.paymentReference}
                    value={order.paymentOrder?.tranRef}
                    valueDir="ltr"
                  />
                  <DetailRow
                    label={t.orders.cartId}
                    value={order.paymentOrder?.cartId}
                    valueDir="ltr"
                  />
                  <DetailRow
                    label={t.orders.responseCode}
                    value={order.paymentOrder?.respCode}
                    valueDir="ltr"
                  />
                  <DetailRow
                    label={t.orders.responseMessage}
                    value={order.paymentOrder?.respMessage}
                  />
                  <DetailRow
                    label={t.orders.date}
                    value={order.paymentOrder ? formatDateTime(order.paymentOrder.createdAt) : null}
                  />
                </InfoCard>
              )}

              {order.coupon && (
                <InfoCard title={t.coupons.title} icon={<TicketPercent className="h-5 w-5" />}>
                  <DetailRow
                    label={t.coupons.couponCode}
                    value={order.coupon.code}
                    valueDir="ltr"
                  />
                  <DetailRow
                    label={t.coupons.discountType}
                    value={formatCouponType(order.coupon.type)}
                  />
                  <DetailRow
                    label={t.coupons.discountValue}
                    value={
                      order.coupon.type === 'PERCENTAGE'
                        ? `${order.coupon.value}%`
                        : order.coupon.type === 'FREE_SHIPPING'
                          ? t.coupons.freeShipping
                          : formatAmount(order.coupon.value)
                    }
                  />
                  <DetailRow
                    label={t.coupons.couponScope}
                    value={formatCouponScope(order.coupon.scope)}
                  />
                  <DetailRow
                    label={t.coupons.maxDiscount}
                    value={
                      order.coupon.maxDiscount !== null && order.coupon.maxDiscount !== undefined
                        ? formatAmount(order.coupon.maxDiscount)
                        : null
                    }
                  />
                  <DetailRow
                    label={t.orders.statusLabel}
                    value={order.coupon.isActive ? t.home.active : t.coupons.inactive}
                  />
                  <DetailRow
                    label={t.plans.endDate}
                    value={order.coupon.expiresAt ? formatDateTime(order.coupon.expiresAt) : null}
                  />
                </InfoCard>
              )}

              {order.store && (
                <InfoCard title={t.profile.storeInfo} icon={<StoreIcon className="h-5 w-5" />}>
                  <DetailRow label={t.profile.storeName} value={order.store.name} />
                  <DetailRow
                    label={t.profile.domain}
                    value={
                      storeLink ? (
                        <a
                          href={storeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline underline-offset-2"
                        >
                          {storeLink}
                        </a>
                      ) : null
                    }
                    valueDir="ltr"
                  />
                  <DetailRow label={t.orders.phone} value={order.store.phone} valueDir="ltr" />
                  <DetailRow
                    label={t.orders.shipping}
                    value={
                      order.store.shippingPrice !== null && order.store.shippingPrice !== undefined
                        ? formatAmount(order.store.shippingPrice)
                        : null
                    }
                  />
                  <DetailRow label={t.orders.shippingType} value={order.store.shippingType} />
                  <DetailRow
                    label={t.orders.paymentMethod}
                    value={formatPaymentMethod(order.store.methodPayment)}
                  />
                  <DetailRow label={t.profile.storeDesc} value={order.store.description} />
                </InfoCard>
              )}

              {order.trader && (
                <InfoCard title={t.orders.traderInfo} icon={<User className="h-5 w-5" />}>
                  <DetailRow label={t.orders.name} value={order.trader.name} />
                  <DetailRow label={t.profile.email} value={order.trader.email} valueDir="ltr" />
                  <DetailRow label={t.orders.phone} value={order.trader.phone} valueDir="ltr" />
                  <DetailRow label={t.orders.originalOrder} value={order.orderId} valueDir="ltr" />
                </InfoCard>
              )}

              {order.supplier && (
                <InfoCard title={t.orders.supplierInfo} icon={<Truck className="h-5 w-5" />}>
                  <DetailRow label={t.orders.name} value={order.supplier.name} />
                  <DetailRow label={t.orders.phone} value={order.supplier.phone} valueDir="ltr" />
                  <DetailRow label={t.orders.deliveryAddress} value={order.supplier.address} />
                  <DetailRow
                    label={t.orders.paymentMethod}
                    value={formatPaymentMethod(order.supplier.methodPayment)}
                  />
                  <DetailRow label={t.orders.notes} value={order.supplier.paymentInfo} />
                </InfoCard>
              )}
            </div>
          </div>
        </div>
      </div>

      {(canConfirm || canCancel) && (
        <>
          <Dialog open={openAccept} onOpenChange={setOpenAccept}>
            <DialogContent dir={dir} className="max-w-md">
              <DialogHeader className="text-right">
                <DialogTitle className="text-2xl font-bold">{confirmActionLabel}</DialogTitle>
                <DialogDescription className="text-base">
                  {t.orders.confirmDialogDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="bg-muted/50 my-4 space-y-4 rounded-lg border p-4">
                <DetailRow
                  label={t.orders.orderNumber}
                  value={`#${order.id.slice(0, 8).toUpperCase()}`}
                  valueDir="ltr"
                />
                <Separator />
                <DetailRow label={t.orders.customer} value={order.fullName || '-'} />
                <DetailRow label={t.orders.productsCount} value={String(order.items.length)} />
                <Separator />
                <DetailRow label={t.orders.totalAmount} value={formatAmount(finalTotal)} strong />
              </div>

              <DialogFooter className="flex flex-col flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={handleAccept}
                  className="flex-1 cursor-pointer border border-black"
                >
                  <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                  {confirmActionLabel}
                </Button>

                {subscriptionData?.subscription?.type === 'trader-basic' ||
                order.status === 'SHIPPED' ? null : (
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/Dashboard/orderDetails/al-waseet/${orderId}`)}
                    className="flex-1 border border-black"
                  >
                    <GrDeliver className="ml-2 h-4 w-4 text-green-500" />
                    {t.orders.deliveryWithAlwaseet}
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => setOpenAccept(false)}
                  className="flex-1"
                >
                  {t.cancel}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openCancel} onOpenChange={setOpenCancel}>
            <DialogContent dir={dir} className="max-w-md">
              <DialogHeader className="text-right">
                <DialogTitle className="text-destructive text-2xl font-bold">
                  {t.orders.cancelOrder}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {t.orders.cancelDialogDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="border-destructive/20 bg-destructive/5 my-4 space-y-3 rounded-lg border p-4">
                <DetailRow
                  label={t.orders.orderNumber}
                  value={`#${order.id.slice(0, 8).toUpperCase()}`}
                  valueDir="ltr"
                />
                <DetailRow label={t.orders.customer} value={order.fullName || '-'} />
                <DetailRow label={t.orders.amount} value={formatAmount(finalTotal)} strong />
              </div>

              <DialogFooter className="gap-4">
                <Button variant="outline" onClick={() => setOpenCancel(false)} className="flex-1">
                  {t.back}
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="flex-1">
                  <XCircle className="ml-2 h-4 w-4" />
                  {t.orders.yesCancelOrder}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
