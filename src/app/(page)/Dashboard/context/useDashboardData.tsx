'use client';
import useSWR from 'swr';
import axios from 'axios';
import { UserProps } from '@/types/Products';
import { StoreProps } from '@/types/store/StoreType';
import { Supplier } from '@/types/Supplier/SupplierType';
import { SubscriptionResponse } from '@/types/users/User';

interface DashboardData {
  productCount: number;
  orderCount: number;
  storeSlug: StoreProps;
  role: string | null;
  profit: number;
  visitTotal: number | null;
  pendingOrderCount: number;
  orderDone: number;
  user: UserProps | null;
  supplier: Supplier;
  subscription: SubscriptionResponse;
  Stores?: StoreProps[];
}

const fetcher = (url: string) => axios.get(url, { timeout: 10000 }).then(res => res.data);

export const useDashboardData = (userId?: string) => {
  const shouldFetch = !!userId;
  const { data: storeSlug } = useSWR(
    shouldFetch ? `/api/storev2/info4setting/${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );
  const { data: supplier, isLoading: supplierLoading } = useSWR(
    shouldFetch ? `/api/supplier/check` : null,
    fetcher
  );
  const { data: productData, isLoading: productLoading } = useSWR(
    shouldFetch ? `/api/products/count?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const { data: orderData, isLoading: orderLoading } = useSWR(
    shouldFetch ? `/api/orders/count?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const { data: profitData, isLoading: profitLoading } = useSWR(
    shouldFetch ? `/api/orders/profit?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const { data: pendingData, isLoading: pendingLoading } = useSWR(
    shouldFetch ? `/api/orders/pending/${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const { data: roleData, isLoading: roleLoading } = useSWR(
    shouldFetch ? `/api/users/checkRole?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );
  const { data: userData } = useSWR(
    shouldFetch ? `/api/users/getinfo4setting/${userId}` : null,
    fetcher
  );

  const { data: visitData, isLoading: visitLoading } = useSWR(
    storeSlug ? `/api/visit/${storeSlug.subLink}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );
  const { data: orderDateDone, isLoading: orderDoneisloading } = useSWR(
    shouldFetch ? `/api/orders/done?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const { data: subscription } = useSWR<SubscriptionResponse>(
    '/api/plans/subscriptions/check',
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 5000,
      revalidateOnMount: true,
    }
  );
  const { data: stores } = useSWR<StoreProps[]>('/api/dashboard/store/get-stores', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000,
    revalidateOnMount: true,
  });
  const data: DashboardData = {
    supplier: supplier,
    productCount: productData?.count ?? 0,
    orderCount: orderData?.count ?? 0,
    orderDone: orderDateDone?.count ?? 0,
    storeSlug,
    role: roleData?.role ?? roleData?.checkRole ?? null,
    profit: profitData?.profit ?? 0,
    visitTotal: visitData?.count ?? null,
    pendingOrderCount: Array.isArray(pendingData) ? pendingData.length : 0,
    user: userData,
    subscription: subscription!,
    Stores: stores,
  };

  const loading = roleLoading;

  return { data, loading, error: null };
};
