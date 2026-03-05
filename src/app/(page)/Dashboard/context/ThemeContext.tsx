'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with 'light' to match server-rendered HTML (prevents hydration mismatch)
  const [theme, setThemeState] = useState<Theme>('light');
  // Track if we've mounted (to avoid reading localStorage on server)
  const [mounted, setMounted] = useState(false);

  // On mount: read saved preference or system preference
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('app-theme') as Theme | null;
    let resolved: Theme = 'light';
    if (saved === 'dark' || saved === 'light') {
      resolved = saved;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      resolved = 'dark';
    }
    setThemeState(resolved);
  }, []);

  // Apply/remove .dark class on <html> whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme, mounted]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
