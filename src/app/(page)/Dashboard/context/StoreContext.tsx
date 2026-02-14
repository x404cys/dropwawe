'use client';

import { StoreProps } from '@/types/store/StoreType';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

interface StoreContextType {
  currentStore: StoreProps | null;
  stores: StoreProps[];
  setCurrentStoreByName: (storeName: string) => Promise<void>;
  setCurrentStore: (store: StoreProps) => void;
  fetchStores: () => Promise<void>;
  refreshCurrentStore: () => Promise<void>;
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
  const [currentStore, setCurrentStoreState] = useState<StoreProps | null>(null);
  const [stores, setStores] = useState<StoreProps[]>([]);
  const [storesLoaded, setStoresLoaded] = useState(false);
  const router = useRouter();
  const setCurrentStore = (store: StoreProps) => {
    setCurrentStoreState(store);
    localStorage.setItem('currentStore', JSON.stringify(store));
  };

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

  const fetchStores = async () => {
    try {
      const res = await fetch(`/api/dashboard/store/get-stores`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setStores(data);
        setStoresLoaded(true);

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
      setStoresLoaded(true);
    }
  };

  const refreshCurrentStore = async () => {
    if (!currentStore) return;

    try {
      const res = await fetch(
        `/api/dashboard/store/get-store-info?sublink=${encodeURIComponent(currentStore.subLink as string)}`
      );
      const data = await res.json();
      if (data?.store) {
        setCurrentStore(data.store);
      }
    } catch (err) {
      console.error('Failed to refresh current store:', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);
  useEffect(() => {
    if (!storesLoaded) return;

    if (stores.length > 0) return;

    const timer = setTimeout(() => {
      toast.warning('عزيزي لا تملك متجر انشاء واحد');
      router.push('/Dashboard/create-store');
    }, 60 * 1000);

    return () => clearTimeout(timer);
  }, [storesLoaded, stores.length]);

  return (
    <StoreContext.Provider
      value={{
        currentStore,
        stores,
        setCurrentStoreByName,
        setCurrentStore,
        fetchStores,
        refreshCurrentStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
