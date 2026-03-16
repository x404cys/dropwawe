// THEME: modern-structured — Footer

'use client';

import { Facebook, Instagram, Send } from 'lucide-react';
import type { FooterProps, StorefrontContactItem } from '../../_lib/types';
import { buildContactItems, getContactHref, isExternalContact } from '../../_utils/contacts';

function chunkItems(items: StorefrontContactItem[], size: number) {
  const chunks: StorefrontContactItem[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export default function ModernStructuredFooter({ store, template, colors, fonts }: FooterProps) {
  const year = new Date().getFullYear();
  const contactItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0
  );
  const groupedContacts = chunkItems(contactItems, Math.max(1, Math.ceil(contactItems.length / 3)));
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
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl border-t border-gray-200 px-6 py-12 lg:px-8">
        {/* DESIGN: Footer content is grouped into explicit columns so support and discovery links remain scannable. */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              {store.image ? (
                <img
                  src={store.image}
                  alt={store.name ?? ''}
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-xl bg-slate-100"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
              <div>
                <p
                  className="text-sm font-semibold text-slate-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  {store.name}
                </p>
                {tagline ? <p className="text-sm text-slate-500">{tagline}</p> : null}
              </div>
            </div>

            {socialLinks.length > 0 ? (
              <div className="mt-4 flex items-center gap-2">
                {socialLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-500 transition-all duration-150 ease-in-out hover:border-gray-400 hover:text-slate-900"
                      aria-label={link.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          {Array.from({ length: 3 }).map((_, columnIndex) => {
            const group = groupedContacts[columnIndex] ?? [];

            return (
              <div key={columnIndex}>
                <p
                  className="mb-3 text-xs font-medium tracking-wide text-slate-400 uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {columnIndex === 0 ? 'Contact' : columnIndex === 1 ? 'Links' : 'Info'}
                </p>
                {group.length > 0 ? (
                  <div>
                    {group.map(item => {
                      const href = getContactHref(item);

                      if (!href) {
                        return (
                          <div key={item.id} className="block py-1 text-sm text-slate-500">
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
                          className="block py-1 text-sm text-slate-500 transition-all duration-150 ease-in-out hover:text-slate-900"
                        >
                          {item.value}
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">-</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {store.name}
          </span>
          <span>Built on Dropwave</span>
        </div>
      </div>
    </footer>
  );
}
