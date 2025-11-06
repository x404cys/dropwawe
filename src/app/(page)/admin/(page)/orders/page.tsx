'use client';

import { JSX } from 'react';

import Loader from '@/components/Loader';

import { useAdmin } from '../../context/DataContext';
import OrdersTable from '../../_components/OrderList';
import { useApi } from '../../context/AdminContext';
import useSWR from 'swr';
import { Order } from '@/types/Products';
type OrderApi = {
  totalOrdersConfirmed: number;
  totalOrdersPending: number;
  Orders: Order[];
  totalOrders: number;
  totalSales: {
    _sum: {
      total: number | null;
    };
  };
  totalStores: number;
};
export default function OrdersPage(): JSX.Element {
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { error, isLoading, data } = useSWR<OrderApi>(`/api/admin/overview/stats/orders`, fetcher);
  if (error) return <div>حصل خطأ</div>;
  if (isLoading) return <Loader />;
  return (
    <div dir="rtl" className="min-h-screen w-full bg-gray-50 px-2">
      <OrdersTable
        orders={data?.Orders || []}
        totalSales={data?.totalSales ?? { _sum: { total: 0 } }}
        totalOrders={data?.totalOrders || 0}
        totalStores={data?.totalStores || 0}
        totalOrdersConfirmed={data?.totalOrdersConfirmed || 0}
        totalOrdersPending={data?.totalOrdersPending || 0}
      />
    </div>
  );
}
