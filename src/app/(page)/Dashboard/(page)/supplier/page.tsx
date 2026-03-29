'use client';

import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { Supplier } from '@/types/Supplier/SupplierType';
import { PiShippingContainerLight } from 'react-icons/pi';
import SupplierCard from '../../_components/products/supplier/SupplierCard';
import { useLanguage } from '../../context/LanguageContext';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function SupplierPage() {
  const { t, dir } = useLanguage();
  const pageT = t.dashboardPages.supplierList;
  const { data, isLoading, error } = useSWR('/api/supplier/all', fetcher);

  if (isLoading)
    return (
      <p className="text-muted-foreground py-10 text-center text-lg font-medium">{pageT.loading}</p>
    );

  if (error)
    return (
      <p className="text-center text-lg font-semibold text-red-500">
        {pageT.loadError} {error.message}
      </p>
    );

  if (!data || data.length === 0)
    return <div className="text-muted-foreground py-20 text-center text-lg">{pageT.empty}</div>;

  return (
    <section className="w-full">
      <div className="mx-auto w-full">
        <header
          dir={dir}
          className="border-border mb-8 flex flex-col items-center justify-between gap-2 border-b pt-12 pb-3"
        >
          <div className="flex items-center gap-1 rounded-4xl border border-sky-200 bg-sky-100 px-4 py-1 text-xs">
            <span>{pageT.browseSuppliers}</span>
            <PiShippingContainerLight size={18} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {data.map((supplier: Supplier) => {
            const totalProducts = supplier.user?.Product?.length ?? 0;

            return (
              <SupplierCard
                key={supplier.id}
                supplier={{
                  ...supplier,
                }}
                totalProducts={totalProducts}
                store={supplier.id}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
