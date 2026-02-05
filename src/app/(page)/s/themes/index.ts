import Theme1Navbar from './theme1/_components/NavBar/NavBar';
import Theme1Footer from './theme1/_components/NavBar/NavBar';
import Theme1Home from './theme1/HomeView';

import Theme2Navbar from './theme1/_components/NavBar/NavBar';
import Theme2Footer from './theme1/_components/NavBar/NavBar';
import Theme2Home from './theme2/HomeView';

export type ThemeName = 'NORMAL' | 'MODERN';

export const THEMES = {
  NORMAL: {
    Navbar: Theme1Navbar,
    Footer: Theme1Footer,
    HomeView: Theme1Home,
  },
  MODERN: {
    Navbar: Theme2Navbar,
    Footer: Theme2Footer,
    HomeView: Theme2Home,
  },
};

export function getTheme(theme: ThemeName) {
  return THEMES[theme] ?? THEMES.NORMAL;
}
