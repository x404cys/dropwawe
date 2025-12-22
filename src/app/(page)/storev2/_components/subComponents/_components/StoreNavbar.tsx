'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/app/lib/context/CartContext';
import MobileSearch from './_components4NavBar/MobileSearch';
import FilterBox from './_components4NavBar/FilterBox';
import DesktopSearch from './_components4NavBar/DesktopSearch';
import { Product } from '@/types/Products';
import getProductsByStore from '@/app/axios/products/getProductByStore';
import { Skeleton } from '@/components/ui/skeleton';
import NavbarActions from './_components4NavBar/NavbarActions';
import { useProducts } from '../../../Data/context/products/ProductsContext';
import { useFavorite } from '@/app/lib/context/FavContext';

export default function StoreNavbarV1({ slug }: { slug: string }) {
  const { getCartByKey, getTotalQuantityByKey } = useCart();
  const { store } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('كل التصنيفات');
  const [categories, setCategories] = useState<string[]>(['كل التصنيفات']);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getFavoritesByKey, clearFavoritesByKey, getTotalFavoritesByKey } = useFavorite();
  const FAVORITE_KEY = `fav/${store?.id}`;

  const filterBoxRefMobile = useRef<HTMLDivElement>(null);
  const filterBoxRefDesktop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/products/categories/${store?.id}`);
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
  }, [store?.id]);

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
              <h1 className="text-lg font-semibold">{store?.name}</h1>
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

          <NavbarActions userId={store?.id as string} storeSlug={slug as string} />
        </>
      )}
    </nav>
  );
}
