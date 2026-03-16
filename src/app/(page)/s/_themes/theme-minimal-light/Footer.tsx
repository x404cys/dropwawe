// THEME: minimal-light — Footer

'use client';

import type { FooterProps } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';
import { buildContactItems, getContactHref, isExternalContact } from '../../_utils/contacts';

export default function MinimalLightFooter({
  store,
  template,
  colors,
  fonts,
  sections,
}: FooterProps) {
  const { t, locale } = useLanguage();
  const year = new Date().getFullYear().toLocaleString(locale);
  const contactItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0
  );

  const navItems = [
    sections.hero ? { id: 'hero-section', label: t.nav.home } : null,
    sections.services ? { id: 'services-section', label: t.nav.services } : null,
    sections.store ? { id: 'store-section', label: t.nav.store } : null,
    sections.testimonials ? { id: 'testimonials-section', label: t.nav.testimonials } : null,
    sections.about ? { id: 'about-section', label: t.nav.about } : null,
  ].filter(Boolean) as Array<{ id: string; label: string }>;

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-medium text-stone-900" style={{ fontFamily: fonts.heading }}>
              {store.name}
            </p>
            {store.description ? (
              <p
                className="max-w-md text-sm leading-7 text-stone-600"
                style={{ fontFamily: fonts.body }}
              >
                {store.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p
                className="text-xs font-medium tracking-[0.16em] text-stone-500 uppercase"
                style={{ fontFamily: fonts.body }}
              >
                {t.nav.store}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {navItems.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-sm text-stone-700 transition-colors duration-200 hover:text-stone-950"
                    style={{ fontFamily: fonts.body }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p
                className="text-xs font-medium tracking-[0.16em] text-stone-500 uppercase"
                style={{ fontFamily: fonts.body }}
              >
                {t.about.contactTitle}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {contactItems.map(item => {
                  const href = getContactHref(item);

                  if (!href) {
                    return (
                      <div
                        key={item.id}
                        className="text-sm text-stone-700"
                        style={{ fontFamily: fonts.body }}
                      >
                        {item.value}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.id}
                      href={href}
                      target={isExternalContact(item.type) ? '_blank' : undefined}
                      rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                      className="text-sm text-stone-700 transition-colors duration-200 hover:text-stone-950"
                      style={{
                        fontFamily: fonts.body,
                        color: item.type === 'custom' ? colors.accent : undefined,
                      }}
                    >
                      {item.value}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 border-t border-stone-200 pt-5 text-xs tracking-[0.12em] text-stone-500 uppercase"
          style={{ fontFamily: fonts.body }}
        >
          © {year}
        </div>
      </div>
    </footer>
  );
}
