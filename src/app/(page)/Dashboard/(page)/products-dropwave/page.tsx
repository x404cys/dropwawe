'use client';
import axios from 'axios';
import useSWR from 'swr';
import { Boxes, Package, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductsCardDropWave from '../ProductManagment/_components/ProductsCard-dropwave';
import { Product } from '@/types/Products';
import Loader from '@/components/Loader';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ProductsPage() {
  const { data, isLoading, error } = useSWR<Product[]>('/api/dropwave/get/products/get', fetcher);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    return data
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase().trim()))
      .filter(p => (categoryFilter ? p.category === categoryFilter : true));
  }, [search, categoryFilter, data]);

  const categories = useMemo(() => {
    if (!data) return [];
    const cats = data.map(p => p.category);
    return Array.from(new Set(cats));
  }, [data]);

  if (isLoading)
    return (
      <section className="flex h-screen items-center justify-center">
        <Loader />
      </section>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">حدث خطأ أثناء تحميل البيانات</p>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Package className="text-muted-foreground/40 mx-auto mb-3 h-10 w-10" />
          <p className="text-muted-foreground text-sm">لا توجد منتجات بعد</p>
        </div>
      </div>
    );

  return (
    <section className="min-h-screen w-full py-8">
      <div className="">
        <header dir="rtl" className="mb-16">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-semibold tracking-tight text-balance">
              تصفح المنتجات
            </h1>
            <div className="flex justify-center gap-2">
              <p className="text-muted-foreground">{data?.length || 0} منتج متاح</p>
              <Boxes className="text-green-400" />
            </div>
          </div>

          <div className="bg-muted/40 text-muted-foreground mx-auto mb-9 max-w-3xl rounded-2xl p-6 text-center text-sm leading-relaxed">
            هذه المنتجات نوفرها لك مباشرة من قبل المنصة، وما عليك سوى إضافتها إلى موقعك وتحديد الربح
            الذي ترغب به. نحن نتكفل بالخزن، النقل، وتسليم أرباحك تلقائيًا.
          </div>

          <div className="relative mx-auto mb-8 max-w-2xl">
            <span className="text-muted-foreground absolute top-1/2 left-5 -translate-y-1/2">
              <Search size={20} strokeWidth={1.5} />
            </span>
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-border bg-background placeholder:text-muted-foreground focus:border-foreground/20 focus:ring-foreground/5 w-full rounded-full border px-6 py-4 pl-14 text-sm transition-all focus:ring-4 focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto whitespace-normal">
            <div
              className="flex flex-nowrap gap-3 px-2 py-2"
              style={{ flexWrap: 'wrap', rowGap: '8px', maxHeight: '90px' }}
            >
              <button
                onClick={() => setCategoryFilter('')}
                className={`rounded-xl px-4 py-2 text-center text-xs transition-all ${
                  categoryFilter === ''
                    ? 'bg-foreground text-background'
                    : 'bg-muted/60 text-foreground hover:bg-muted'
                }`}
              >
                كل الأصناف
              </button>

              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-xl px-4 py-2 text-center text-xs transition-all ${
                    categoryFilter === cat
                      ? 'bg-foreground text-background'
                      : 'text-foreground hover:bg-muted bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div
          dir="rtl"
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {(filteredProducts.length > 0 ? filteredProducts : data).map(product => (
            <ProductsCardDropWave key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
