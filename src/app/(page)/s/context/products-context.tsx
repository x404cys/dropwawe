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
}

const ProductsContext = createContext<ProductsContextProps | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const store = useStore(); // dynamic store from StoreContext

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setCategory] = useState<string | null>(null);
  const [selectedCategoryList, setCategoryList] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // 1️⃣ Fetch products once per store.id
  useEffect(() => {
    if (!store?.id) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>(`/api/storev2/products/${store.id}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [store.id]);

  // 2️⃣ Categories list
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  // 3️⃣ Filtered products by search + selectedCategory
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

  // 4️⃣ Filtered products by selectedCategoryList
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
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

// Hook to use products anywhere
export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
