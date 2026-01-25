'use client';

import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../../context/useDashboardData';
import Loader from '@/components/Loader';
import { Search, ShoppingBag } from 'lucide-react';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

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

export default function OrderSummaryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data } = useDashboardData(session?.user?.id);
  const [storeId, setStoreId] = useState<string>('');
  const fiestoreId = data?.Stores?.[0]?.id || '';
  const activeStoreId = storeId || fiestoreId;

  const {
    data: orders = [],
    isLoading,
    error,
  } = useSWR<Order[]>(activeStoreId ? `/api/orders/store/${activeStoreId}` : null, fetcher);

  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('year');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter.toUpperCase());
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
    mutate(`/api/orders/store/${storeId}`);
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'PRE_ORDER':
        return 'طلب مسبق';
      case 'CONFIRMED':
        return 'تم التأكيد';
      case 'CANCELLED':
        return 'ملغي';
      case 'TRANSIT':
        return 'قيد الشحن';
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PRE_ORDER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'TRANSIT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <section className="flex h-screen items-center justify-center">
        <Loader />
      </section>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">فشل تحميل الطلبات</div>;
  }

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center space-y-4 bg-white/70 backdrop-blur-sm">
          <Loader />
        </div>
      ) : (
        <>
          <section className="w-full bg-white py-2 md:py-2 dark:bg-gray-900" dir="rtl">
            <div className="max-w-full">
              <div className="max-w-full">
                <div className="mb-6 rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
                    <div className="relative md:col-span-5">
                      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                        البحث
                      </label>
                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="اسم، رقم طلب، هاتف، موقع، منتج"
                        className="w-full rounded-lg border bg-white p-2.5 pr-10 focus:border-gray-900 focus:ring-0 dark:bg-gray-700 dark:text-white"
                      />
                      <Search size={18} className="absolute top-[34px] left-3 text-gray-400" />
                    </div>

                    {data.Stores && data.Stores.length > 0 && (
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                          المتجر
                        </label>
                        <select
                          value={storeId || fiestoreId}
                          onChange={e => setStoreId(e.target.value)}
                          className="w-full rounded-lg border bg-white p-2.5 text-sm dark:bg-gray-700"
                        >
                          <option value="">كل المتاجر</option>
                          {data?.Stores?.map(store => (
                            <option key={store.id} value={store.id}>
                              {store.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                        حالة الطلب
                      </label>
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full rounded-lg border bg-white p-2.5 text-sm dark:bg-gray-700"
                      >
                        <option value="all">الكل</option>
                        <option value="PRE_ORDER">طلب مسبق</option>
                        <option value="TRANSIT">قيد الشحن</option>
                        <option value="CONFIRMED">تم التأكيد</option>
                        <option value="CANCELLED">ملغي</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                        الفترة الزمنية
                      </label>
                      <select
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        className="w-full rounded-lg border bg-white p-2.5 text-sm dark:bg-gray-700"
                      >
                        <option value="week">هذا الأسبوع</option>
                        <option value="month">هذا الشهر</option>
                        <option value="3months">آخر 3 أشهر</option>
                        <option value="6months">آخر 6 أشهر</option>
                        <option value="year">هذه السنة</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="hidden overflow-auto rounded-lg shadow md:block">
                  <table className="w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3">رقم الطلب</th>
                        <th className="px-4 py-3">التاريخ</th>
                        <th className="px-4 py-3">السعر</th>
                        <th className="px-4 py-3">الحالة</th>
                        <th className="px-4 py-3">الزبون</th>
                        <th className="px-4 py-3">الهاتف</th>
                        <th className="px-4 py-3">الموقع</th>
                        <th className="px-4 py-3">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8}>
                            <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-4">
                              <ShoppingBag className="h-24 w-24 text-gray-400 dark:text-gray-600" />

                              <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                لا توجد طلبات
                              </h1>

                              <p className="max-w-xs text-center text-sm text-gray-500 dark:text-gray-400">
                                حالياً لا يوجد أي طلبات
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(e => (
                          <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                              {e.id.slice(0, 6)}
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-300">
                              {new Date(e.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-300">
                              ${e.price}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusStyle(
                                  e.status
                                )}`}
                              >
                                {translateStatus(e.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3">{e.fullName}</td>
                            <td className="px-4 py-3">{e.phone}</td>
                            <td className="px-4 py-3">{e.location}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => router.push(`/Dashboard/orderDetails/${e.id}`)}
                                  className="rounded bg-gray-900 px-2 py-1 text-xs text-white"
                                >
                                  تفاصيل
                                </button>
                                <button
                                  onClick={() => deleteOrder(e.id)}
                                  className="rounded bg-red-500 px-2 py-1 text-xs text-white"
                                >
                                  حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 md:hidden">
                  {filteredOrders.map(e => (
                    <div
                      key={e.id}
                      className="rounded-lg border p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="mb-2 text-sm font-semibold text-gray-800 dark:text-white">
                        رقم الطلب: {e.id.slice(0, 6)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        التاريخ: {new Date(e.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        السعر: {formatIQD(e.price)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        الحالة:{' '}
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusStyle(e.status)}`}
                        >
                          {translateStatus(e.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        الزبون: {e.fullName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        الهاتف: {e.phone}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        الموقع: {e.location}
                      </div>
                      <button
                        onClick={() => router.push(`/Dashboard/orderDetails/${e.id}`)}
                        className="mt-2 inline-block w-full rounded-lg bg-gray-950 py-2 text-sm text-white hover:underline dark:text-blue-400"
                      >
                        التفاصيل
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
