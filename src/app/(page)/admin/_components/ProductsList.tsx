'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/DataContext';
import Loader from '@/components/Loader';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import ProductCard from '@/app/Dashboard/(page)/ProductManagment/_components/ProductCard';
import { Product } from '@/types/Products';
import useSWR from 'swr';

interface Props {
  filterByCategory?: string;
}

export default function ProductList({ filterByCategory }: Props) {
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { error, isLoading, data } = useSWR<Product[]>(
    `/api/admin/overview/stats/products`,
    fetcher
  );
  // if (error) return <div>حصل خطأ</div>;
  const allProducts = data ?? [];
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const stores = useMemo(
    () => Array.from(new Set(allProducts.map(p => p.user?.storeSlug).filter(Boolean))),
    [allProducts]
  );

  const categories = useMemo(
    () => Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))),
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(p => (filterByCategory ? p.category === filterByCategory : true))
      .filter(p => (selectedCategory ? p.category === selectedCategory : true))
      .filter(p => (selectedStore ? p.user?.Store?.[0]?.subLink === selectedStore : true))
      .filter(p =>
        statusFilter ? (statusFilter === 'available' ? p.quantity > 0 : p.quantity === 0) : true
      )
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [allProducts, filterByCategory, selectedCategory, selectedStore, search, statusFilter]);

  if (isLoading) return <Loader />;
  if (error) return <div className="p-2 text-red-500">حدث خطأ: {error}</div>;

  const deleteProduct = async (id: string) => {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;
    try {
      await axios.delete(`/api/admin/delete/product/${id}`);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full space-y-3 px-2  py-2">
      <div className="flex max-w-full flex-col gap-2 md:max-w-full md:flex-row md:flex-wrap md:items-center">
        <input
          type="text"
          placeholder="ابحث بالاسم أو المتجر..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="min-w-[150px] flex-1 rounded-md border p-2 text-sm"
        />

        <select
          value={selectedStore}
          onChange={e => setSelectedStore(e.target.value)}
          className="rounded-md border p-2 text-sm"
        >
          <option value="">كل المتاجر</option>
          {stores.map(store => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="rounded-md border p-2 text-sm"
        >
          <option value="">كل الفئات</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-md border p-2 text-sm"
        >
          <option value="">كل الحالات</option>
          <option value="available">متوفر</option>
          <option value="outOfStock">نفد</option>
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:hidden">
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center text-gray-500">لا توجد منتجات</div>
        )}
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={(p: Product) => {
              console.log('Edit product', p);
            }}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-950 text-white">
            <tr>
              <th className="px-2 py-2 text-right">الصورة</th>
              <th className="px-2 py-2 text-right">الاسم</th>
              <th className="px-2 py-2 text-right">المتجر</th>
              <th className="px-2 py-2 text-right">الفئة</th>
              <th className="px-2 py-2 text-right">السعر</th>
              <th className="px-2 py-2 text-right">الكمية</th>
              <th className="px-2 py-2 text-right">الإجراء</th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll">
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="p-3 text-center text-gray-500">
                  لا توجد منتجات
                </td>
              </tr>
            )}
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-t transition hover:bg-gray-50">
                <td className="px-2 py-2">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-[10px] text-gray-500">
                      لا صورة
                    </div>
                  )}
                </td>
                <td className="px-2 py-2 font-medium text-gray-800">{product.name}</td>
                <td className="px-2 py-2 text-gray-600">
                  {product.user?.Store?.[0]?.subLink || 'بدون متجر'}
                </td>

                <td className="px-2 py-2 text-gray-600">{product.category}</td>
                <td className="px-2 py-2 font-semibold text-gray-800">
                  {product.price.toLocaleString()} د.ع
                  {product.discount > 0 && (
                    <span className="ml-1 text-xs text-red-500">-{product.discount}%</span>
                  )}
                </td>
                <td className="px-2 py-2">{product.quantity}</td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="rounded bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
