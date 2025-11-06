'use client';

import { useContext, createContext, ReactNode } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import dayjs from 'dayjs';
import { Product } from '@/types/Products';

interface Order {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  fullName: string;
  phone: string;
  email: string | null;
  location: string;
  userId: string;
}

export interface StoreDetail {
  id: string;
  name: string;
  storeName?: string;
  storeSlug?: string;
  phone?: string;
  totalProducts: number;
  totalOrders: number;
  totalProfit: number;
  totalVisitors: number;
  active?: boolean;
  createdAt?: string;
}

export interface UserProps {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface ApiStore {
  id: string;
  name: string;
  storeName?: string;
  storeSlug?: string;
  phone?: string | null;
  totalProducts: number;
  totalOrders: number;
  totalProfit: number;
  active: boolean;
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalVisitors: number;
  ordersByStatus?: { status: string; _count: { _all: number } }[];
  totalVisitorsLandingPage?: number;
  totalStores?: number;
  storesToday?: number;
  storesThisMonth?: number;
  growthPercentage?: number;
  loading: boolean;
  err: string | null;
  users: UserProps[];
  stores: StoreDetail[];
  allOrder: Order[];
  allProducts: Product[];
  totalSales: number;
  weeklyVisitors?: number[];
}

const AdminContext = createContext<Stats | undefined>(undefined);

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/overview', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 1000 * 60 * 5,
    refreshInterval: 0,
  });

  let stats: Stats = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalVisitors: 0,
    loading: isLoading,
    err: error ? (error instanceof Error ? error.message : 'err !') : null,
    users: [],
    stores: [],
    allOrder: [],
    allProducts: [],
    totalSales: 0,
    weeklyVisitors: [],
  };

  if (data) {
    const detailedStores: StoreDetail[] = (data.stores || []).map((store: ApiStore) => ({
      id: store.id,
      name: store.name,
      storeName: store.storeName || store.name,
      storeSlug: store.storeSlug,
      phone: store.phone ?? undefined,
      totalProducts: store.totalProducts,
      totalOrders: store.totalOrders,
      totalProfit: store.totalProfit,
      totalVisitors: 0,
      active: store.active,
    }));

    stats = {
      totalUsers: data.stats.totalUsers || 0,
      totalProducts: data.stats.totalProducts || 0,
      totalOrders: data.stats.totalOrders || 0,
      totalVisitors: data.stats.totalVisitors || 0,
      ordersByStatus: data.stats.ordersByStatus || [],
      totalVisitorsLandingPage: data.stats.totalVisitorsLandingPage || 0,
      totalStores: data.stats.totalStores || 0,
      storesToday: data.stats.storesToday || 0,
      storesThisMonth: data.stats.storesThisMonth || 0,
      growthPercentage: data.stats.growthPercentage || 0,
      users: data.latest?.users || [],
      stores: detailedStores,
      allOrder: data.allOrder || [],
      allProducts: data.allProducts || [],
      totalSales: data.totalSales || 0,
      weeklyVisitors: data.stats?.weeklyVisitors ?? [],
      loading: isLoading,
      err: null,
    };
  }

  return <AdminContext.Provider value={stats}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
