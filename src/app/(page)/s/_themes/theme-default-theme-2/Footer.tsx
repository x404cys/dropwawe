'use client';

import { Facebook, Globe, Instagram, MessageCircle, Send } from 'lucide-react';

import type { FooterProps } from '../../_lib/types';
import { storefrontContainerClass } from './themeSystem';

export default function DefaultThemeFooter({ store, template, fonts, sections }: FooterProps) {
  const year = new Date().getFullYear();
  const socialLinks = [
    store.instaLink ? { href: store.instaLink, icon: Instagram, label: 'Instagram' } : null,
    store.facebookLink ? { href: store.facebookLink, icon: Facebook, label: 'Facebook' } : null,
    store.telegram ? { href: store.telegram, icon: Send, label: 'Telegram' } : null,
    template.contactWebsite ? { href: template.contactWebsite, icon: Globe, label: 'Website' } : null,
    template.whatsappNumber || store.phone
      ? {
          href: `https://wa.me/${(template.whatsappNumber || store.phone || '').replace(/\s+/g, '')}`,
          icon: MessageCircle,
          label: 'WhatsApp',
        }
      : null,
  ].filter(Boolean) as Array<{ href: string; icon: typeof Instagram; label: string }>;

  const sectionLinks = [
    sections.hero ? { href: '#hero-section', label: 'الرئيسية' } : null,
    sections.store ? { href: '#store-section', label: 'المتجر' } : null,
    sections.about ? { href: '#about-section', label: 'من نحن' } : null,
    sections.cta ? { href: '#cta-section', label: 'تواصل' } : null,
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    <footer className="border-t py-10 sm:py-12" style={{ borderColor: 'var(--store-border)' }}>
      <div className={`${storefrontContainerClass} grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_auto_auto] lg:items-start`}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {store.image ? (
              <img
                src={store.image}
                alt={store.name ?? ''}
                className="h-11 w-11 rounded-xl object-cover"
              />
            ) : (
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold"
                style={{
                  backgroundColor: 'var(--store-primary-faint)',
                  color: 'var(--store-primary)',
                }}
              >
                {(store.name ?? 'S').trim().charAt(0)}
              </span>
            )}

            <div className="space-y-1">
              <p className="text-base font-bold tracking-[-0.02em]" style={{ fontFamily: fonts.heading }}>
                {store.name}
              </p>
              {template.tagline ? (
                <p className="text-sm" style={{ color: 'var(--store-text-muted)' }}>
                  {template.tagline}
                </p>
              ) : null}
            </div>
          </div>

          <p className="max-w-md text-sm leading-7" style={{ color: 'var(--store-text-muted)' }}>
            {template.storeDescription?.trim() || store.description?.trim() || 'تجربة تسوق واضحة وسريعة تركز على المنتج أولاً.'}
          </p>
        </div>

        {sectionLinks.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold">التنقل</p>
            <div className="flex flex-col gap-3">
              {sectionLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-opacity duration-200 hover:opacity-70"
                  style={{ color: 'var(--store-text-muted)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          <p className="text-sm font-semibold">تابعنا</p>
          <div className="flex items-center gap-2">
            {socialLinks.map(link => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border transition-opacity duration-200 hover:opacity-80"
                  style={{
                    borderColor: 'var(--store-border)',
                    color: 'var(--store-text-soft)',
                  }}
                  aria-label={link.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`${storefrontContainerClass} mt-10 flex flex-col gap-2 border-t pt-5 text-sm sm:flex-row sm:items-center sm:justify-between`} style={{ borderColor: 'var(--store-border)' }}>
        <p style={{ color: 'var(--store-text-faint)' }}>© {year} {store.name}</p>
        <p style={{ color: 'var(--store-text-faint)' }}>
          مدعوم من <span style={{ color: 'var(--store-text)' }}>Dropwave</span>
        </p>
      </div>
    </footer>
  );
}
