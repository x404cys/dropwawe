import { ReactNode } from 'react';
import Theme1Layout from './theme1/layout';
import Theme2Layout from './theme2/layout';
import Theme1HomeView from './theme1/HomeView';
import Theme1CartView from './theme1/CartView';
import Theme2HomeView from './theme2/HomeView';
import Theme2CartView from './theme2/CartView';

export type ThemeName = 'NORMAL' | 'MODERN';

type ThemeComponents = {
  Layout: React.ComponentType<{ children: ReactNode }>;
  HomeView: React.ComponentType<any>;
  CartView: React.ComponentType<any>;
};

const THEMES: Record<ThemeName, ThemeComponents> = {
  MODERN: {
    Layout: Theme1Layout,
    HomeView: Theme1HomeView,
    CartView: Theme1CartView,
  },
  NORMAL: {
    Layout: Theme2Layout,
    HomeView: Theme2HomeView,
    CartView: Theme2CartView,
  },
};

export function getTheme(themeName: ThemeName): ThemeComponents {
  return THEMES[themeName] || THEMES.NORMAL;
}
