'use client';

import { Product } from '@/types/Products';
import { StoreProps } from '@/types/store/StoreType';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

interface ProductsContextProps {
  product: Product[];
  filteredProduct: Product[];
  filteredProductsByCategory: Product[];
  categories: string[];
  selectedCategory: string | null;
  setCategory: (cat: string | null) => void;
  search: string;
  setSearch: (val: string) => void;
  store: StoreProps | null;
  selectedCategoryList: string | null;
  setCategoryLiset: (cat: string | null) => void;
}

const ProductsContext = createContext<ProductsContextProps | null>(null);

export default function ProductsProvider({
  subLink,
  children,
}: {
  subLink: string;
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredProductsByCategory, setFilteredProductsByCategory] = useState<Product[]>([]);
  const [selectedCategory, setCategory] = useState<string | null>(null);
  const [selectedCategoryList, setCategoryLiset] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [store, setStore] = useState<StoreProps | null>(null);
  
  useEffect(() => {
    if (!subLink) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>(`/api/storev2/products/${subLink}`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [subLink]);

  useEffect(() => {
    let resu = [...products];
    if (selectedCategory) {
      resu = resu.filter(p => p.category === selectedCategory);
    }
    if (search) {
      resu = resu.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredProducts(resu);
  }, [products, selectedCategory, search]);
  useEffect(() => {
    let resu = [...products];
    if (selectedCategoryList) {
      resu = resu.filter(p => p.category === selectedCategoryList);
    }
    setFilteredProductsByCategory(resu);
  }, [products, selectedCategoryList]);
  useEffect(() => {
    if (!subLink) return;

    const fetchStoreInfo = async () => {
      try {
        const res = await axios.get<StoreProps>(`/api/storev2/info/${subLink}`);
        setStore(res.data);
      } catch (err) {
        console.error('Error fetching store info:', err);
      }
    };

    fetchStoreInfo();
  }, [subLink]);

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <ProductsContext.Provider
      value={{
        product: products,
        filteredProduct: filteredProducts,
        categories,
        selectedCategory,
        setCategory,
        search,
        setSearch,
        store,
        selectedCategoryList,
        filteredProductsByCategory,
        setCategoryLiset,
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
