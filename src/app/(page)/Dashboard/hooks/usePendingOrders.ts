'use client';

/**
 * usePendingOrders hook
 * Extracted from Sidebar, FloatingNavBarForDashboard, and Dashboard page
 * which all had the same SWR call for pending orders
 */
import useSWR from 'swr';
import { fetcherAxios } from '../services/api';
import { Order } from '@/types/Products';

export function usePendingOrders(storeId?: string) {
  const { data: pendingData, isLoading } = useSWR<Order[]>(
    storeId ? `/api/dashboard/order/pending/${storeId}` : null,
    fetcherAxios,
    {
      refreshInterval: 1000,
      revalidateOnFocus: true,
    }
  );

  return {
    pendingOrders: pendingData ?? [],
    pendingCount: pendingData?.length ?? 0,
    isLoading,
  };
}
