'use client';

import { ActiveColors, SectionsConfig, StorefrontStore, StorefrontTemplate } from '../_lib/types';
import { useLanguage } from '../_context/LanguageContext';
import { buildContactItems, getContactHref, isExternalContact } from '../_utils/contacts';

interface FooterProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  sections: SectionsConfig;
  headingStyle: React.CSSProperties;
}

export default function Footer({ store, template, colors, sections, headingStyle }: FooterProps) {
  const { t, locale } = useLanguage();
  const contactItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0
  );
  const year = new Date().getFullYear().toLocaleString(locale);

  const navItems = [
    sections.hero ? { id: 'hero-section', label: t.nav.home } : null,
    sections.services ? { id: 'services-section', label: t.nav.services } : null,
    sections.store ? { id: 'store-section', label: t.nav.store } : null,
    sections.testimonials ? { id: 'testimonials-section', label: t.nav.testimonials } : null,
    sections.about ? { id: 'about-section', label: t.nav.about } : null,
  ].filter(Boolean) as Array<{ id: string; label: string }>;

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: colors.bg }}>
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <p
              className="text-[10px] font-light tracking-[0.32em] uppercase opacity-40"
              style={{ color: colors.text }}
            >
              {template.tagline || t.nav.store}
            </p>
            <p
              // REDESIGN: footer brand block is simplified to text and breathing room, no badges or cards.
              className="text-2xl font-thin tracking-tight"
              style={{ ...headingStyle, color: colors.text }}
            >
              {store.name}
            </p>
            {store.description ? (
              <p
                className="max-w-sm text-xs leading-relaxed font-light opacity-55"
                style={{ color: colors.text }}
              >
                {store.description}
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-col gap-3">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-xs font-light uppercase opacity-60 transition-opacity duration-200 hover:opacity-100"
                  style={{ color: colors.text }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p
              className="text-[10px] font-light tracking-[0.32em] uppercase opacity-40"
              style={{ color: colors.text }}
            >
              {t.about.contactTitle}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {contactItems.map(item => {
                const href = getContactHref(item);
                const content = (
                  <>
                    <span className="block text-[10px] font-light tracking-[0.24em] uppercase opacity-40">
                      {item.label}
                    </span>
                    <span className="mt-2 block text-xs font-light opacity-70">{item.value}</span>
                  </>
                );

                if (!href) {
                  return (
                    <div
                      key={item.id}
                      className="border border-white/10 p-4"
                      style={{ color: colors.text }}
                    >
                      {content}
                    </div>
                  );
                }

                return (
                  <a
                    key={item.id}
                    href={href}
                    target={isExternalContact(item.type) ? '_blank' : undefined}
                    rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                    className="border border-white/10 p-4 transition-opacity duration-200 hover:opacity-70"
                    style={{ color: colors.text }}
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[10px] font-light uppercase opacity-40 lg:flex-row lg:items-center lg:justify-between">
          <p style={{ color: colors.text }}>{store.name}</p>
          <p style={{ color: colors.text }}>© {year}</p>
        </div>
      </div>
    </footer>
  );
}
