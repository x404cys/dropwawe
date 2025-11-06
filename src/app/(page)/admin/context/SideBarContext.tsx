'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type Section = 'landing' | 'Leaderboard' | 'orders' | 'products' | 'stats' | 'stores' | 'users';

interface SidebarContextProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<Section>('landing');

  return (
    <SidebarContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within SidebarProvider');
  return context;
}
