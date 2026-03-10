'use client';
import { useProducts } from '../../context/products-context';
import Image from 'next/image';
import Link from 'next/link';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useState } from 'react';
export default function HomeView() {
  const {
    products,
    filteredProductsByCategory,
    store,
    categories,
    setCategory,
    loading,
    setCategoryList,
  } = useProducts();
  const [activeCategory, setActiveCategory] = useState('الكل');

  const allCategories = ['الكل', ...categories];

  const itemsToRender =
    filteredProductsByCategory.length > 0 ? filteredProductsByCategory : products;
  if (loading) {
    return (
      <div className="bg-[#7f2d2ef8] px-4 py-10">
        <div className="flex gap-2 overflow-x-auto py-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-lg bg-[#a45c5d]" />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square w-full animate-pulse rounded-lg bg-[#a45c5d]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#a45c5d]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#a45c5d]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="h-auto overflow-y-scroll">
      <div dir="rtl" className="bg-[#7f2d2ef8] px-4 font-sans">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto py-5 whitespace-nowrap">
          {allCategories.map((name, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCategoryList(name === 'الكل' ? null : name);
                setActiveCategory(name);
              }}
              className={`flex-shrink-0 cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                activeCategory === name
                  ? 'border[#a45c5d] bg-[#a45c5d] text-white'
                  : 'text-muted border-[#a45c5d]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="grid pb-3 grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-1">
          <div className=" ">
            <div className="mx-auto">
              <h2 className="sr-only">Products</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
                {itemsToRender.map(product => (
                  <Link
                    key={product.id}
                    href={`/s/themes/theme3/product-overview/${product.id}`}
                    className="group"
                  >
                    <Image
                      src={product.image ?? '/placeholder.png'}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="aspect-square w-full rounded-lg border border-[#a45c5d] bg-[#a45c5d] object-cover group-hover:opacity-75 xl:aspect-7/8"
                    />
                    <h3 className="mt-4 text-sm text-white">{product.name}</h3>
                    <p className="mt-1 text-lg font-medium text-white">
                      {formatIQD(product.price)} د.ع
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
