// THEME: clean-marketplace - Footer

'use client';

import { Facebook, Instagram, Send } from 'lucide-react';
import type { FooterProps } from '../../_lib/types';
import {
  buildContactItems,
  getContactHref,
  getContactIcon,
  isExternalContact,
} from '../../_utils/contacts';

export default function CleanMarketplaceFooter({ store, template, colors, fonts }: FooterProps) {
  const year = new Date().getFullYear();
  const contactItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0
  );
  const socialLinks = [
    store.instaLink ? { href: store.instaLink, icon: Instagram, label: 'Instagram' } : null,
    store.facebookLink ? { href: store.facebookLink, icon: Facebook, label: 'Facebook' } : null,
    store.telegram ? { href: store.telegram, icon: Send, label: 'Telegram' } : null,
  ].filter(Boolean) as Array<{ href: string; icon: typeof Instagram; label: string }>;
  const tagline =
    template.tagline?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';

  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8 lg:px-8">
      {/* DESIGN: The footer stays utility-heavy and light so trust/contact actions remain easy to scan. */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {store.image ? (
                <img
                  src={store.image}
                  alt={store.name ?? ''}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-full bg-white"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
              <div>
                <p
                  className="text-sm font-semibold text-gray-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  {store.name}
                </p>
                {tagline ? <p className="text-sm text-gray-500">{tagline}</p> : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {socialLinks.map(link => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 ease-in-out hover:border-gray-300 hover:text-gray-900"
                    aria-label={link.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contactItems.map(item => {
              const Icon = getContactIcon(item.type);
              const href = getContactHref(item);

              if (!href) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-600"
                  >
                    <Icon className="h-4 w-4" style={{ color: colors.accent }} />
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p>{item.value}</p>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={href}
                  target={isExternalContact(item.type) ? '_blank' : undefined}
                  rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-600 transition-all duration-200 ease-in-out hover:shadow-sm"
                >
                  <Icon className="h-4 w-4" style={{ color: colors.accent }} />
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
            © {year} {store.name}
          </div>
        </div>
      </div>
    </footer>
  );
}
