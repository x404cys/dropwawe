// THEME: minimal-light — Navbar

'use client';

import { Globe, Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { NavbarProps } from '../../_lib/types';
import { useCart } from '../../_context/CartContext';
import { STORE_LANG_OPTIONS, useLanguage } from '../../_context/LanguageContext';
import {
  buildContactItems,
  getContactHref,
  getContactIcon,
  isExternalContact,
} from '../../_utils/contacts';

const SOCIAL_TYPES = new Set(['instagram', 'facebook', 'telegram', 'website']);

export default function MinimalLightNavbar({
  store,
  template,
  colors,
  fonts,
  sections,
  hasAnnouncementBar,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, setShowCart, setCheckoutStep } = useCart();
  const { t, lang, setLang } = useLanguage();

  const templateLogo = (template as unknown as { logoImage?: string | null }).logoImage ?? null;
  const logoSrc = templateLogo || store.image;

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

  const socialItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0 && SOCIAL_TYPES.has(item.type)
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
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 z-[65] border-b border-stone-200 bg-white/95 ${
          hasAnnouncementBar ? 'top-9' : 'top-0'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => scrollTo('hero-section')}
            className="flex items-center gap-3"
          >
            {logoSrc ? (
              <img src={logoSrc} alt={store.name ?? ''} className="h-8 w-8 object-cover" />
            ) : (
              <div className="h-8 w-8 border border-stone-200 bg-stone-100" />
            )}

            <div className="text-start">
              <span
                className="block text-sm font-medium text-stone-900"
                style={{ fontFamily: fonts.heading }}
              >
                {store.name}
              </span>
            </div>
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="text-xs font-medium tracking-[0.14em] text-stone-700 uppercase transition-colors duration-200 hover:text-stone-950"
                style={{ fontFamily: fonts.body }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 lg:flex">
              {socialItems.map(item => {
                const href = getContactHref(item);
                if (!href) return null;
                const Icon = getContactIcon(item.type);

                return (
                  <a
                    key={item.id}
                    href={href}
                    target={isExternalContact(item.type) ? '_blank' : undefined}
                    rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition-colors duration-200 hover:border-stone-400 hover:text-stone-900"
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 border-s border-stone-200 ps-2 lg:flex">
              <Globe className="h-4 w-4 text-stone-500" />
              <select
                value={lang}
                onChange={event => setLang(event.target.value as typeof lang)}
                className="bg-transparent text-xs font-medium text-stone-700 outline-none"
                style={{ fontFamily: fonts.body }}
              >
                {STORE_LANG_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {sections.store ? (
              <button
                type="button"
                onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition-colors duration-200 hover:border-stone-400 hover:text-stone-950"
                aria-label={t.store.addToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 ? (
                  <span
                    className="absolute -end-1.5 -top-1.5 min-w-5 rounded-full px-1 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: colors.accent, fontFamily: fonts.body }}
                  >
                    {cartCount}
                  </span>
                ) : null}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setMobileOpen(current => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[75] bg-white pt-16 lg:hidden">
          <div className="flex h-full flex-col border-t border-stone-200 px-6 py-6">
            <div className="space-y-4">
              {navItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="block w-full border-b border-stone-200 pb-3 text-start text-lg font-medium text-stone-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-auto space-y-5 border-t border-stone-200 pt-6">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-stone-500" />
                <select
                  value={lang}
                  onChange={event => setLang(event.target.value as typeof lang)}
                  className="bg-transparent text-sm text-stone-700 outline-none"
                  style={{ fontFamily: fonts.body }}
                >
                  {STORE_LANG_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {socialItems.map(item => {
                  const href = getContactHref(item);
                  if (!href) return null;
                  const Icon = getContactIcon(item.type);

                  return (
                    <a
                      key={item.id}
                      href={href}
                      target={isExternalContact(item.type) ? '_blank' : undefined}
                      rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700"
                      aria-label={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
