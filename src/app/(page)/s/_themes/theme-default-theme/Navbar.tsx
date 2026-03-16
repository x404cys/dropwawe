// THEME: default-theme - Navbar

'use client';

import { Menu, Search, ShoppingCart, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { NavbarProps } from '../../_lib/types';
import { useCart } from '../../_context/CartContext';

const sectionNavMap = {
  hero: { scrollId: 'hero-section', label: 'الرئيسية' },
  services: { scrollId: 'services-section', label: 'الخدمات' },
  works: { scrollId: 'works-section', label: 'الأعمال' },
  store: { scrollId: 'store-section', label: 'المتجر' },
  testimonials: { scrollId: 'testimonials-section', label: 'آراء العملاء' },
  about: { scrollId: 'about-section', label: 'من نحن' },
  cta: { scrollId: 'cta-section', label: 'تواصل معنا' },
} as const;

export default function DefaultThemeNavbar({
  store,
  template,
  colors,
  fonts,
  sections,
}: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartCount, setCheckoutStep, setShowCart } = useCart();

  const navItems = useMemo(
    () =>
      Object.entries(sectionNavMap)
        .filter(([key]) => sections[key as keyof typeof sections])
        .map(([, item]) => item),
    [sections]
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setShowMobileMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      {/* DESIGN: The navbar recreates the original storefront balance: logo block, centered section links, cart/search utilities. */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            {store.image ? (
              <img
                src={store.image}
                alt={store.name ?? ''}
                className="h-8 w-8 rounded-xl object-cover"
              />
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.primary }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <span
                className="block truncate text-sm font-bold text-gray-900"
                style={{ fontFamily: fonts.heading }}
              >
                {store.name}
              </span>
              {template.tagline ? (
                <span className="hidden truncate text-[10px] text-gray-400 sm:block">
                  {template.tagline}
                </span>
              ) : null}
            </div>
          </div>

          <div className="hidden items-center gap-6 sm:flex">
            {navItems.map(item => (
              <button
                key={item.scrollId}
                type="button"
                onClick={() => scrollTo(item.scrollId)}
                className="text-xs font-medium text-gray-600 transition-colors duration-200 ease-in-out hover:text-gray-900"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {sections.store ? (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('store-search')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-900 sm:flex"
                aria-label="بحث"
              >
                <Search className="h-4 w-4" />
              </button>
            ) : null}

            {sections.store ? (
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('cart');
                  setShowCart(true);
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-50 hover:text-gray-900"
                aria-label="السلة"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 ? (
                  <span
                    className="absolute -end-1.5 -top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[8px] font-bold text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {cartCount}
                  </span>
                ) : null}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setShowMobileMenu(current => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-50 sm:hidden"
              aria-label="القائمة"
            >
              {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu ? (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl sm:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map(item => (
              <button
                key={item.scrollId}
                type="button"
                onClick={() => scrollTo(item.scrollId)}
                className="w-full rounded-xl px-3 py-2.5 text-start text-sm font-medium text-gray-800 transition-colors duration-200 ease-in-out hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
