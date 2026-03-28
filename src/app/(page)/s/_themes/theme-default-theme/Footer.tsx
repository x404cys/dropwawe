// THEME: default-theme - Footer

'use client';

import { Facebook, Globe, Instagram, MessageCircle, Send, Sparkles } from 'lucide-react';
import type { FooterProps } from '../../_lib/types';
import { getReadableTextColor } from './themeSystem';

export default function DefaultThemeFooter({ store, template, colors, fonts }: FooterProps) {
  const year = new Date().getFullYear();
  const primaryTextColor = getReadableTextColor(colors.primary);
  const socialLinks = [
    store.instaLink ? { href: store.instaLink, icon: Instagram, label: 'Instagram' } : null,
    store.facebookLink ? { href: store.facebookLink, icon: Facebook, label: 'Facebook' } : null,
    store.telegram ? { href: store.telegram, icon: Send, label: 'Telegram' } : null,
    template.contactWebsite
      ? { href: template.contactWebsite, icon: Globe, label: 'Website' }
      : null,
    template.whatsappNumber || store.phone
      ? {
          href: `https://wa.me/${(template.whatsappNumber || store.phone || '').replace(/\s+/g, '')}`,
          icon: MessageCircle,
          label: 'WhatsApp',
        }
      : null,
  ].filter(Boolean) as Array<{ href: string; icon: typeof Instagram; label: string }>;

  return (
    <footer
      className="border-t py-8"
      style={{ backgroundColor: 'var(--store-surface)', borderColor: 'var(--store-border)' }}
    >
      {/* DESIGN: The footer mirrors the original reference: concise logo block, social shortcuts, and a small powered-by line. */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            {store.image ? (
              <img
                src={store.image}
                alt={store.name ?? ''}
                className="h-7 w-7 rounded-lg object-cover"
              />
            ) : (
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--store-primary)' }}
              >
                <Sparkles className="h-3.5 w-3.5" style={{ color: primaryTextColor }} />
              </div>
            )}
            <span
              className="text-xs font-bold"
              style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
            >
              {store.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity duration-200 ease-in-out hover:opacity-75"
                  style={{ color: 'var(--store-text-muted)' }}
                  aria-label={link.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <p className="text-[10px]" style={{ color: 'var(--store-text-faint)' }}>
            مدعوم من{' '}
            <span className="font-bold" style={{ color: 'var(--store-primary)' }}>
              Matager - متاجر
            </span>{' '}
            • © {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
