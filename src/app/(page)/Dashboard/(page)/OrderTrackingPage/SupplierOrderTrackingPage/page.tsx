'use client';

import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { Search, ShoppingBag } from 'lucide-react';
import { useDashboardData } from '../../../context/useDashboardData';

interface Order {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: string;
  fullName: string;
  location: string;
  phone: string;
  total: number;
}

export default function OrderSummaryPage() {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('year');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [search, setSearch] = useState('');
  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter.toUpperCase());
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
        break;
    }

    filtered = filtered.filter(o => new Date(o.createdAt) >= from);

    if (search.trim() !== '') {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        o =>
          o.fullName.toLowerCase().includes(s) ||
          o.phone.includes(s) ||
          o.location.toLowerCase().includes(s) ||
          o.productName?.toLowerCase().includes(s) ||
          o.id.toLowerCase().includes(s)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, dateFilter, search]);

  const deletOrder = async (id: string) => {
    const res = await axios.delete(`/api/orders/details/delete/${id}`);
    if (res.status !== 200) {
      return;
    }
  };
  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch('/api/orders/get-supplier-orders');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'فشل في تحميل الطلبات');
        }
        const data = await res.json();
        console.log(` ==== sass ====${data}`);

        setOrders(data);
        setFilteredOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('حدث خطأ غير معروف');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [session?.user?.id]);

  useEffect(() => {
    let filtered = [...orders];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter.toUpperCase());
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
        break;
    }

    filtered = filtered.filter(o => new Date(o.createdAt) >= from);
    setFilteredOrders(filtered);
  }, [orders, statusFilter, dateFilter]);

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

  return (
    <>
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <section className="flex min-h-screen flex-col items-center justify-center gap-4 dark:bg-gray-900">
          <ShoppingBag className="h-24 w-24 text-gray-400 dark:text-gray-600" />

          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">لا توجد طلبات</h1>

          <p className="max-w-xs text-center text-sm text-gray-500 dark:text-gray-400">
            حالياً لا يوجد أي طلبات
          </p>
        </section>
      ) : (
        <>
          {loading ? (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center space-y-4 bg-white/70 backdrop-blur-sm">
              <Loader />
            </div>
          ) : (
            <>
              <section className="w-full bg-white py-2 md:py-2 dark:bg-gray-900" dir="rtl">
                <div className="max-w-full">
                  <div className="max-w-full">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="relative flex w-full rounded-md border md:max-w-full">
                        <input
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="ابحث عن طلب (اسم – رقم – هاتف – موقع – منتج)"
                          className="w-full rounded-md p-2 text-sm dark:bg-gray-700 dark:text-white"
                        />
                        <Search size={20} className="absolute top-2 left-2 text-gray-500" />
                      </div>

                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full rounded-md border p-2.5 text-sm md:max-w-xs dark:bg-gray-700"
                      >
                        <option value="all">كل الطلبات</option>
                        <option value="PRE_ORDER">طلب مسبق</option>
                        <option value="TRANSIT">قيد الشحن</option>
                        <option value="CONFIRMED">تم التأكيد</option>
                        <option value="CANCELLED">ملغي</option>
                      </select>

                      <select
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        className="w-full rounded-md border p-2.5 text-sm md:max-w-xs dark:bg-gray-700"
                      >
                        <option value="week">هذا الأسبوع</option>
                        <option value="month">هذا الشهر</option>
                        <option value="3months">آخر 3 أشهر</option>
                        <option value="6months">آخر 6 أشهر</option>
                        <option value="year">هذه السنة</option>
                      </select>
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
                          {filteredOrders.map(e => (
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
                                  className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusStyle(e.status)}`}
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
                                    className="cursor-pointer rounded bg-gray-900 p-1 text-xs text-white dark:text-blue-400"
                                  >
                                    تفاصيل
                                  </button>
                                  <button
                                    onClick={() => deletOrder(e.id)}
                                    className="cursor-pointer rounded bg-red-500 p-1 text-xs text-white dark:text-blue-400"
                                  >
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
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
                            السعر: ${e.total}
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
      )}
    </>
  );
}
