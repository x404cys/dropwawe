// THEME: default-theme - Navbar

'use client';

import { Globe, Menu, Search, ShoppingCart, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { NavbarProps } from '../../_lib/types';
import { useCart } from '../../_context/CartContext';
import { STORE_LANG_OPTIONS, useLanguage } from '../../_context/LanguageContext';
import { getReadableTextColor } from './themeSystem';

export default function DefaultThemeNavbar({
  store,
  template,
  colors,
  sections,
  fonts,
}: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartCount, setCheckoutStep, setShowCart } = useCart();
  const { t, lang, setLang } = useLanguage();
  const primaryTextColor = getReadableTextColor(colors.primary);

  const navItems = useMemo(
    () =>
      [
        sections.hero ? { scrollId: 'hero-section', label: t.nav.home } : null,
        sections.services ? { scrollId: 'services-section', label: t.nav.services } : null,
        sections.works ? { scrollId: 'works-section', label: t.nav.works } : null,
        sections.store ? { scrollId: 'store-section', label: t.nav.store } : null,
        sections.testimonials
          ? { scrollId: 'testimonials-section', label: t.nav.testimonials }
          : null,
        sections.about ? { scrollId: 'about-section', label: t.nav.about } : null,
        sections.cta ? { scrollId: 'cta-section', label: t.about.contactTitle } : null,
      ].filter(Boolean) as Array<{ scrollId: string; label: string }>,
    [sections, t]
  );

  const cycleLanguage = () => {
    const currentIndex = STORE_LANG_OPTIONS.findIndex(option => option.value === lang);
    const nextOption = STORE_LANG_OPTIONS[(currentIndex + 1) % STORE_LANG_OPTIONS.length];
    setLang(nextOption.value);
  };

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
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--store-bg) 92%, transparent)',
        borderColor: 'var(--store-border)',
      }}
    >
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
                style={{ backgroundColor: 'var(--store-primary)' }}
              >
                <Sparkles className="h-4 w-4" style={{ color: primaryTextColor }} />
              </div>
            )}
            <div className="min-w-0">
              <span
                className="block truncate text-sm font-bold"
                style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
              >
                {store.name}
              </span>
              {template.tagline ? (
                <span
                  className="hidden truncate text-[10px] sm:block"
                  style={{ color: 'var(--store-text-faint)' }}
                >
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
                className="cursor-pointer text-xs font-medium transition-opacity duration-200 ease-in-out hover:opacity-75"
                style={{ color: 'var(--store-text-muted)' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cycleLanguage}
              className="flex h-9 min-w-[56px] items-center justify-center gap-1 rounded-xl border px-2.5 transition-opacity duration-200 ease-in-out hover:opacity-90"
              style={{
                backgroundColor: 'var(--store-surface)',
                borderColor: 'var(--store-border)',
                color: 'var(--store-text)',
              }}
              aria-label={t.language.label}
              title={t.language.label}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase">{lang}</span>
            </button>

            {sections.store ? (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('store-search')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                className="hidden h-9 w-9 items-center justify-center rounded-xl border transition-opacity duration-200 ease-in-out hover:opacity-90 sm:flex"
                style={{
                  backgroundColor: 'var(--store-surface)',
                  borderColor: 'var(--store-border)',
                  color: 'var(--store-text-muted)',
                }}
                aria-label={t.store.searchPlaceholder}
              >
                <Search className="h-4 w-4" />
              </button>
            ) : null}

            {sections.store ? (
              <button
                type="button"
                onClick={openCart}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-opacity duration-200 ease-in-out hover:opacity-90"
                style={{
                  backgroundColor: 'var(--store-surface)',
                  borderColor: 'var(--store-border)',
                  color: 'var(--store-text)',
                }}
                aria-label={t.store.addToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 ? (
                  <span
                    className="absolute -end-1.5 -top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[8px] font-bold"
                    style={{ backgroundColor: 'var(--store-primary)', color: primaryTextColor }}
                  >
                    {cartCount}
                  </span>
                ) : null}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setShowMobileMenu(current => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border transition-opacity duration-200 ease-in-out hover:opacity-90 sm:hidden"
              style={{
                backgroundColor: 'var(--store-surface)',
                borderColor: 'var(--store-border)',
                color: 'var(--store-text)',
              }}
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
            >
              {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu ? (
        <div
          className="border-t backdrop-blur-xl sm:hidden"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--store-bg) 96%, transparent)',
            borderColor: 'var(--store-border)',
          }}
        >
          <div className="space-y-3 px-4 py-3">
            <button
              type="button"
              onClick={cycleLanguage}
              className="flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-start text-sm font-medium transition-opacity duration-200 ease-in-out hover:opacity-90"
              style={{
                backgroundColor: 'var(--store-surface)',
                borderColor: 'var(--store-border)',
                color: 'var(--store-text)',
              }}
              aria-label={t.language.label}
            >
              <span>{t.language.label}</span>
              <span
                className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase"
                style={{ color: 'var(--store-text-muted)' }}
              >
                <Globe className="h-3.5 w-3.5" />
                {lang}
              </span>
            </button>

            {navItems.map(item => (
              <button
                key={item.scrollId}
                type="button"
                onClick={() => scrollTo(item.scrollId)}
                className="w-full rounded-xl px-3 py-2.5 text-start text-sm font-medium transition-opacity duration-200 ease-in-out hover:opacity-90"
                style={{
                  backgroundColor: 'var(--store-surface)',
                  color: 'var(--store-text)',
                }}
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
