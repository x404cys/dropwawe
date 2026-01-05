'use client';
import useSWR from 'swr';
import axios from 'axios';
import { UserProps } from '@/types/Products';
import { StoreProps } from '@/types/store/StoreType';
import { Supplier } from '@/types/Supplier/SupplierType';

interface SupplierData {
  supplier: Supplier;
}

const fetcher = (url: string) => axios.get(url, { timeout: 10000 }).then(res => res.data);

export const useSupplierData = (userId?: string) => {
  const shouldFetch = !!userId;

  const { data: supplier, isLoading: supplierLoading } = useSWR(
    shouldFetch ? `/api/supplier/check` : null,
    fetcher
  );

  const data: SupplierData = {
    supplier: supplier,
  };

  const loading = supplierLoading;

  return { data, loading, error: null };
};
