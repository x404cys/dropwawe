'use client';

import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import SupplierCard from '../../_components/supplier/SupplierCard';
import { Supplier } from '@/types/Supplier/SupplierType';
import { PiShippingContainerLight } from 'react-icons/pi';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function SupplierPage() {
  const { data, isLoading, error } = useSWR('/api/supplier/all', fetcher);

  if (isLoading)
    return (
      <p className="py-10 text-center text-lg font-medium text-gray-500">جاري تحميل الموردين...</p>
    );

  if (error)
    return (
      <p className="text-center text-lg font-semibold text-red-500">
        حدث خطأ أثناء تحميل البيانات {error.message}
      </p>
    );

  if (!data || data.length === 0)
    return <div className="py-20 text-center text-lg text-gray-400"> لا يوجد موردين بعد</div>;

  return (
    <section className="w-full">
      <div className="mx-auto w-full">
        <header
          dir="rtl"
          className="mb-8 flex flex-col items-center justify-between gap-2 border-b border-gray-200 pt-12 pb-3"
        >
          <div className="flex text-xs items-center gap-1 bg-sky-100 border border-sky-200 rounded-4xl px-4 py-1">
            <span>تصفح الموردين</span>
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
                store={supplier.user?.Store?.find(s => s.subLink)?.subLink as string}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
