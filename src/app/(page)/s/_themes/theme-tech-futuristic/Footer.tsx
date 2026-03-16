// THEME: tech-futuristic - Footer

'use client';

import { type CSSProperties } from 'react';
import type { FooterProps, StorefrontContactType } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';
import { buildContactItems, getContactHref, isExternalContact } from '../../_utils/contacts';

const CONTACT_LABELS: Record<StorefrontContactType, string> = {
  email: '@',
  whatsapp: 'WA',
  website: '//',
  phone: '+',
  instagram: 'IG',
  facebook: 'FB',
  telegram: 'TG',
  custom: '->',
};

export default function TechFuturisticFooter({
  store,
  template,
  colors,
  fonts,
  sections,
}: FooterProps) {
  const { t, locale } = useLanguage();
  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;
  const year = new Date().getFullYear().toLocaleString(locale);
  const tagline =
    template.tagline?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
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
  const socialLinks = [
    store.instaLink ? { label: '[IG]', href: store.instaLink } : null,
    store.facebookLink ? { label: '[FB]', href: store.facebookLink } : null,
    store.telegram ? { label: '[TG]', href: store.telegram } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <footer className="border-t border-white/[0.06] bg-[#050505]" style={accentVars}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        {/* DESIGN: Footer columns mimic a terminal dashboard to keep utility links readable without decorative clutter. */}
        <div className="grid gap-10 border-b border-white/[0.06] pb-12 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {store.image ? (
                <img src={store.image} alt={store.name ?? ''} className="h-6 w-6 object-cover" />
              ) : (
                <div className="h-6 w-6 border border-white/[0.08] bg-[#0f0f0f]" />
              )}
              <p
                className="font-mono text-sm tracking-[0.18em] text-[#f2f2f2] uppercase"
                style={{ fontFamily: fonts.heading }}
              >
                {store.name}
              </p>
            </div>

            {tagline ? (
              <p
                className="max-w-sm font-mono text-xs leading-6 text-white/40"
                style={{ fontFamily: fonts.body }}
              >
                {tagline}
              </p>
            ) : null}

            <div className="space-y-3">
              {contactItems.map(item => {
                const href = getContactHref(item);
                const prefix = CONTACT_LABELS[item.type] ?? '->';
                const commonClass =
                  'flex items-start gap-3 font-mono text-xs text-white/40 transition-all duration-150 ease-out hover:text-[#f2f2f2]';

                if (!href) {
                  return (
                    <div key={item.id} className={commonClass} style={{ fontFamily: fonts.body }}>
                      <span className="w-6 shrink-0 text-white/25">{prefix}</span>
                      <span>{item.value}</span>
                    </div>
                  );
                }

                return (
                  <a
                    key={item.id}
                    href={href}
                    target={isExternalContact(item.type) ? '_blank' : undefined}
                    rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                    className={commonClass}
                    style={{ fontFamily: fonts.body }}
                  >
                    <span className="w-6 shrink-0 text-white/25">{prefix}</span>
                    <span>{item.value}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p
              className="font-mono text-xs tracking-[0.22em] text-white/30 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              NAVIGATION
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="font-mono text-xs tracking-[0.18em] text-white/30 uppercase transition-all duration-150 ease-out hover:text-[var(--tech-accent)]"
                  style={{ fontFamily: fonts.body }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p
              className="font-mono text-xs tracking-[0.22em] text-white/30 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              SOCIAL
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/[0.08] px-3 py-2 font-mono text-xs tracking-[0.18em] text-white/40 uppercase transition-all duration-150 ease-out hover:border-[var(--tech-accent)] hover:text-[var(--tech-accent)]"
                  style={{ fontFamily: fonts.body }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-6 flex flex-col gap-3 border-t border-white/[0.04] pt-6 font-mono text-xs text-white/20 sm:flex-row sm:items-center sm:justify-between"
          style={{ fontFamily: fonts.body }}
        >
          <span>
            © {year} {store.name}
          </span>
          <span>BUILT ON DROPWAVE</span>
        </div>
      </div>
    </footer>
  );
}
