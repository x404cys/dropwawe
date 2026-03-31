import defaultTheme from './theme-default-theme';
import themeclothesno1 from './theme-clothes-no1';
import defaultTheme2 from './theme-default-theme-2';
import type { ThemeConfig } from './types';

export const themes: ThemeConfig[] = [];

themes[1] = defaultTheme;
themes[2] = themeclothesno1;
themes[3] = defaultTheme2;

export function getTheme(preset: number): ThemeConfig {
  return themes[preset] ?? themes[2];
}
