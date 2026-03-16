// THEME: glassmorphism — Footer

'use client';

import { Facebook, Instagram, Send } from 'lucide-react';
import type { FooterProps, StorefrontContactItem } from '../../_lib/types';
import { buildContactItems } from '../../_utils/contacts';

const SECTION_NAV_MAP = {
  hero: { scrollId: 'hero-section', label: 'الرئيسية' },
  services: { scrollId: 'services-section', label: 'الخدمات' },
  works: { scrollId: 'works-section', label: 'الأعمال' },
  store: { scrollId: 'store-section', label: 'المتجر' },
  testimonials: { scrollId: 'testimonials-section', label: 'آراء العملاء' },
  about: { scrollId: 'about-section', label: 'من نحن' },
  cta: { scrollId: 'cta-section', label: 'تواصل معنا' },
} as const;

function buildContactHref(item: StorefrontContactItem): string {
  switch (item.type) {
    case 'whatsapp':
      return `https://wa.me/${item.value}`;
    case 'email':
      return `mailto:${item.value}`;
    case 'phone':
      return `tel:${item.value}`;
    case 'instagram':
      return `https://instagram.com/${item.value}`;
    case 'facebook':
      return item.value;
    case 'telegram':
      return `https://t.me/${item.value}`;
    case 'website':
      return item.value;
    default:
      return item.value;
  }
}

export default function GlassmorphismFooter({
  store,
  template,
  colors,
  fonts,
  sections,
}: FooterProps) {
  const contactItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0
  );
  const whatsappNumber =
    template.whatsappNumber ||
    store.phone?.replace(/\s+/g, '') ||
    template.contactItems?.find(contact => contact.type === 'whatsapp' && contact.enabled)?.value ||
    null;
  const year = new Date().getFullYear();
  const navItems = Object.entries(SECTION_NAV_MAP)
    .filter(([key]) => sections[key as keyof typeof sections])
    .map(([, value]) => value);
  const socialLinks = [
    store.instaLink ? { href: store.instaLink, icon: Instagram, label: 'Instagram' } : null,
    store.facebookLink ? { href: store.facebookLink, icon: Facebook, label: 'Facebook' } : null,
    store.telegram ? { href: store.telegram, icon: Send, label: 'Telegram' } : null,
    whatsappNumber
      ? { href: `https://wa.me/${whatsappNumber}`, icon: Send, label: 'WhatsApp' }
      : null,
  ].filter(Boolean) as Array<{ href: string; icon: typeof Instagram; label: string }>;

  return (
    <footer className="border-t border-white/[0.06] bg-black/30 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* DESIGN: Footer keeps three clean columns so the glass aesthetic still feels organized and functional. */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              {store.image ? (
                <img
                  src={store.image}
                  alt={store.name ?? ''}
                  className="h-10 w-10 rounded-xl border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70">
                  {store.name?.slice(0, 1) ?? 'S'}
                </div>
              )}
              <div>
                <p
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: fonts.heading }}
                >
                  {store.name}
                </p>
                {template.tagline || store.description ? (
                  <p className="text-sm text-white/40">{template.tagline || store.description}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map(link => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/45 transition-all duration-200 ease-in-out hover:border-white/[0.18] hover:bg-white/[0.1] hover:text-white/70"
                    aria-label={link.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p
              className="mb-3 text-xs tracking-wide text-white/35 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              التنقل
            </p>
            <div className="space-y-2">
              {navItems.map(item => (
                <a
                  key={item.scrollId}
                  href={`#${item.scrollId}`}
                  className="block text-xs tracking-wide text-white/35 transition-colors duration-200 ease-in-out hover:text-white/70"
                  style={{ fontFamily: fonts.body }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p
              className="mb-3 text-xs tracking-wide text-white/35 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              التواصل
            </p>
            <div className="space-y-2">
              {contactItems.map(item => (
                <a
                  key={item.id}
                  href={buildContactHref(item)}
                  target={item.type === 'email' || item.type === 'phone' ? undefined : '_blank'}
                  rel={
                    item.type === 'email' || item.type === 'phone'
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  className="block text-sm text-white/45 transition-colors duration-200 ease-in-out hover:text-white/70"
                >
                  {item.label}: {item.value}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.04] pt-6 text-xs text-white/20 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {store.name}
          </span>
          <span>Powered by Dropwave</span>
        </div>
      </div>
    </footer>
  );
}
