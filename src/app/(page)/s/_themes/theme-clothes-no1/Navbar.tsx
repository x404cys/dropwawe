// THEME: tech-futuristic - Navbar

'use client';

import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { NavbarProps, StorefrontContactType } from '../../_lib/types';
import { useCart } from '../../_context/CartContext';
import { STORE_LANG_OPTIONS, useLanguage } from '../../_context/LanguageContext';
import { buildStorefrontCheckoutPath } from '../../_utils/routes';
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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-section');
  const { cartCount } = useCart();
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
        if (node && node.offsetTop <= threshold) current = item.id;
      }
      setActiveSection(current);
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
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
    setMobileOpen(false);
    router.push(buildStorefrontCheckoutPath());
  };

  const cycleLanguage = () => {
    const currentIndex = STORE_LANG_OPTIONS.findIndex(o => o.value === lang);
    const next = STORE_LANG_OPTIONS[(currentIndex + 1) % STORE_LANG_OPTIONS.length];
    setLang(next.value);
  };

  // ✅ border خفيف بدل النص الكامل
  const iconBtnStyle: CSSProperties = {
    fontFamily: fonts.body,
    color: colors.text,
    background: colors.bg,
    borderColor: colors.text + '33',
  };

  return (
    <>
      {/* ── HEADER ── */}
      <header
        className={`fixed inset-x-0 z-[65] border-b backdrop-blur-sm ${
          hasAnnouncementBar ? 'top-8' : 'top-0'
        }`}
        style={{
          background: colors.bg,
          borderColor: colors.text + '0f',
        }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-16 lg:px-10">
          {/* ── LOGO ── */}
          <button
            type="button"
            onClick={() => scrollTo('hero-section')}
            className="flex min-w-0 items-center gap-3 text-start"
          >
            {logoSrc ? (
              <img src={logoSrc} alt={store.name ?? ''} className="h-6 w-6 object-cover" />
            ) : (
              <div
                className="grid h-6 w-6 place-items-center border font-mono text-[10px]"
                style={{ borderColor: colors.text + '14', background: colors.bg }}
              >
                //
              </div>
            )}
            <span
              className="truncate font-mono text-sm tracking-[0.22em] uppercase"
              style={{ fontFamily: fonts.heading, color: colors.text }}
            >
              {store.name}
            </span>
          </button>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden items-center gap-1 lg:flex" style={accentVars}>
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="border-b border-transparent px-3 py-5 font-mono text-[11px] tracking-[0.24em] uppercase transition-all duration-150 ease-out hover:text-[var(--tech-accent)]"
                  style={
                    isActive
                      ? { color: colors.text, borderColor: colors.text, fontFamily: fonts.body }
                      : { color: colors.text, fontFamily: fonts.body, opacity: 0.5 }
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ── ICONS ── */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() => scrollTo('store-section')}
              className="flex h-9 w-9 cursor-pointer items-center justify-center border transition-all duration-150 ease-out"
              aria-label={t.store.searchPlaceholder}
              style={iconBtnStyle}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Language — desktop only ✅ */}
            <button
              type="button"
              onClick={cycleLanguage}
              className="hidden h-9 min-w-11 cursor-pointer items-center justify-center border font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-150 ease-out lg:flex"
              aria-label={t.language.label}
              style={iconBtnStyle}
            >
              {lang}
            </button>

            {/* Cart */}
            {sections.store && (
              <button
                type="button"
                onClick={openCart}
                className="relative flex h-9 w-9 items-center justify-center border transition-all duration-150 ease-out"
                aria-label={t.store.addToCart}
                style={iconBtnStyle}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span
                    className="absolute -end-1 -top-1 grid min-h-4 min-w-4 place-items-center px-1 font-mono text-[10px]"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.bg,
                      fontFamily: fonts.body,
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(c => !c)}
              className="flex h-9 w-9 items-center justify-center border transition-all duration-150 ease-out lg:hidden"
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              style={iconBtnStyle}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`fixed inset-x-0 z-[60] border-b backdrop-blur-xl transition-all duration-150 ease-out lg:hidden ${
          hasAnnouncementBar ? 'top-[5.5rem]' : 'top-14'
        } ${mobileOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
        style={{
          ...accentVars,
          background: colors.bg,
          borderColor: colors.text + '14',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {/* Nav items */}
          <div className="grid gap-2">
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center justify-between border px-4 py-3 text-start font-mono text-xs tracking-[0.22em] uppercase transition-all duration-150 ease-out"
                  style={
                    isActive
                      ? {
                          color: colors.accent,
                          borderColor: colors.accent,
                          background: colors.accent + '0f',
                          fontFamily: fonts.body,
                        }
                      : {
                          color: colors.text,
                          borderColor: colors.text + '1a', // ✅ خفيف للغير نشط
                          background: colors.bg,
                          fontFamily: fonts.body,
                          opacity: 0.6,
                        }
                  }
                >
                  <span>{item.label}</span>
                  <span style={{ color: colors.text, opacity: 0.25 }}>
                    /{item.id.replace('-section', '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Language + Social */}
          <div className="mt-4 border-t pt-4" style={{ borderColor: colors.text + '14' }}>
            {/* Language options */}
            <div className="flex flex-wrap gap-2">
              {STORE_LANG_OPTIONS.map(option => {
                const isActive = option.value === lang;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLang(option.value)}
                    className="border px-3 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-150 ease-out"
                    style={
                      isActive
                        ? {
                            color: colors.accent,
                            borderColor: colors.accent,
                            background: colors.accent + '0f',
                            fontFamily: fonts.body,
                          }
                        : {
                            color: colors.text,
                            borderColor: colors.text + '1a',
                            background: colors.bg,
                            fontFamily: fonts.body,
                            opacity: 0.5,
                          }
                    }
                  >
                    {option.value}
                  </button>
                );
              })}
            </div>

            {/* Social links */}
            {socialItems.length > 0 && (
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
                      className="border px-3 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-150 ease-out"
                      style={{
                        color: colors.text,
                        borderColor: colors.text + '1a',
                        background: colors.bg,
                        fontFamily: fonts.body,
                        opacity: 0.5,
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = colors.accent;
                        el.style.borderColor = colors.accent;
                        el.style.opacity = '1';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = colors.text;
                        el.style.borderColor = colors.text + '1a';
                        el.style.opacity = '0.5';
                      }}
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
