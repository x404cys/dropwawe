'use client';
import { useLanguage } from '../../../context/LanguageContext';

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
  const { t } = useLanguage();
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
          throw new Error(data.error || t.orders.loadFailed);
        }
        const data = await res.json();

        setOrders(data);
        setFilteredOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(t.orders.unknownError);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [session?.user?.id, t.orders.loadFailed, t.orders.unknownError]);

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
        return t.orders.preOrder;
      case 'CONFIRMED':
        return t.orders.confirmed;
      case 'CANCELLED':
        return t.orders.cancelled;
      case 'TRANSIT':
        return t.orders.transit;
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
        return 'bg-muted text-foreground dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <section className="flex min-h-screen flex-col items-center justify-center gap-4 dark:bg-gray-900">
          <ShoppingBag className="text-muted-foreground dark:text-muted-foreground h-24 w-24" />

          <h1 className="text-foreground text-xl font-semibold dark:text-gray-200">
            {t.orders.noOrders}
          </h1>

          <p className="text-muted-foreground dark:text-muted-foreground max-w-xs text-center text-sm">
            {t.orders.currentlyNoOrders}
          </p>
        </section>
      ) : (
        <>
          {loading ? (
            <div className="bg-card/70 fixed inset-0 z-[9999] flex flex-col items-center justify-center space-y-4 backdrop-blur-sm">
              <Loader />
            </div>
          ) : (
            <>
              <section className="bg-card w-full py-2 md:py-2 dark:bg-gray-900" dir="rtl">
                <div className="max-w-full">
                  <div className="max-w-full">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="relative flex w-full rounded-md border md:max-w-full">
                        <input
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder={t.orders.searchDetailedPlaceholder}
                          className="w-full rounded-md p-2 text-sm dark:bg-gray-700 dark:text-white"
                        />
                        <Search size={20} className="text-muted-foreground absolute top-2 left-2" />
                      </div>

                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full rounded-md border p-2.5 text-sm md:max-w-xs dark:bg-gray-700"
                      >
                        <option value="all">{t.orders.allOrders}</option>
                        <option value="PRE_ORDER">{t.orders.preOrder}</option>
                        <option value="TRANSIT">{t.orders.transit}</option>
                        <option value="CONFIRMED">{t.orders.confirmed}</option>
                        <option value="CANCELLED">{t.orders.cancelled}</option>
                      </select>

                      <select
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        className="w-full rounded-md border p-2.5 text-sm md:max-w-xs dark:bg-gray-700"
                      >
                        <option value="week">{t.stats.thisWeek}</option>
                        <option value="month">{t.stats.thisMonth}</option>
                        <option value="3months">{t.orders.lastThreeMonths}</option>
                        <option value="6months">{t.orders.lastSixMonths}</option>
                        <option value="year">{t.orders.thisYear}</option>
                      </select>
                    </div>

                    <div className="hidden overflow-auto rounded-lg shadow md:block">
                      <table className="divide-border w-full divide-y text-sm dark:divide-gray-700">
                        <thead className="bg-muted dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3">{t.orders.orderNumber}</th>
                            <th className="px-4 py-3">{t.orders.date}</th>
                            <th className="px-4 py-3">{t.inventory.price}</th>
                            <th className="px-4 py-3">{t.orders.statusLabel}</th>
                            <th className="px-4 py-3">{t.orders.customer}</th>
                            <th className="px-4 py-3">{t.orders.phone}</th>
                            <th className="px-4 py-3">{t.orders.location}</th>
                            <th className="px-4 py-3">{t.orders.actions}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-border divide-y dark:divide-gray-600">
                          {filteredOrders.map(e => (
                            <tr key={e.id} className="hover:bg-muted dark:hover:bg-gray-600">
                              <td className="text-foreground px-4 py-3 font-medium dark:text-white">
                                {e.id.slice(0, 6)}
                              </td>
                              <td className="text-muted-foreground px-4 py-3 dark:text-gray-300">
                                {new Date(e.createdAt).toLocaleDateString()}
                              </td>
                              <td className="text-muted-foreground px-4 py-3 dark:text-gray-300">
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
                                    {t.orders.details}
                                  </button>
                                  <button
                                    onClick={() => deletOrder(e.id)}
                                    className="cursor-pointer rounded bg-red-500 p-1 text-xs text-white dark:text-blue-400"
                                  >
                                    {' '}
                                    {t.delete}{' '}
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
                          className="dark:bg-card rounded-lg border p-4 shadow-sm dark:border-gray-700"
                        >
                          <div className="text-foreground mb-2 text-sm font-semibold dark:text-white">
                            {t.orders.orderNumber}: {e.id.slice(0, 6)}
                          </div>
                          <div className="text-muted-foreground text-sm dark:text-gray-300">
                            {t.orders.date}: {new Date(e.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground text-sm dark:text-gray-300">
                            {t.inventory.price}: ${e.total}
                          </div>
                          <div className="text-muted-foreground text-sm dark:text-gray-300">
                            {t.orders.statusLabel}:{' '}
                            <span
                              className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusStyle(e.status)}`}
                            >
                              {translateStatus(e.status)}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-sm dark:text-gray-300">
                            {t.orders.customer}: {e.fullName}
                          </div>
                          <div className="text-muted-foreground text-sm dark:text-gray-300">
                            {t.orders.phone}: {e.phone}
                          </div>
                          <div className="text-muted-foreground text-sm dark:text-gray-300">
                            {t.orders.location}: {e.location}
                          </div>
                          <button
                            onClick={() => router.push(`/Dashboard/orderDetails/${e.id}`)}
                            className="bg-background mt-2 inline-block w-full rounded-lg py-2 text-sm text-white hover:underline dark:text-blue-400"
                          >
                            {t.orders.details}
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
