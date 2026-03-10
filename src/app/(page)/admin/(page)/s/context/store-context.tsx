'use client';

import { createContext, useContext, ReactNode } from 'react';
 import { StoreProps } from '@/types/store/StoreType';

type StoreContextType = {
  store: StoreProps | null;
  isLoading: boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children, store }: { children: ReactNode; store: StoreProps }) {
  return (
    <StoreContext.Provider value={{ store, isLoading: false }}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreProps {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  if (!context.store) {
    throw new Error('Store not loaded');
  }
  return context.store;
}
