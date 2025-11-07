'use client';

import { useEffect, useRef, useState } from 'react';

import { Product } from '@/types/Products';
import getProductsByStore from '@/app/axios/products/getProductByStore';
import { Skeleton } from '@/components/ui/skeleton';
import MobileSearch from '../subComponents/_components/_components4NavBar/MobileSearch';
import FilterBox from '../subComponents/_components/_components4NavBar/FilterBox';
import DesktopSearch from '../subComponents/_components/_components4NavBar/DesktopSearch';
import NavbarActions from '../subComponents/_components/_components4NavBar/NavbarActions';
 

export default function StoreNavBarV1({ slug }: { slug: string }) {
  const [storeName, setStoreName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('كل التصنيفات');
  const [categories, setCategories] = useState<string[]>(['كل التصنيفات']);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [loading, setLoading] = useState(true);

  const filterBoxRefMobile = useRef<HTMLDivElement>(null);
  const filterBoxRefDesktop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/store/getstorename/${slug}`)
      .then(res => res.json())
      .then(data => setStoreName(data.storeName))
      .catch(() => setStoreName(''))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const fetchStore = async () => {
      try {
        const res = await getProductsByStore({ slug: slug as string });
        setUserId(res.store?.id || null);
      } catch (err) {
        console.error(err);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [slug]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/products/categories/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: string[] = await res.json();
        setCategories(['كل التصنيفات', ...(Array.isArray(data) ? data : [])]);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories(['كل التصنيفات']);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [userId]);

  const fetchProducts = (cat?: string) => {
    if (!slug) return;
    const categoryQuery =
      cat && cat !== 'كل التصنيفات' ? `&category=${encodeURIComponent(cat)}` : '';
    const minQuery = minPrice !== '' ? `&minPrice=${minPrice}` : '';
    const maxQuery = maxPrice !== '' ? `&maxPrice=${maxPrice}` : '';

    fetch(
      `/api/search?search=${encodeURIComponent(searchTerm)}&slug=${slug}${categoryQuery}${minQuery}${maxQuery}`
    )
      .then(res => res.json())
      .then(data => setSearchResults(data.products || []))
      .catch(() => setSearchResults([]));
  };

  useEffect(() => {
    fetchProducts(category);
  }, [searchTerm, slug, minPrice, maxPrice, category]);

  return (
    <nav
      className="sticky top-0 z-50 mt-4 flex flex-col gap-2 rounded-xl border bg-white px-4 py-2 md:flex md:flex-row md:items-center md:justify-between md:px-6"
      dir="rtl"
    >
      {loading ? (
        <div className="flex w-full items-center justify-center py-3">
          <Skeleton></Skeleton>
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between md:w-auto">
              <h1 className="text-lg font-semibold">{storeName}</h1>
              <div className="md:hidden">
                <MobileSearch
                  categories={categories}
                  category={category}
                  setCategory={setCategory}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  slug={slug as string}
                />
              </div>
            </div>
          </div>

          {showFilterBox && (
            <FilterBox
              categories={categories}
              category={category}
              setCategory={cat => {
                setCategory(cat);
                fetchProducts(cat);
              }}
              minPrice={minPrice}
              setMinPrice={value => {
                setMinPrice(value);
                fetchProducts(category);
              }}
              maxPrice={maxPrice}
              setMaxPrice={value => {
                setMaxPrice(value);
                fetchProducts(category);
              }}
              ref={filterBoxRefMobile}
            />
          )}

          <DesktopSearch
            slug={slug as string}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            categories={categories}
            category={category}
            setCategory={cat => {
              setCategory(cat);
              fetchProducts(cat);
            }}
            minPrice={minPrice}
            setMinPrice={value => {
              setMinPrice(value);
              fetchProducts(category);
            }}
            maxPrice={maxPrice}
            setMaxPrice={value => {
              setMaxPrice(value);
              fetchProducts(category);
            }}
            showFilterBox={showFilterBox}
            setShowFilterBox={setShowFilterBox}
            ref={filterBoxRefDesktop}
          />

          <NavbarActions userId={userId as string} storeSlug={slug as string} />
        </>
      )}
    </nav>
  );
}
