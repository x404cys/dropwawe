'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/Products';
import { Skeleton } from '@/components/ui/skeleton';

interface StoreCategoriesBarProps {
  userId: string;
  slug: string;
  setSearchResults: (products: Product[]) => void;
  setSearchTerm?: (term: string) => void;
  setLoadingProducts?: (loading: boolean) => void;
}

export default function StoreCategoriesBar({
  userId,
  slug,
  setSearchResults,
  setSearchTerm,
  setLoadingProducts,
}: StoreCategoriesBarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');

  useEffect(() => {
    if (!userId) return;

    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const res = await fetch(`/api/products/categories/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: string[] = await res.json();
        setCategories(['الكل', ...data]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, [userId]);

  const handleCategoryClick = async (category: string) => {
    setActiveCategory(category);
    if (setSearchTerm) setSearchTerm('');
    if (setLoadingProducts) setLoadingProducts(true);
    setSearchResults([]);

    try {
      let url = '';
      if (category === 'الكل') {
        url = `/api/store/${slug}/products`;
      } else {
        url = `/api/category/${slug}/productsByCategory?category=${encodeURIComponent(category)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      if (setLoadingProducts) setLoadingProducts(false);
    }
  };

  if (loadingCategories)
    return (
      <div className="flex gap-2 py-4">
        <Skeleton className="flex-shrink-0 rounded-full border bg-gray-300 px-4 py-3 text-xs font-medium transition"></Skeleton>
        <Skeleton className="flex-shrink-0 rounded-full border bg-gray-300 px-4 py-3 text-xs font-medium transition"></Skeleton>
        <Skeleton className="flex-shrink-0 rounded-full border bg-gray-300 px-4 py-3 text-xs font-medium transition"></Skeleton>
        <Skeleton className="flex-shrink-0 rounded-full border bg-gray-300 px-4 py-3 text-xs font-medium transition"></Skeleton>
      </div>
    );

  return (
    <div className="relative my-4">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-1 py-1 whitespace-nowrap">
        {categories.map((name, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(name)}
            className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              activeCategory === name
                ? 'border-gray-950 bg-gray-950 text-white'
                : 'border-gray-300  text-gray-700   hover:text-gray-950'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
