'use client';

import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { NavbarProps } from '../../_lib/types';
import { useCart } from '../../_context/CartContext';
import {
  borderStyle,
  mutedTextStyle,
  pageStyle,
  storefrontContainerClass,
} from './themeSystem';

const sectionNavMap = {
  hero: { scrollId: 'hero-section', label: 'الرئيسية' },
  services: { scrollId: 'services-section', label: 'الخدمات' },
  works: { scrollId: 'works-section', label: 'الأعمال' },
  store: { scrollId: 'store-section', label: 'المتجر' },
  testimonials: { scrollId: 'testimonials-section', label: 'الآراء' },
  about: { scrollId: 'about-section', label: 'من نحن' },
  cta: { scrollId: 'cta-section', label: 'تواصل' },
} as const;

const iconButtonClass =
  'flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200';

export default function DefaultThemeNavbar({
  store,
  template,
  sections,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { cartCount, setCheckoutStep, setShowCart } = useCart();

  const navItems = useMemo(
    () =>
      Object.entries(sectionNavMap)
        .filter(([key]) => sections[key as keyof typeof sections])
        .map(([, item]) => item),
    [sections]
  );

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const openCart = () => {
    setCheckoutStep('cart');
    setShowCart(true);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b transition-all duration-200"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--store-bg) 92%, transparent)',
        borderColor: hasScrolled ? 'var(--store-border)' : 'transparent',
        boxShadow: hasScrolled ? 'var(--store-shadow-sm)' : 'none',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className={storefrontContainerClass}>
        <div className="grid h-18 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo('hero-section')}
            className="flex min-w-0 items-center gap-3 justify-self-start text-start"
          >
            {store.image ? (
              <img
                src={store.image}
                alt={store.name ?? ''}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                style={{
                  backgroundColor: 'var(--store-primary-soft)',
                  color: 'var(--store-primary)',
                }}
              >
                {(store.name ?? 'S').trim().charAt(0)}
              </span>
            )}

            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-[-0.02em]">
                {store.name}
              </span>
              {template.tagline ? (
                <span className="hidden truncate text-xs sm:block" style={mutedTextStyle}>
                  {template.tagline}
                </span>
              ) : null}
            </span>
          </button>

          <nav className="hidden items-center gap-7 justify-self-center lg:flex">
            {navItems.map(item => (
              <button
                key={item.scrollId}
                type="button"
                onClick={() => scrollTo(item.scrollId)}
                className="text-sm font-medium tracking-[-0.01em] transition-colors duration-200"
                style={mutedTextStyle}
                onMouseEnter={event => {
                  event.currentTarget.style.color = 'var(--store-text)';
                }}
                onMouseLeave={event => {
                  event.currentTarget.style.color = 'var(--store-text-muted)';
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center justify-self-end gap-2">
            {sections.store ? (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('store-search')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                className={iconButtonClass}
                style={{
                  ...borderStyle,
                  ...pageStyle,
                  backgroundColor: 'color-mix(in srgb, var(--store-bg) 94%, transparent)',
                }}
                aria-label="بحث"
              >
                <Search className="h-4 w-4" />
              </button>
            ) : null}

            {sections.store ? (
              <button
                type="button"
                onClick={openCart}
                className={`${iconButtonClass} relative`}
                style={{
                  ...borderStyle,
                  ...pageStyle,
                  backgroundColor: 'color-mix(in srgb, var(--store-bg) 94%, transparent)',
                }}
                aria-label="السلة"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 ? (
                  <span
                    className="absolute -end-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: 'var(--store-primary)' }}
                  >
                    {cartCount}
                  </span>
                ) : null}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setMenuOpen(current => !current)}
              className={`lg:hidden ${iconButtonClass}`}
              style={{
                ...borderStyle,
                ...pageStyle,
                backgroundColor: 'color-mix(in srgb, var(--store-bg) 94%, transparent)',
              }}
              aria-label="القائمة"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t transition-all duration-200 lg:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          borderColor: menuOpen ? 'var(--store-border)' : 'transparent',
          backgroundColor: 'color-mix(in srgb, var(--store-bg) 96%, transparent)',
        }}
      >
        <div className={`${storefrontContainerClass} flex flex-col gap-1 py-3`}>
          {navItems.map(item => (
            <button
              key={item.scrollId}
              type="button"
              onClick={() => scrollTo(item.scrollId)}
              className="rounded-xl px-3 py-3 text-start text-sm font-medium transition-colors duration-200"
              style={{
                color: 'var(--store-text-muted)',
              }}
              onMouseEnter={event => {
                event.currentTarget.style.backgroundColor = 'var(--store-primary-faint)';
                event.currentTarget.style.color = 'var(--store-text)';
              }}
              onMouseLeave={event => {
                event.currentTarget.style.backgroundColor = 'transparent';
                event.currentTarget.style.color = 'var(--store-text-muted)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
