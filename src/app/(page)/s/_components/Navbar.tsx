'use client';

import { Globe, Menu, ShoppingBag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ActiveColors, SectionsConfig, StorefrontStore, StorefrontTemplate } from '../_lib/types';
import { useCart } from '../_context/CartContext';
import { STORE_LANG_OPTIONS, useLanguage } from '../_context/LanguageContext';
import { buildStorefrontCheckoutPath } from '../_utils/routes';
import {
  buildContactItems,
  getContactHref,
  getContactIcon,
  isExternalContact,
} from '../_utils/contacts';

interface NavbarProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  sections: SectionsConfig;
  hasAnnouncementBar: boolean;
}

const SOCIAL_TYPES = new Set(['instagram', 'facebook', 'telegram', 'website', 'whatsapp']);

export default function Navbar({
  store,
  template,
  colors,
  headingStyle,
  sections,
  hasAnnouncementBar,
}: NavbarProps) {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { cartCount } = useCart();
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
    .filter(key => sections[key] && sectionNav[key].label)
    .map(key => sectionNav[key]);

  const socialItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0 && SOCIAL_TYPES.has(item.type)
  );

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setShowMobileMenu(false);
  };

  const openCart = () => {
    setShowMobileMenu(false);
    router.push(buildStorefrontCheckoutPath());
  };

  const topOffsetClass = hasAnnouncementBar ? 'top-10' : 'top-0';

  return (
    <>
      <nav
        // REDESIGN: replace the blurred utility bar with a fixed, architectural navigation frame.
        className={`fixed inset-x-0 z-[65] border-b border-white/5 ${topOffsetClass}`}
        style={{ backgroundColor: colors.bg }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-12">
          <button
            type="button"
            onClick={() => scrollTo('hero-section')}
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-60"
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={store.name ?? ''}
                className="h-8 w-8 object-cover lg:h-9 lg:w-9"
              />
            ) : (
              <div className="h-8 w-8 border border-white/10 lg:h-9 lg:w-9" />
            )}

            <div className="text-right">
              <span
                className="block text-[11px] tracking-[0.28em] uppercase opacity-50"
                style={{ color: colors.text }}
              >
                {template.tagline?.trim() || t.nav.home}
              </span>
              <span
                className="block text-sm font-light tracking-[0.08em]"
                style={{ ...headingStyle, color: colors.text }}
              >
                {store.name}
              </span>
            </div>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="text-xs font-light tracking-[0.28em] uppercase opacity-60 transition-opacity duration-200 hover:opacity-100"
                style={{ color: colors.text }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <label
              htmlFor="storefront-language"
              className="hidden text-[10px] tracking-[0.28em] uppercase opacity-50 lg:block"
              style={{ color: colors.text }}
            >
              {t.language.label}
            </label>

            <div className="relative hidden lg:block">
              <Globe
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 opacity-50"
                style={{ color: colors.text }}
              />
              <select
                id="storefront-language"
                value={lang}
                onChange={event => setLang(event.target.value as typeof lang)}
                className="h-10 border border-white/10 bg-transparent pr-4 pl-9 text-[10px] font-light tracking-[0.24em] uppercase outline-none"
                style={{ color: colors.text }}
              >
                {STORE_LANG_OPTIONS.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-zinc-950 text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

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
                    className="flex h-10 w-10 items-center justify-center border border-white/10 transition-opacity duration-200 hover:opacity-60"
                    style={{ color: colors.text }}
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {sections.store && (
              <button
                type="button"
                onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center border border-white/10 transition-opacity duration-200 hover:opacity-60"
                style={{ color: colors.text }}
                aria-label={t.store.addToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-5 px-1.5 py-0.5 text-[9px] tracking-[0.18em]"
                    style={{ backgroundColor: colors.accent, color: colors.bg }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowMobileMenu(true)}
              className="flex h-10 w-10 items-center justify-center border border-white/10 lg:hidden"
              style={{ color: colors.text }}
              aria-label={t.nav.home}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div
          // REDESIGN: mobile navigation becomes a full-screen editorial overlay instead of a dropdown.
          className="fixed inset-0 z-[80] flex flex-col"
          style={{ backgroundColor: colors.bg }}
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-6">
            <div>
              <p
                className="text-[10px] tracking-[0.32em] uppercase opacity-50"
                style={{ color: colors.text }}
              >
                {template.tagline?.trim() || t.language.label}
              </p>
              <p
                className="mt-2 text-lg font-light tracking-[0.08em]"
                style={{ ...headingStyle, color: colors.text }}
              >
                {store.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowMobileMenu(false)}
              className="flex h-11 w-11 items-center justify-center border border-white/10"
              style={{ color: colors.text }}
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between px-6 py-8">
            <div className="space-y-5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="block text-right text-2xl font-light tracking-[0.08em] transition-opacity duration-200 hover:opacity-60"
                  style={{ ...headingStyle, color: colors.text }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-6 border-t border-white/5 pt-6">
              <div className="flex items-center justify-between border border-white/10 px-4 py-3">
                <span
                  className="text-[10px] tracking-[0.28em] uppercase opacity-50"
                  style={{ color: colors.text }}
                >
                  {t.language.label}
                </span>
                <select
                  value={lang}
                  onChange={event => setLang(event.target.value as typeof lang)}
                  className="bg-transparent text-xs font-light outline-none"
                  style={{ color: colors.text }}
                >
                  {STORE_LANG_OPTIONS.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-zinc-950 text-white"
                    >
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
                      className="flex h-11 w-11 items-center justify-center border border-white/10"
                      style={{ color: colors.text }}
                      aria-label={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}

                {sections.store && (
                  <button
                    type="button"
                    onClick={openCart}
                    className="flex h-11 items-center gap-3 border border-white/10 px-4"
                    style={{ color: colors.text }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-[10px] tracking-[0.28em] uppercase">
                      {cartCount > 0 ? `${t.nav.store} ${cartCount}` : t.nav.store}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
