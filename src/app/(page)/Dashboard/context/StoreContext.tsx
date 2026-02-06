// app/context/StoreContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Store {
  id: string;
  name: string;
  subLink?: string;
  shippingPrice?: number;
  hasReturnPolicy?: string;
}

interface StoreContextType {
  currentStore: Store | null;
  stores: Store[];
  setCurrentStoreByName: (storeName: string) => Promise<void>;
  setCurrentStore: (store: Store) => void;
  fetchStores: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStoreProvider = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

interface Props {
  children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

  // حفظ المتجر الحالي محليًا
  const setCurrentStore = (store: Store) => {
    setCurrentStoreState(store);
    localStorage.setItem('currentStore', JSON.stringify(store));
  };

  // جلب متجر حسب الاسم وتعيينه
  const setCurrentStoreByName = async (storeName: string) => {
    try {
      const res = await fetch(
        `/api/dashboard/store/get-store-info?sublink=${encodeURIComponent(storeName)}`
      );
      const data = await res.json();
      if (data?.store) setCurrentStore(data.store);
    } catch (err) {
      console.error('Failed to set store by name:', err);
    }
  };

  // جلب كل المتاجر
  const fetchStores = async () => {
    try {
      const res = await fetch(`/api/dashboard/store/get-stores`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setStores(data);

        // اختر أول متجر تلقائياً إذا لم يكن مخزن مسبقًا
        if (!currentStore) {
          const stored = localStorage.getItem('currentStore');
          if (stored) {
            setCurrentStoreState(JSON.parse(stored));
          } else if (data.length > 0) {
            setCurrentStore(data[0]);
            localStorage.setItem('currentStore', JSON.stringify(data[0]));
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        currentStore,
        stores,
        setCurrentStoreByName,
        setCurrentStore,
        fetchStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
