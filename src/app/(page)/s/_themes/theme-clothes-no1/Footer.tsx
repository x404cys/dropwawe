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

  const contactLinkClass =
    'flex items-start gap-3 font-mono text-xs transition-all duration-150 ease-out';

  return (
    <footer
      className="border-t"
      style={{
        ...accentVars,
        background: colors.bg,
        borderColor: colors.text + '0f',
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        {/* ── COLUMNS ── */}
        <div
          className="grid gap-10 border-b pb-12 lg:grid-cols-3"
          style={{ borderColor: colors.text + '0f' }}
        >
          {/* ── COL 1: Brand + Contacts ── */}
          <div className="space-y-4">
            {/* Logo + Name */}
            <div className="flex items-center gap-3">
              {store.image ? (
                <img src={store.image} alt={store.name ?? ''} className="h-6 w-6 object-cover" />
              ) : (
                <div
                  className="h-6 w-6 border"
                  style={{
                    borderColor: colors.text + '14',
                    background: colors.text + '08',
                  }}
                />
              )}
              <p
                className="font-mono text-sm tracking-[0.18em] uppercase"
                style={{ fontFamily: fonts.heading, color: colors.text }}
              >
                {store.name}
              </p>
            </div>

            {/* Tagline */}
            {tagline && (
              <p
                className="max-w-sm font-mono text-xs leading-6"
                style={{ fontFamily: fonts.body, color: colors.text + '66' }}
              >
                {tagline}
              </p>
            )}

            {/* Contact items */}
            <div className="space-y-3">
              {contactItems.map(item => {
                const href = getContactHref(item);
                const prefix = CONTACT_LABELS[item.type] ?? '->';

                if (!href) {
                  return (
                    <div
                      key={item.id}
                      className={contactLinkClass}
                      style={{ fontFamily: fonts.body, color: colors.text + '66' }}
                    >
                      <span className="w-6 shrink-0" style={{ color: colors.text + '40' }}>
                        {prefix}
                      </span>
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
                    className={contactLinkClass}
                    style={{ fontFamily: fonts.body, color: colors.text + '66' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = colors.text;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = colors.text + '66';
                    }}
                  >
                    <span className="w-6 shrink-0" style={{ color: colors.text + '40' }}>
                      {prefix}
                    </span>
                    <span>{item.value}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── COL 2: Navigation ── */}
          <div>
            <p
              className="font-mono text-xs tracking-[0.22em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
            >
              NAVIGATION
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="font-mono text-xs tracking-[0.18em] uppercase transition-all duration-150 ease-out hover:text-[var(--tech-accent)]"
                  style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── COL 3: Social ── */}
          <div>
            <p
              className="font-mono text-xs tracking-[0.22em] uppercase"
              style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
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
                  className="border px-3 py-2 font-mono text-xs tracking-[0.18em] uppercase transition-all duration-150 ease-out hover:border-[var(--tech-accent)] hover:text-[var(--tech-accent)]"
                  style={{
                    fontFamily: fonts.body,
                    color: colors.text + '66',
                    borderColor: colors.text + '14',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: colors.text + '0a',
            fontFamily: fonts.body,
            color: colors.text + '33',
          }}
        >
          <span className="font-mono text-xs">
            © {year} {store.name}
          </span>
          <span className="font-mono text-xs tracking-[0.18em] uppercase">BUILT ON DROPWAVE</span>
        </div>
      </div>
    </footer>
  );
}
