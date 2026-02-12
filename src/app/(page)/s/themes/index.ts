import Theme1Navbar from './theme1/_components/NavBar/NavBar';
import StoreFooter from './theme1/_components/Footer/Footer';
import Theme1Home from './theme1/HomeView';

import Theme2Footer from './theme2/_components/NavBarTheme2';
import Theme2Home from './theme2/HomeView';
import Theme3Navbar from './theme3/_components/Header';
import HomeViewTheme3 from './theme3/HomeView';
import StoreFooterTheme3 from './theme3/_components/FooterTheme3';
export type ThemeName = 'NORMAL' | 'MODERN' | 'RAMADAN';

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
  RAMADAN: {
    Navbar: Theme3Navbar,
    Footer: StoreFooterTheme3,
    HomeView: HomeViewTheme3,
  },
};

export function getTheme(theme: ThemeName) {
  return THEMES[theme] ?? THEMES.RAMADAN;
}
