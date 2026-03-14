// Purpose: Sticky Navbar - "use client", handles mobile menu toggle and cart button.
// Pixel-perfect match to Storefront.tsx nav implementation.

'use client';

import { Globe, Menu, ShoppingCart, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { ActiveColors, SectionsConfig, StorefrontStore, StorefrontTemplate } from '../_lib/types';
import { useCart } from '../_context/CartContext';
import { STORE_LANG_OPTIONS, useLanguage } from '../_context/LanguageContext';

interface NavbarProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  sections: SectionsConfig;
}

export default function Navbar({
  store,
  template,
  colors,
  headingStyle,
  sections,
}: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartCount, setShowCart, setCheckoutStep } = useCart();
  const { t, lang, setLang } = useLanguage();
  const templateLogo = (template as unknown as { logoImage?: string | null }).logoImage ?? null;
  const logoSrc = templateLogo || store.image;

  const sectionNav: Record<keyof SectionsConfig, { id: string; label: string }> = {
    hero: { id: 'hero-section', label: t.nav.home },
    services: { id: 'services-section', label: t.nav.services },
    works: { id: 'works-section', label: t.nav.works },
    store: { id: 'store-section', label: t.nav.store },
    testimonials: { id: 'testimonials-section', label: t.nav.testimonials },
    cta: { id: 'cta-section', label: '' },
    about: { id: 'about-section', label: t.nav.about },
  };

  const navItems = (Object.keys(sectionNav) as Array<keyof SectionsConfig>)
    .filter((k) => sections[k] && sectionNav[k].label)
    .map((k) => sectionNav[k]);

  const storeEnabled = sections.store;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setShowMobileMenu(false);
  };

  const openCart = () => {
    setCheckoutStep('cart');
    setShowCart(true);
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-border"
      style={{ backgroundColor: `${colors.bg}CC` }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo + name */}
          <div className="flex items-center gap-2">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={store.name ?? ''}
                className="w-8 h-8 rounded-xl object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <span className="text-sm font-bold" style={{ ...headingStyle, color: colors.text }}>
              {store.name}
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-xs font-medium transition-colors"
                style={{ color: `${colors.text}88` }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="storefront-language">
              {t.language.label}
            </label>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1.5">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                id="storefront-language"
                value={lang}
                onChange={(e) => setLang(e.target.value as typeof lang)}
                className="bg-transparent text-[11px] font-semibold text-foreground outline-none"
              >
                {STORE_LANG_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {storeEnabled && (
              <button
                onClick={openCart}
                className="relative w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ShoppingCart className="h-4 w-4 text-foreground" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full text-[8px] font-bold flex items-center justify-center animate-in zoom-in text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center"
            >
              {showMobileMenu ? (
                <X className="h-4 w-4 text-foreground" />
              ) : (
                <Menu className="h-4 w-4 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="sm:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
