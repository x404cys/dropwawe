// THEME: tech-futuristic - Navbar

'use client';

import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { NavbarProps, StorefrontContactType } from '../../_lib/types';
import { useCart } from '../../_context/CartContext';
import { STORE_LANG_OPTIONS, useLanguage } from '../../_context/LanguageContext';
import { buildContactItems, getContactHref, isExternalContact } from '../../_utils/contacts';

const SOCIAL_LABELS: Partial<Record<StorefrontContactType, string>> = {
  instagram: '[IG]',
  facebook: '[FB]',
  telegram: '[TG]',
  website: '[WEB]',
};

export default function TechFuturisticNavbar({
  store,
  template,
  colors,
  fonts,
  sections,
  hasAnnouncementBar,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-section');
  const { cartCount, setCheckoutStep, setShowCart } = useCart();
  const { t, lang, setLang } = useLanguage();
  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;
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
    item =>
      item.enabled &&
      item.value.trim().length > 0 &&
      Object.prototype.hasOwnProperty.call(SOCIAL_LABELS, item.type)
  );

  useEffect(() => {
    const updateActiveSection = () => {
      const threshold = window.scrollY + 160;
      let current = navItems[0]?.id ?? 'hero-section';

      for (const item of navItems) {
        const node = document.getElementById(item.id);
        if (node && node.offsetTop <= threshold) {
          current = item.id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [navItems]);

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

  const cycleLanguage = () => {
    const currentIndex = STORE_LANG_OPTIONS.findIndex(option => option.value === lang);
    const next = STORE_LANG_OPTIONS[(currentIndex + 1) % STORE_LANG_OPTIONS.length];
    setLang(next.value);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 z-[65] border-b border-white/[0.06] bg-[#080808]/95 backdrop-blur-sm ${
          hasAnnouncementBar ? 'top-8' : 'top-0'
        }`}
        style={accentVars}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-16 lg:px-10">
          <button
            type="button"
            onClick={() => scrollTo('hero-section')}
            className="flex min-w-0 items-center gap-3 text-start"
          >
            {logoSrc ? (
              <img src={logoSrc} alt={store.name ?? ''} className="h-6 w-6 object-cover" />
            ) : (
              <div className="grid h-6 w-6 place-items-center border border-white/[0.08] bg-[#0f0f0f] font-mono text-[10px] text-white/30">
                //
              </div>
            )}
            <span
              className="truncate font-mono text-sm tracking-[0.22em] text-[#f2f2f2] uppercase"
              style={{ fontFamily: fonts.heading }}
            >
              {store.name}
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(item => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="border-b border-transparent px-3 py-5 font-mono text-[11px] tracking-[0.24em] text-white/45 uppercase transition-all duration-150 ease-out hover:text-[var(--tech-accent)]"
                  style={
                    isActive
                      ? {
                          color: colors.accent,
                          borderColor: colors.accent,
                          fontFamily: fonts.body,
                        }
                      : { fontFamily: fonts.body }
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTo('store-section')}
              className="flex h-9 w-9 items-center justify-center border border-white/[0.08] bg-[#0f0f0f] text-white/45 transition-all duration-150 ease-out hover:border-white/[0.15] hover:text-[var(--tech-accent)]"
              aria-label={t.store.searchPlaceholder}
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={cycleLanguage}
              className="hidden h-9 min-w-11 items-center justify-center border border-white/[0.08] bg-[#0f0f0f] px-2 font-mono text-[11px] tracking-[0.18em] text-white/45 uppercase transition-all duration-150 ease-out hover:border-white/[0.15] hover:text-[var(--tech-accent)] sm:flex"
              aria-label="Switch language"
              style={{ fontFamily: fonts.body }}
            >
              {lang}
            </button>

            {sections.store ? (
              <button
                type="button"
                onClick={openCart}
                className="relative flex h-9 w-9 items-center justify-center border border-white/[0.08] bg-[#0f0f0f] text-white/70 transition-all duration-150 ease-out hover:border-white/[0.15] hover:text-[var(--tech-accent)]"
                aria-label={t.store.addToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 ? (
                  <span
                    className="absolute -end-1 -top-1 grid min-h-4 min-w-4 place-items-center px-1 font-mono text-[10px] text-[#080808]"
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
              className="flex h-9 w-9 items-center justify-center border border-white/[0.08] bg-[#0f0f0f] text-white/70 transition-all duration-150 ease-out hover:border-white/[0.15] lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 z-[60] border-b border-white/[0.08] bg-[#0f0f0f] backdrop-blur-xl transition-all duration-150 ease-out lg:hidden ${
          hasAnnouncementBar ? 'top-[5.5rem]' : 'top-14'
        } ${mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
        style={accentVars}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="grid gap-2">
            {navItems.map(item => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center justify-between border border-white/[0.08] bg-[#080808] px-4 py-3 text-start font-mono text-xs tracking-[0.22em] text-white/50 uppercase transition-all duration-150 ease-out hover:border-white/[0.15]"
                  style={
                    isActive
                      ? {
                          color: colors.accent,
                          borderColor: colors.accent,
                          fontFamily: fonts.body,
                        }
                      : { fontFamily: fonts.body }
                  }
                >
                  <span>{item.label}</span>
                  <span className="text-white/25">/{item.id.replace('-section', '')}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-white/[0.06] pt-4">
            <div className="flex flex-wrap gap-2">
              {STORE_LANG_OPTIONS.map(option => {
                const isActive = option.value === lang;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLang(option.value)}
                    className="border border-white/[0.08] px-3 py-2 font-mono text-[11px] tracking-[0.18em] text-white/45 uppercase transition-all duration-150 ease-out hover:border-white/[0.15]"
                    style={
                      isActive
                        ? {
                            color: colors.accent,
                            borderColor: colors.accent,
                            fontFamily: fonts.body,
                          }
                        : { fontFamily: fonts.body }
                    }
                  >
                    {option.value}
                  </button>
                );
              })}
            </div>

            {socialItems.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {socialItems.map(item => {
                  const href = getContactHref(item);
                  const label = SOCIAL_LABELS[item.type];
                  if (!href || !label) return null;

                  return (
                    <a
                      key={item.id}
                      href={href}
                      target={isExternalContact(item.type) ? '_blank' : undefined}
                      rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                      className="border border-white/[0.08] px-3 py-2 font-mono text-[11px] tracking-[0.18em] text-white/45 uppercase transition-all duration-150 ease-out hover:border-white/[0.15] hover:text-[var(--tech-accent)]"
                      style={{ fontFamily: fonts.body }}
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
