'use client';

import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Order } from '@/types/Products';
import {
  DollarSign,
  Package2,
  ShoppingBag,
  ShoppingBagIcon,
  ShoppingBasket,
  Store,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo, JSX } from 'react';
import StatsCardDashboard from './StatsCard';

interface Props {
  orders: Order[];
  onDelete?: (id: string) => void;
  totalOrdersConfirmed: number;
  totalOrdersPending: number;
  totalOrders: number;
  totalSales: {
    _sum: {
      total: number | null;
    };
  };
  totalStores: number;
}

export default function OrdersTable({
  orders,
  onDelete,
  totalOrdersConfirmed,
  totalOrdersPending,
  totalOrders,
  totalSales,
  totalStores,
}: Props) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('year');
  const [search, setSearch] = useState('');
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter.toUpperCase());
    }

    if (search) {
      filtered = filtered.filter(
        p =>
          p.fullName?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          p.createdAt?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          p.location?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          p.phone?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          p.status?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          p.user?.name?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          p.store?.subLink?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    }

    const now = new Date();
    const from = new Date();

    switch (dateFilter) {
      case 'week':
        from.setDate(now.getDate() - 7);
        break;
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
        from.setFullYear(now.getFullYear() - 1);
    }

    filtered = filtered.filter(o => new Date(o.createdAt) >= from);

    return filtered;
  }, [orders, statusFilter, dateFilter, search]);

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

  if (!orders || orders.length === 0)
    return <div className="p-4 text-gray-700 dark:text-gray-200">لا توجد طلبات</div>;
  interface Stat {
    title: string;
    value?: number | string;
    icon: JSX.Element;
    color: string;
    isHighlight?: boolean;
  }
  const statse: Stat[] = [
    {
      title: 'المتاجر',
      value: totalStores,
      icon: <Users />,
      color: 'text-blue-500',
      isHighlight: true,
    },
    {
      title: 'الطلبات',
      value: totalOrders,
      icon: <ShoppingBasket />,
      color: 'text-green-500',
    },
    {
      title: 'طلبات مؤكدة',
      value: totalOrdersConfirmed,
      icon: <ShoppingBag />,
      color: 'text-purple-500',
    },
    {
      title: 'طلبات معلقة',
      value: totalOrdersPending,
      icon: <ShoppingBag />,
      color: 'text-purple-500',
    },
    {
      title: 'المبيعات',
      value: formatIQD(totalSales._sum.total),
      icon: <DollarSign />,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-md dark:bg-gray-900">
      <div className=" ">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {statse.map((stat, index) => (
            <StatsCardDashboard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>

      <div></div>
      <div className="mt-4 mb-4 flex flex-col gap-2 space-y-2 md:flex-row">
        <div className="w-full">
          <input
            type="text"
            placeholder="ابحث..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full flex-1 rounded-md border p-2 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full rounded-md border p-2 text-sm font-medium dark:bg-gray-700"
        >
          <option value="all">كل الطلبات</option>
          <option value="PRE_ORDER">طلب مسبق</option>
          <option value="TRANSIT">قيد الشحن</option>
          <option value="CONFIRMED">تم التأكيد</option>
          <option value="CANCELLED">ملغي</option>
          <option value="PENDING">معلقة</option>
        </select>

        <select
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="w-full rounded-md border p-2 text-xs font-medium text-gray-600 dark:bg-gray-700"
        >
          <option value="week">هذا الأسبوع</option>
          <option value="month">هذا الشهر</option>
          <option value="3months">آخر 3 أشهر</option>
          <option value="6months">آخر 6 أشهر</option>
          <option value="year">هذه السنة</option>
        </select>
      </div>

      <div className="scrollbar-hide hidden max-h-[100vh] overflow-auto overflow-y-scroll rounded-lg shadow md:block">
        <table className="w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3">رقم الطلب</th>
              <th className="px-4 py-3">المتجر</th>
              <th className="px-4 py-3">صاحب المتجر</th>
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
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {order.id.slice(0, 6)}
                </td>
                <td>{order.store?.subLink}</td>
                <td>{order.user?.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-300">{order.total} د.ع</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusStyle(
                      order.status || ''
                    )}`}
                  >
                    {translateStatus(order.status || '')}
                  </span>
                </td>
                <td className="px-4 py-3">{order.fullName}</td>
                <td className="px-4 py-3">{order.phone}</td>
                <td className="px-4 py-3">{order.location}</td>
                <td className="flex gap-2 px-4 py-3">
                  <button
                    onClick={() => router.push(`/admin/orderDetails/${order.id}`)}
                    className="cursor-pointer rounded bg-gray-900 p-1 text-xs text-white dark:text-blue-400"
                  >
                    تفاصيل
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(order.id)}
                      className="cursor-pointer rounded bg-red-500 p-1 text-xs text-white dark:text-blue-400"
                    >
                      حذف
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="rounded-lg border p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-2 text-sm font-semibold text-gray-800 dark:text-white">
              رقم الطلب: {order.id.slice(0, 6)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              التاريخ: {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">السعر: {order.total} د.ع</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              الحالة:{' '}
              <span
                className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusStyle(
                  order.status || ' '
                )}`}
              >
                {translateStatus(order.status || '')}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">الزبون: {order.fullName}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">الهاتف: {order.phone}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">الموقع: {order.location}</div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => router.push(`/admin/orderDetails/${order.id}`)}
                className="w-full rounded-lg bg-gray-950 py-2 text-sm text-white hover:underline dark:text-blue-400"
              >
                التفاصيل
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(order.id)}
                  className="w-full rounded-lg bg-red-500 py-2 text-sm text-white hover:underline"
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
