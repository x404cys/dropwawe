import Theme1Navbar from './theme1/_components/NavBar/NavBar';
import StoreFooter from './theme1/_components/Footer/Footer';
import Theme1Home from './theme1/HomeView';

import Theme2Navbar from './theme1/_components/NavBar/NavBar';
import Theme2Footer from './theme2/_components/NavBarTheme2';
import Theme2Home from './theme2/HomeView';

export type ThemeName = 'NORMAL' | 'MODERN';

export const THEMES = {
  NORMAL: {
    Navbar: Theme1Navbar,
    Footer: StoreFooter,
    HomeView: Theme1Home,
  },
  MODERN: {
    Navbar: Theme2Footer,
    Footer: StoreFooter,
    HomeView: Theme2Home,
  },
};

export function getTheme(theme: ThemeName) {
  return THEMES[theme] ?? THEMES.NORMAL;
}
