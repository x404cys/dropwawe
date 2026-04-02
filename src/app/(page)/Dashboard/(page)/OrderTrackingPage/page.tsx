'use client';
import { useLanguage } from '../../context/LanguageContext';

import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import React, { useMemo, useState } from 'react';
import OrderDetailDialog, { type OrderStatus } from './components/OrderDetailDialog';
import { useDashboardData } from '../../context/useDashboardData';
import { Banknote, CreditCard, Search, ShoppingBag, Trash2, AlertTriangle } from 'lucide-react';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useStoreProvider } from '../../context/StoreContext';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { Order } from '@/types/Products';

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('LOAD_ORDERS_FAILED');
    return res.json();
  });

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-primary/10 text-primary',
  PAYMENT_PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  CONFIRMED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  SHIPPED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  DELIVERED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PAYMENT_FAILED: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  CANCELLED: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrderSummaryPage() {
  const { t } = useLanguage();

  const DATE_FILTERS = [
    { key: 'week', label: t.orders.week },
    { key: 'month', label: t.orders.month },
    { key: '3months', label: t.orders.threeMonths },
    { key: 'year', label: t.orders.year },
  ];

  const STATUS_TABS = [
    { key: 'all', label: t.all },
    { key: 'PAYMENT_PENDING', label: t.orders.paymentPending },
    { key: 'PENDING', label: t.orders.new },
    { key: 'CONFIRMED', label: t.orders.confirmed },
    { key: 'SHIPPED', label: t.orders.transit },
    { key: 'DELIVERED', label: t.orders.completed },
    { key: 'PAYMENT_FAILED', label: t.orders.paymentFailed },
    { key: 'CANCELLED', label: t.orders.cancelled },
  ];

  const STATUS_LABELS: Record<string, string> = {
    PENDING: t.orders.new,
    PAYMENT_PENDING: t.orders.paymentPending,
    CONFIRMED: t.orders.confirmed,
    SHIPPED: t.orders.transit,
    DELIVERED: t.orders.completed,
    PAYMENT_FAILED: t.orders.paymentFailed,
    CANCELLED: t.orders.cancelled,
  };

  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const [storeId, setStoreId] = useState<string>('');
  const fiestoreId = data?.Stores?.[0]?.id || '';
  const activeStoreId = storeId || fiestoreId;
  const { currentStore } = useStoreProvider();

  const {
    data: orders = [],
    isLoading,
    error,
  } = useSWR<Order[]>(currentStore ? `/api/orders/store/${currentStore.id}` : null, fetcher);

  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('year');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'CANCELLED') {
      await axios.patch(`/api/orders/option/${orderId}`);
    } else if (newStatus === 'CONFIRMED') {
      await axios.patch(`/api/orders/option/update/${orderId}`);
    } else {
      await axios.patch(`/api/orders/details/${orderId}`, { status: newStatus });
    }
    mutate(`/api/orders/store/${currentStore?.id}`);
  };

  const toDialogOrder = (o: Order): any => ({
    id: o.id,
    userId: '',
    storeId: '',
    fullName: o.fullName,
    total: o.finalTotal && o.finalTotal > 0 ? o.finalTotal : o.total,
    status: o.status,
    createdAt: new Date(o.createdAt).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    phone: o.phone,
    location: o.location,
    items: o.items,
  });

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }

    const now = new Date();
    const from = new Date();
    switch (dateFilter) {
      case 'month':
        from.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        from.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        from.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        from.setFullYear(now.getFullYear() - 1);
        break;
      default:
        from.setDate(now.getDate() - 7);
    }
    result = result.filter(o => new Date(o.createdAt) >= from);

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        o =>
          o.fullName?.toLowerCase().includes(s) ||
          o.phone.includes(s) ||
          o.location.toLowerCase().includes(s) ||
          o.items?.some(item => item.name?.toLowerCase().includes(s)) ||
          o.id.toLowerCase().includes(s)
      );
    }

    return result;
  }, [orders, statusFilter, dateFilter, search]);

  const deleteOrder = async (id: string) => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/orders/option/delete/${id}`);
      await mutate(`/api/orders/store/${currentStore?.id}`);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <section dir="rtl" className="space-y-3 p-4">
        <Skeleton className="bg-muted h-11 w-full rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="bg-muted h-8 w-16 rounded-full" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="bg-muted h-20 w-full rounded-xl" />
        ))}
      </section>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{t.orders.loadFailed}</div>;
  }

  return (
    <section dir="rtl" className="bg-background min-h-screen">
      <div className="space-y-4 p-4 pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-lg font-bold">{t.orders.title}</h1>
            <p className="text-muted-foreground text-xs">
              {orders.length} {t.orders.totalOrdersLabel}
            </p>
          </div>
          {data?.Stores && data.Stores.length > 1 && (
            <select
              value={storeId || fiestoreId}
              onChange={e => setStoreId(e.target.value)}
              className="border-border bg-card text-foreground rounded-xl border px-3 py-2 text-xs"
            >
              <option value="">{t.orders.allStores}</option>
              {data?.Stores?.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.orders.searchByNamePhoneLocation}
            className="border-border bg-card text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-2.5 pr-10 pl-4 font-light transition outline-none focus:ring-2"
          />
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex-shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                statusFilter === tab.key
                  ? 'bg-primary text-primary-foreground shadow-primary/30 shadow-sm'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/50 border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {DATE_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setDateFilter(f.key)}
              className={`flex-shrink-0 cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                dateFilter === f.key
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-20">
            <ShoppingBag className="mb-3 h-14 w-14 opacity-25" />
            <p className="text-sm font-medium">{t.orders.noOrders}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="bg-card border-border hover:border-border/80 overflow-hidden rounded-xl border transition-all hover:shadow-md"
              >
                <div
                  onClick={() => {
                    setSelectedOrder(order);
                    setDialogOpen(true);
                  }}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3.5"
                >
                  {/* Avatar */}
                  <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                    <span className="text-primary text-sm font-bold">
                      {order.fullName?.charAt(0) ?? '؟'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    {order?.paymentMethod?.toUpperCase() === 'SELF_ORDER' ? (
                      <div className="text-primary flex items-center gap-2 rounded-lg py-2">
                        <ShoppingBag className="text-primary h-4 w-4" />
                        <span className="text-foreground text-xs font-medium">
                          {t.orders.directOrder}
                        </span>
                      </div>
                    ) : order?.paymentMethod === 'cod' ? (
                      <div className="text-primary flex items-center gap-2 rounded-lg py-2">
                        <Banknote className="text-primary h-4 w-4" />
                        <span className="text-foreground text-xs font-medium">
                          {t.orders.cashOnDelivery}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg py-2">
                        <CreditCard className="text-primary h-4 w-4" />
                        <span className="text-foreground text-xs font-medium">
                          {t.orders.electronicPayment}
                        </span>
                      </div>
                    )}{' '}
                    <div className="flex items-center gap-2">
                      <span className="text-foreground truncate text-sm font-semibold">
                        {order.fullName}
                      </span>
                      <span
                        className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          STATUS_STYLES[order.status as string] ??
                          'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {STATUS_LABELS[order.status as string] ?? order.status}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px]">{order.location}</span>
                      <span className="text-muted-foreground/50 text-[11px]">•</span>
                      <span className="text-muted-foreground text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-left">
                    <p className="text-foreground text-sm font-bold">
                      {formatIQD(
                        order.finalTotal && order.finalTotal > 0 ? order.finalTotal : order.total
                      )}
                    </p>
                    <p className="text-muted-foreground text-left text-[10px]">{order.phone}</p>
                  </div>
                </div>

                <div className="border-border/50 bg-card/50 flex justify-end border-t px-4 py-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setDeleteTarget(order);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-red-500 transition-all hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t.delete}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteTarget(null)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
                className="border-border bg-background w-full max-w-sm rounded-2xl border shadow-2xl"
              >
                <div className="p-5">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                      <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-foreground text-sm font-bold">
                        {t.orders.deleteConfirmTitle}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm leading-6">
                        {t.orders.deleteConfirmMessage}
                        <span className="text-foreground mx-1 font-semibold">
                          {deleteTarget.fullName || t.orders.thisCustomer}
                        </span>
                        ؟
                      </p>
                      <p className="text-muted-foreground text-xs">{t.orders.deleteIrreversible}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setDeleteTarget(null)}
                      disabled={isDeleting}
                      className="border-border bg-card text-foreground hover:bg-muted rounded-xl border px-4 py-2 text-sm transition disabled:opacity-50"
                    >
                      {t.cancel}
                    </button>

                    <button
                      onClick={() => deleteTarget?.id && deleteOrder(deleteTarget.id)}
                      disabled={isDeleting}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                      {isDeleting ? t.orders.deletingOrder : t.orders.deleteOrder}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      <OrderDetailDialog
        order={selectedOrder ? toDialogOrder(selectedOrder) : null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdateStatus={handleUpdateStatus}
      />
    </section>
  );
}
