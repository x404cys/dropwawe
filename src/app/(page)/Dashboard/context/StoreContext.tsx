'use client';

import { StoreProps } from '@/types/store/StoreType';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface StoreContextType {
  currentStore: StoreProps | null;
  stores: StoreProps[];
  setCurrentStoreById: (storeId: string) => void;
  setCurrentStoreByName: (storeName: string) => Promise<void>;
  setCurrentStore: (store: StoreProps | null) => void;
  fetchStores: () => Promise<void>;
  refreshCurrentStore: () => Promise<void>;
  clearStoreState: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStoreProvider = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStoreProvider must be used within StoreProvider');
  return context;
};

interface Props {
  children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [currentStore, setCurrentStoreState] = useState<StoreProps | null>(null);
  const [stores, setStores] = useState<StoreProps[]>([]);
  const [storesLoaded, setStoresLoaded] = useState(false);

  const router = useRouter();

  const storageKey = useMemo(() => {
    return userId ? `currentStoreId:${userId}` : null;
  }, [userId]);

  const clearStoreState = useCallback(() => {
    setCurrentStoreState(null);
    setStores([]);
    setStoresLoaded(false);

    if (typeof window !== 'undefined') {
      const keysToDelete: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('currentStoreId:') || key === 'currentStore') {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => localStorage.removeItem(key));
    }
  }, []);

  const persistCurrentStoreId = useCallback(
    (storeId: string | null) => {
      if (!storageKey || typeof window === 'undefined') return;

      if (!storeId) {
        localStorage.removeItem(storageKey);
        return;
      }

      localStorage.setItem(storageKey, storeId);
    },
    [storageKey]
  );

  const setCurrentStore = useCallback(
    (store: StoreProps | null) => {
      setCurrentStoreState(store);
      persistCurrentStoreId(store?.id ?? null);
    },
    [persistCurrentStoreId]
  );

  const setCurrentStoreById = useCallback(
    (storeId: string) => {
      const matchedStore = stores.find(store => store.id === storeId) ?? null;
      setCurrentStore(matchedStore);
    },
    [stores, setCurrentStore]
  );

  const setCurrentStoreByName = useCallback(
    async (storeName: string) => {
      try {
        const res = await fetch(
          `/api/dashboard/store/get-store-info?sublink=${encodeURIComponent(storeName)}`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch store info: ${res.status}`);
        }

        const data = await res.json();

        if (data?.store) {
          setCurrentStore(data.store);
        }
      } catch (err) {
        console.error('Failed to set store by name:', err);
      }
    },
    [setCurrentStore]
  );

  const fetchStores = useCallback(async () => {
    if (!userId) {
      clearStoreState();
      return;
    }

    try {
      setStoresLoaded(false);

      const res = await fetch(`/api/dashboard/store/get-stores`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch stores: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid stores response');
      }

      setStores(data);

      const storedStoreId =
        storageKey && typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

      let nextCurrentStore: StoreProps | null = null;

      if (storedStoreId) {
        nextCurrentStore = data.find(store => store.id === storedStoreId) ?? null;
      }

      if (!nextCurrentStore && currentStore?.id) {
        nextCurrentStore = data.find(store => store.id === currentStore.id) ?? null;
      }

      if (!nextCurrentStore && data.length > 0) {
        nextCurrentStore = data[0];
      }

      setCurrentStore(nextCurrentStore);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setStores([]);
      setCurrentStore(null);
    } finally {
      setStoresLoaded(true);
    }
  }, [userId, storageKey, currentStore?.id, clearStoreState, setCurrentStore]);

  const refreshCurrentStore = useCallback(async () => {
    if (!currentStore?.id) return;

    try {
      const res = await fetch(`/api/dashboard/store/get-store-info?id=${currentStore.id}`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to refresh current store: ${res.status}`);
      }

      const data = await res.json();

      if (data?.store) {
        setCurrentStore(data.store);

        setStores(prev => prev.map(store => (store.id === data.store.id ? data.store : store)));
      } else {
        await fetchStores();
      }
    } catch (err) {
      console.error('Failed to refresh current store:', err);
    }
  }, [currentStore?.id, fetchStores, setCurrentStore]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !userId) {
      clearStoreState();
      return;
    }

    fetchStores();
  }, [status, userId, fetchStores, clearStoreState]);

  useEffect(() => {
    if (!storesLoaded) return;
    if (stores.length > 0) return;
    if (!userId) return;

    const timer = setTimeout(() => {
      toast.warning('عزيزي لا تملك متجر، أنشئ واحدًا');
      router.push('/create-store');
    }, 60 * 1000);

    return () => clearTimeout(timer);
  }, [storesLoaded, stores.length, userId, router]);

  return (
    <StoreContext.Provider
      value={{
        currentStore,
        stores,
        setCurrentStoreById,
        setCurrentStoreByName,
        setCurrentStore,
        fetchStores,
        refreshCurrentStore,
        clearStoreState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
