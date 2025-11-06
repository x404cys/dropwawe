'use client';

import React, { createContext, useContext } from 'react';
import useSWR from 'swr';

type ApiContextType = {
  useFetchData: <T>(endpoint: string) => { data?: T; error?: Error; isLoading: boolean };
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useFetchData = <T,>(endpoint: string) => {
    const { data, error, isLoading } = useSWR<T>(endpoint, fetcher);
    return { data, error, isLoading };
  };

  return <ApiContext.Provider value={{ useFetchData }}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
