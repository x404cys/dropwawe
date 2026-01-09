'use client';
import type { Product } from '@/types/Products';
import type { StoreProps } from '@/types/store/StoreType';
import type { Supplier } from '@/types/Supplier/SupplierType';
import axios from 'axios';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart, Tag, TrendingDown, TrendingUp } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';
import ProductsCardSupplier from '@/components/Supplier/ProductsCard';

export default function SupplierPageOverview() {
  const [subLink, setSubLink] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    setSubLink(pathParts[pathParts.length - 1]);
  }, []);

  const fetcher = (url: string) => axios.get(url).then(res => res.data);

  type ApiProps = {
    products: Product[];
    store: StoreProps;
    supplier: Supplier;
  };

  const { data, isLoading, error } = useSWR<ApiProps>(
    subLink ? `/api/supplier/products/${subLink}` : null,
    fetcher
  );
  function safeImage(url?: string | null) {
    if (!url) return '/placeholder.svg';

    try {
      new URL(url);
      return url;
    } catch {
      if (url.startsWith('/')) return url;

      return '/placeholder.svg';
    }
  }
  const categories = Array.from(new Set(data?.products?.map(p => p.category).filter(Boolean)));
  const filteredProducts = data?.products.filter(product => {
    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  if (isLoading)
    return (
      <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-12">
        <div className="bg-muted mb-16 h-32 w-full animate-pulse rounded-xl sm:mb-20 sm:h-40 md:h-48 lg:h-56" />
        <div className="bg-muted mb-2 h-8 w-48 animate-pulse rounded-lg" />
        <div className="bg-muted mb-8 h-4 w-32 animate-pulse rounded" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-muted h-96 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl border p-6 text-center sm:p-8">
          <p className="text-sm font-medium sm:text-base">حدث خطأ أثناء جلب البيانات</p>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm">يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="bg-muted/30 rounded-xl p-6 text-center sm:p-8">
          <p className="text-muted-foreground text-sm font-medium sm:text-base">لا توجد بيانات</p>
        </div>
      </div>
    );

  return (
    <section dir="rtl" className="pb-8 sm:pb-12 lg:pb-16">
      <header className="relative mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <div className="bg-muted relative h-32 w-full overflow-hidden sm:h-40 md:h-48 lg:h-56 xl:h-64">
          {data.supplier.Header ? (
            <Image
              src={safeImage(data.supplier.Header)}
              alt="Supplier Banner"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground text-sm sm:text-base">لا توجد صورة</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="absolute right-4 bottom-0 translate-y-1/2 sm:right-6 md:right-8 lg:right-12">
          <div className="bg-background relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-xl transition-transform hover:scale-105 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
            {data.supplier.image ? (
              <Image
                src={safeImage(data.supplier.image)}
                alt="Supplier Logo"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center text-xl font-bold text-gray-500 sm:text-2xl md:text-3xl lg:text-4xl">
                {data.supplier.user?.name?.charAt(0) ?? 'م'}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="border-border mb-6 px-4 sm:mb-8 sm:px-6 md:px-8 lg:px-12">
        <div className="border-border flex flex-col gap-2 border-b pb-4 sm:gap-3 sm:pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-foreground text-2xl leading-tight font-bold sm:text-3xl md:text-4xl lg:text-5xl">
                {data.store.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm">
                  {data.products.length} منتج متاح
                </div>
              </div>
            </div>

            <div dir="ltr" className="flex flex-col justify-start">
              <div className="flex items-center gap-5">
                {data.supplier.facebookLink && (
                  <a
                    href={data.supplier.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors duration-200 hover:text-[#1877F2]"
                  >
                    <FaFacebook className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {data.supplier.instaLink && (
                  <a
                    href={data.supplier.instaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors duration-200 hover:text-[#E4405F]"
                  >
                    <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
                {data.supplier.telegram && (
                  <a
                    href={data.supplier.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors duration-200 hover:text-[#0088cc]"
                  >
                    <FaTelegram className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(() => {
                  try {
                    const methods = JSON.parse(data.supplier.methodPayment || '[]');
                    return methods.length
                      ? methods.map((method: string, i: number) => (
                          <span
                            key={i}
                            className="bg-muted/50 text-foreground border-border hover:bg-muted rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:text-sm"
                          >
                            {method}
                          </span>
                        ))
                      : null;
                  } catch {
                    return null;
                  }
                })()}
              </div>
            </div>
          </div>

          {data.supplier.description && (
            <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed sm:text-base">
              {data.supplier.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-6 flex w-full flex-col gap-4">
          <input
            type="text"
            placeholder=" ابحث عن منتج..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-border focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2"
          />
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              الكل
            </button>

            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <ProductsCardSupplier products={filteredProducts || []} />
      </div>
    </section>
  );
}
