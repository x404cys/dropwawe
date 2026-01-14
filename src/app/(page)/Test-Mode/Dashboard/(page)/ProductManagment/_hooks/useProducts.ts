'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/types/Products';

export function useProducts(userId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/products/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('فشل في جلب المنتجات');
        return res.json();
      })
      .then(setProducts)
      .catch(err => console.error(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { products, setProducts, loading };
}
