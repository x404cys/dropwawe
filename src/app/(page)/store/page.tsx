'use client';

import { useEffect, useRef, useState } from 'react';
import getProductsByStore, { Store } from '@/app/axios/products/getProductByStore';

import { Product } from '@/types/Products';
import { useTrackVisitor } from '@/app/lib/context/SaveVisitorId';
import StoreProductGrid from '../(page)/s/[slug]/_components/StoreProductGrid';
import StoreCategoriesBar from '../(page)/s/[slug]/_components/StoreCategoriesBar';

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeName, setStoreName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const [userProps, setUserProps] = useState<Store>();
  const [searchTerm, setSearchTerm] = useState('');

  const getSubdomain = () => {
    if (typeof window === 'undefined') return 'nooor';
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) return parts[0];
    return 'nooor';
  };

  const storeSlug = getSubdomain();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    }
    if (cartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cartOpen]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByStore({ slug: storeSlug });

        setUserProps(data.store);
        const normalizedProducts: Product[] = (data?.products || []).map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image,
          quantity: p.quantity,
          category: p.category || '',
          discount: p.discount,
          // images: p.images || '',
        }));

        setProducts(normalizedProducts);
        setUserId(data?.store?.id || null);
        setStoreName(data?.store.storeSlug || '');
      } catch (err) {
        setError('حدث خطأ أثناء جلب المنتجات');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeSlug]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useTrackVisitor(storeSlug);

  return (
    <div dir="rtl" className="min-h-screen">
      <StoreCategoriesBar
        slug={storeSlug}
        userId={userId as string}
        setSearchResults={setProducts}
        setSearchTerm={setSearchTerm}
        setLoadingProducts={setLoadingProducts}
      />

      <StoreProductGrid
        user={userProps as Store}
        userId={userId as string}
        loading={loading || loadingProducts}
        error={error}
        products={filteredProducts}
        storeSlug={storeSlug}
      />
    </div>
  );
}
