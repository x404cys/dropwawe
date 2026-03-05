'use client';
import { useLanguage } from '../../context/LanguageContext';

import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../../context/useDashboardData';
import { Search, ShoppingBag, Trash2, ChevronLeft } from 'lucide-react';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useStoreProvider } from '../../context/StoreContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  productName?: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: string;
  fullName: string;
  location: string;
  phone: string;
  total: number;
}

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('فشل في تحميل الطلبات');
    return res.json();
  });

const STATUS_STYLES: Record<string, string> = {
  PRE_ORDER: 'bg-[#04BAF6]/10 text-[#04BAF6]',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
  TRANSIT: 'bg-amber-100 text-amber-700',
};

const DATE_FILTERS = [
  { key: 'week', label: 'أسبوع' },
  { key: 'month', label: 'شهر' },
  { key: '3months', label: '3 أشهر' },
  { key: 'year', label: 'سنة' },
];

export default function OrderSummaryPage() {
  const { t } = useLanguage();

  const STATUS_TABS = [
    { key: 'all', label: t.all },
    { key: 'PRE_ORDER', label: 'مسبق' },
    { key: 'TRANSIT', label: 'قيد الشحن' },
    { key: 'CONFIRMED', label: t.orders.completed },
    { key: 'CANCELLED', label: t.orders.cancelled },
  ];

  const STATUS_LABELS: Record<string, string> = {
    PRE_ORDER: 'طلب مسبق',
    CONFIRMED: 'تم التأكيد',
    CANCELLED: t.orders.cancelled,
    TRANSIT: 'قيد الشحن',
  };

  const { data: session } = useSession();
  const router = useRouter();
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

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }

    const now = new Date();
    const from = new Date();
    switch (dateFilter) {
      case 'month': from.setMonth(now.getMonth() - 1); break;
      case '3months': from.setMonth(now.getMonth() - 3); break;
      case '6months': from.setMonth(now.getMonth() - 6); break;
      case 'year': from.setFullYear(now.getFullYear() - 1); break;
      default: from.setDate(now.getDate() - 7);
    }
    result = result.filter(o => new Date(o.createdAt) >= from);

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        o =>
          o.fullName.toLowerCase().includes(s) ||
          o.phone.includes(s) ||
          o.location.toLowerCase().includes(s) ||
          o.productName?.toLowerCase().includes(s) ||
          o.id.toLowerCase().includes(s)
      );
    }

    return result;
  }, [orders, statusFilter, dateFilter, search]);

  const deleteOrder = async (id: string) => {
    await axios.delete(`/api/orders/details/delete/${id}`);
    mutate(`/api/orders/store/${currentStore?.id}`);
  };

  // ── Loading state ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section dir="rtl" className="p-4 space-y-3">
        <Skeleton className="h-11 w-full rounded-xl bg-gray-200" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-full bg-gray-200" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl bg-gray-200" />
        ))}
      </section>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">فشل تحميل الطلبات</div>;
  }

  // ── UI ────────────────────────────────────────────────────────────────
  return (
    <section dir="rtl" className="bg-gray-50 min-h-screen">
      <div className="p-4 space-y-4 pb-10">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{t.orders.title}</h1>
            <p className="text-xs text-gray-400">{orders.length} طلب إجمالي</p>
          </div>
          {data?.Stores && data.Stores.length > 1 && (
            <select
              value={storeId || fiestoreId}
              onChange={e => setStoreId(e.target.value)}
              className="text-xs rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700"
            >
              <option value="">كل المتاجر</option>
              {data?.Stores?.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، الموقع..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#04BAF6] focus:ring-2 focus:ring-[#04BAF6]/20 outline-none transition"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex-shrink-0 cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                statusFilter === tab.key
                  ? 'bg-[#04BAF6] text-white shadow-sm shadow-[#04BAF6]/30'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#04BAF6]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Period filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {DATE_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setDateFilter(f.key)}
              className={`flex-shrink-0 cursor-pointer px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                dateFilter === f.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingBag className="h-14 w-14 mb-3 opacity-25" />
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
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  onClick={() => router.push(`/Dashboard/orderDetails/${order.id}`)}
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#04BAF6]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#04BAF6]">
                      {order.fullName?.charAt(0) ?? '؟'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {order.fullName}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                          STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-400">{order.location}</span>
                      <span className="text-[11px] text-gray-300">•</span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Amount + chevron */}
                  <div className="text-left flex-shrink-0 flex items-center gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {formatIQD(order.price)}
                      </p>
                      <p className="text-[10px] text-gray-400 text-left">{order.phone}</p>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-gray-300" />
                  </div>
                </div>

                {/* Delete strip */}
                <div className="border-t border-gray-50 px-4 py-2 flex justify-end">
                  <button
                    onClick={e => { e.stopPropagation(); deleteOrder(order.id); }}
                    className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" /> {t.delete} </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
