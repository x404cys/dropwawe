'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import axios from 'axios';
import { Product } from '@/types/Products';
import { useStore } from './store-context';
import { StoreProps } from '@/types/store/StoreType';

interface ProductsContextProps {
  products: Product[];
  filteredProducts: Product[];
  filteredProductsByCategory: Product[];
  categories: string[];
  selectedCategory: string | null;
  setCategory: (cat: string | null) => void;
  search: string;
  setSearch: (val: string) => void;
  store: StoreProps;
  selectedCategoryList: string | null;
  setCategoryList: (cat: string | null) => void;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextProps | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setCategory] = useState<string | null>(null);
  const [selectedCategoryList, setCategoryList] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!store?.id) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Product[]>(`/api/storev2/products/${store.subLink}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [store.id]);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  const filteredProducts = useMemo(() => {
    let res = [...products];
    if (selectedCategory) {
      res = res.filter(p => p.category === selectedCategory);
    }
    if (search) {
      res = res.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return res;
  }, [products, selectedCategory, search]);

  const filteredProductsByCategory = useMemo(() => {
    if (!selectedCategoryList) return products;
    return products.filter(p => p.category === selectedCategoryList);
  }, [products, selectedCategoryList]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        filteredProductsByCategory,
        categories,
        selectedCategory,
        setCategory,
        search,
        setSearch,
        store,
        selectedCategoryList,
        setCategoryList,
        loading
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
