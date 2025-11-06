'use client';

import React, { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

interface UserContextType {
  id: string | null;
}

const UserContext = createContext<UserContextType>({ id: null });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const id = session?.user?.id || null;

  return <UserContext.Provider value={{ id }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
