// THEME: modern-structured — Navbar

'use client';

import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { NavbarProps } from '../../_lib/types';
import { useCart } from '../../_context/CartContext';
import { useLanguage } from '../../_context/LanguageContext';

export default function ModernStructuredNavbar({
  store,
  colors,
  fonts,
  sections,
  hasAnnouncementBar,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, setCheckoutStep, setShowCart } = useCart();
  const { t } = useLanguage();

  const navItems = useMemo(
    () =>
      [
        sections.hero ? { id: 'hero-section', label: t.nav.home } : null,
        sections.services ? { id: 'services-section', label: t.nav.services } : null,
        sections.store ? { id: 'store-section', label: t.nav.store } : null,
        sections.testimonials ? { id: 'testimonials-section', label: t.nav.testimonials } : null,
        sections.about ? { id: 'about-section', label: t.nav.about } : null,
      ].filter(Boolean) as Array<{ id: string; label: string }>,
    [sections, t.nav]
  );

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  const openCart = () => {
    setCheckoutStep('cart');
    setShowCart(true);
  };

  return (
    <header
      className={`sticky z-50 border-b border-gray-200 bg-white ${hasAnnouncementBar ? 'top-9' : 'top-0'}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo('hero-section')}
            className="flex min-w-0 items-center gap-3"
          >
            {store.image ? (
              <img
                src={store.image}
                alt={store.name ?? ''}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div
                className="h-8 w-8 rounded-lg bg-slate-100"
                style={{ backgroundColor: colors.primary }}
              />
            )}
            <span
              className="truncate text-sm font-semibold text-slate-900"
              style={{ fontFamily: fonts.heading }}
            >
              {store.name}
            </span>
          </button>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className="text-sm text-slate-500 transition-all duration-150 ease-in-out hover:text-slate-900"
              style={{ fontFamily: fonts.body }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo('store-search')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-slate-500 transition-all duration-150 ease-in-out hover:border-gray-300 hover:bg-slate-50 hover:text-slate-900"
            aria-label={t.store.searchPlaceholder}
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-slate-500 transition-all duration-150 ease-in-out hover:border-gray-300 hover:bg-slate-50 hover:text-slate-900"
            aria-label={t.store.addToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 ? (
              <span
                className="absolute -end-1 -top-1 rounded-md px-1.5 py-0.5 text-xs text-white"
                style={{ backgroundColor: colors.accent, fontFamily: fonts.body }}
              >
                {cartCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(current => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-slate-500 transition-all duration-150 ease-in-out hover:border-gray-300 hover:bg-slate-50 hover:text-slate-900 lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="mx-auto max-w-6xl px-6 pb-4 lg:hidden">
          {/* DESIGN: Mobile navigation is a compact dropdown panel so it preserves the structured SaaS feeling instead of switching to a full-screen drawer. */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="divide-y divide-gray-200">
              {navItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="block w-full px-4 py-3 text-start text-sm text-slate-600 transition-all duration-150 ease-in-out hover:bg-slate-50 hover:text-slate-900"
                  style={{ fontFamily: fonts.body }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
