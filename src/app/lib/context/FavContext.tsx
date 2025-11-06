'use client';
import { Product } from '@/types/Products';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

 
type FavoriteContextType = {
  addToFavoriteByKey: (item: Product, keyName: string) => void;
  removeFromFavoriteByKey: (id: string, keyName: string) => void;
  clearFavoritesByKey: (keyName: string) => void;
  getFavoritesByKey: (keyName: string) => Product[];
  isInFavoriteByKey: (id: string, keyName: string) => boolean;
  getTotalFavoritesByKey: (keyName: string) => number;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Record<string, Product[]>>({});

   useEffect(() => {
    const initialFavs: Record<string, Product[]> = {};
    Object.keys(localStorage).forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) initialFavs[key] = JSON.parse(data);
      } catch {}
    });
    setFavorites(initialFavs);
  }, []);

  const persist = (items: Product[], keyName: string) => {
    localStorage.setItem(keyName, JSON.stringify(items));
    setFavorites(prev => ({ ...prev, [keyName]: items }));
  };

  const getFavoritesByKey = (keyName: string) => favorites[keyName] || [];

  const addToFavoriteByKey = (item: Product, keyName: string) => {
    const prev = getFavoritesByKey(keyName);
    const exists = prev.some(fav => fav.id === item.id);
    if (!exists) {
      const updated = [...prev, item];
      persist(updated, keyName);
    }
  };

  const removeFromFavoriteByKey = (id: string, keyName: string) => {
    const prev = getFavoritesByKey(keyName);
    const updated = prev.filter(item => item.id !== id);
    persist(updated, keyName);
  };

  const clearFavoritesByKey = (keyName: string) => {
    localStorage.removeItem(keyName);
    setFavorites(prev => ({ ...prev, [keyName]: [] }));
  };

  const isInFavoriteByKey = (id: string, keyName: string) => {
    return getFavoritesByKey(keyName).some(item => item.id === id);
  };

  const getTotalFavoritesByKey = (keyName: string) => {
    return getFavoritesByKey(keyName).length;
  };

  return (
    <FavoriteContext.Provider
      value={{
        addToFavoriteByKey,
        removeFromFavoriteByKey,
        clearFavoritesByKey,
        getFavoritesByKey,
        isInFavoriteByKey,
        getTotalFavoritesByKey,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error('useFavorite must be used within a FavoriteProvider');
  return context;
};
