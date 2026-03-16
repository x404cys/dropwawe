// THEME: glassmorphism — Navbar

'use client';

import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { NavbarProps } from '../../_lib/types';
import { useCart } from '../../_context/CartContext';

const SECTION_NAV_MAP = {
  hero: { scrollId: 'hero-section', label: 'الرئيسية' },
  services: { scrollId: 'services-section', label: 'الخدمات' },
  works: { scrollId: 'works-section', label: 'الأعمال' },
  store: { scrollId: 'store-section', label: 'المتجر' },
  testimonials: { scrollId: 'testimonials-section', label: 'آراء العملاء' },
  about: { scrollId: 'about-section', label: 'من نحن' },
  cta: { scrollId: 'cta-section', label: 'تواصل معنا' },
} as const;

export default function GlassmorphismNavbar({
  store,
  template,
  colors,
  fonts,
  sections,
  hasAnnouncementBar,
}: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-section');
  const { cartCount, setCheckoutStep, setShowCart } = useCart();
  const templateLogo = (template as unknown as { logoImage?: string | null }).logoImage ?? null;
  const logoSrc = templateLogo || store.image;

  const navItems = useMemo(
    () =>
      Object.entries(SECTION_NAV_MAP)
        .filter(([key]) => sections[key as keyof typeof sections])
        .map(([, value]) => value),
    [sections]
  );

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.scrollY + 180;
      let current = navItems[0]?.scrollId ?? 'hero-section';

      for (const item of navItems) {
        const element = document.getElementById(item.scrollId);
        if (element && element.offsetTop <= threshold) {
          current = item.scrollId;
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navItems]);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setShowMobileMenu(false);
  };

  const openCart = () => {
    setCheckoutStep('cart');
    setShowCart(true);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 z-50 border-b border-white/[0.08] bg-black/20 backdrop-blur-2xl ${
          hasAnnouncementBar ? 'top-9' : 'top-0'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => scrollTo('hero-section')}
            className="flex min-w-0 items-center gap-3 text-start"
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={store.name ?? ''}
                className="h-8 w-8 rounded-xl border border-white/20 object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] text-xs text-white/60">
                {store.name?.slice(0, 1) ?? 'S'}
              </div>
            )}
            <span
              className="truncate text-sm font-medium text-white/80"
              style={{ fontFamily: fonts.heading }}
            >
              {store.name}
            </span>
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map(item => {
              const isActive = activeSection === item.scrollId;

              return (
                <button
                  key={item.scrollId}
                  type="button"
                  onClick={() => scrollTo(item.scrollId)}
                  className="text-xs tracking-wider text-white/50 transition-colors duration-150 ease-in-out hover:text-white/90"
                  style={
                    isActive
                      ? { color: colors.accent, fontFamily: fonts.body }
                      : { fontFamily: fonts.body }
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo('store-search')}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/50 transition-colors duration-150 ease-in-out hover:text-white/80"
              aria-label="بحث"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 transition-all duration-200 ease-in-out hover:border-white/[0.18] hover:bg-white/[0.1]"
              style={{ fontFamily: fonts.body }}
              aria-label="السلة"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>السلة</span>
              {cartCount > 0 ? (
                <span
                  className="rounded-xl px-1.5 py-0.5 text-white"
                  style={{
                    backgroundColor: colors.accent,
                    boxShadow: `0 0 8px ${colors.accent}60`,
                  }}
                >
                  {cartCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setShowMobileMenu(current => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition-all duration-200 ease-in-out hover:border-white/[0.18] hover:bg-white/[0.1] lg:hidden"
              aria-label={showMobileMenu ? 'إغلاق' : 'القائمة'}
            >
              {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {showMobileMenu ? (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => setShowMobileMenu(false)}
            className="absolute end-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/80"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
            {navItems.map(item => (
              <button
                key={item.scrollId}
                type="button"
                onClick={() => scrollTo(item.scrollId)}
                className="text-2xl font-light text-white/80 transition-colors duration-150 ease-in-out hover:text-white"
                style={{ fontFamily: fonts.heading }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
