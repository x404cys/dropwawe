'use client';

import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import HandleAddToStore from '@/app/(page)/Dashboard/_utils/HandleAddToStore';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ProductOverviewPage() {
  const { productId } = useParams();
  const {
    data: product,
    error,
    isLoading,
  } = useSWR(`/api/dropwave/get/products/${productId}`, fetcher);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6 md:flex-row" dir="rtl">
        <Skeleton className="h-96 w-full rounded-2xl md:w-1/2" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center font-medium text-red-500">حدث خطأ أثناء تحميل المنتج.</div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col gap-10 bg-gray-50 py-2 md:flex-row md:p-10"
      dir="rtl"
    >
      <div className="w-full md:w-1/2">
        <img
          src={product.cover_image_url}
          alt={product.name}
          className="w-full rounded-lg object-cover shadow-md"
        />
      </div>

      <div className="flex-1 space-y-5">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">{product.name}</h1>

        <div className="text-2xl font-semibold text-green-600">
          {formatIQD ? formatIQD(product.sale_price) : `${product.sale_price} د.ع`}
        </div>

        <div
          className={`text-sm font-medium ${
            product.stock_status === 'in_stock' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {product.stock_status === 'in_stock' ? 'متوفر في المخزون' : 'غير متوفر'}
        </div>

        <p className="leading-relaxed whitespace-pre-line text-gray-700">{product.description}</p>

        <HandleAddToStore productId={product.id} />
      </div>
    </div>
  );
}
