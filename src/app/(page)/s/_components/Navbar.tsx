// Purpose: Sticky Navbar — "use client", handles mobile menu toggle and cart button.
// Pixel-perfect match to Storefront.tsx nav implementation.

'use client';

import { ShoppingCart, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ActiveColors, SectionsConfig, StorefrontStore, StorefrontTemplate } from '../_lib/types';
import { useCart } from '../_context/CartContext';

interface NavbarProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  sections: SectionsConfig;
}

const SECTION_NAV: Record<string, { id: string; label: string }> = {
  hero:         { id: 'hero-section',          label: 'الرئيسية' },
  services:     { id: 'services-section',      label: 'الخدمات' },
  works:        { id: 'works-section',         label: 'الأعمال' },
  store:        { id: 'store-section',         label: 'المتجر' },
  testimonials: { id: 'testimonials-section',  label: 'آراء العملاء' },
  about:        { id: 'about-section',         label: 'من نحن' },
};

export default function Navbar({
  store, template, colors, headingStyle, sections,
}: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartCount, setShowCart, setCheckoutStep } = useCart();
  const templateLogo = (template as unknown as { logoImage?: string | null }).logoImage ?? null;
  const logoSrc = templateLogo || store.image;

  const navItems = (Object.keys(SECTION_NAV) as Array<keyof SectionsConfig>)
    .filter((k) => sections[k] && SECTION_NAV[k])
    .map((k) => SECTION_NAV[k]);

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
                className="w-full text-right px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
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
