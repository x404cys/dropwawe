import cleanMarketplace from './theme-clean-marketplace';
import darkLuxury from './theme-dark-luxury';
import defaultTheme from './theme-default-theme';
import glassmorphism from './theme-glassmorphism';
import minimalLight from './theme-minimal-light';
import modernStructured from './theme-modern-structured';
import techFuturistic from './theme-tech-futuristic';
import type { ThemeConfig } from './types';

export const themes: ThemeConfig[] = [];

themes[0] = darkLuxury;
themes[1] = minimalLight;
themes[5] = techFuturistic;
themes[6] = cleanMarketplace;
themes[7] = modernStructured;
themes[8] = glassmorphism;
themes[9] = defaultTheme;

export function getTheme(preset: number): ThemeConfig {
  return themes[preset] ?? themes[9];
}
