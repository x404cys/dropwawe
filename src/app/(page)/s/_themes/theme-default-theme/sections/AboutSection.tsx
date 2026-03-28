// THEME: default-theme - AboutSection

'use client';

import { Award } from 'lucide-react';
import type { AboutSectionProps } from '../../../_lib/types';
import {
  buildContactItems,
  getContactHref,
  getContactIcon,
  isExternalContact,
} from '../../../_utils/contacts';

export default function DefaultThemeAboutSection({ template, store, fonts }: AboutSectionProps) {
  const aboutText =
    template.aboutText?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const contactItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0
  );

  if (!aboutText && contactItems.length === 0) return null;

  return (
    <section id="about-section" className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* DESIGN: The about block recreates the reference two-column split: narrative on one side, contact utility card on the other. */}
        <div className="items-start gap-10 sm:flex">
          <div className="mb-8 flex-1 sm:mb-0">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{
                color: 'var(--store-primary)',
                backgroundColor: 'var(--store-primary-faint)',
              }}
            >
              من نحن
            </span>
            <h2
              className="mt-4 mb-3 text-xl font-bold sm:text-2xl"
              style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
            >
              {template.tagline?.trim() || store.name || 'فريق شغوف بالإبداع'}
            </h2>
            {aboutText ? (
              <p
                className="mb-4 text-xs leading-relaxed sm:text-sm"
                style={{ color: 'var(--store-text-muted)' }}
              >
                {aboutText}
              </p>
            ) : null}
            <div className="grid grid-cols-3 gap-3">
              {[
                store.name || 'هوية جاهزة',
                template.services.length > 0 ? `${template.services.length} خدمات` : 'خدمات متنوعة',
                template.testimonials.length > 0
                  ? `${template.testimonials.length} تقييمات`
                  : 'دعم مستمر',
              ].map(item => (
                <div
                  key={item}
                  className="rounded-xl border p-3 text-center"
                  style={{
                    backgroundColor: 'var(--store-surface)',
                    borderColor: 'var(--store-border)',
                  }}
                >
                  <Award
                    className="mx-auto mb-1.5 h-4 w-4"
                    style={{ color: 'var(--store-primary)' }}
                  />
                  <p
                    className="text-[9px] font-bold sm:text-[10px]"
                    style={{ color: 'var(--store-text)' }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div
              className="rounded-2xl border p-5 sm:p-6"
              style={{
                backgroundColor: 'var(--store-surface)',
                borderColor: 'var(--store-border)',
              }}
            >
              <h3
                className="mb-4 text-sm font-bold"
                style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
              >
                تواصل معنا
              </h3>
              <div className="space-y-3">
                {contactItems.map(item => {
                  const Icon = getContactIcon(item.type);
                  const href = getContactHref(item);

                  if (!href) {
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: 'var(--store-primary-faint)' }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: 'var(--store-primary)' }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--store-text-muted)' }}>
                          {item.value}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.id}
                      href={href}
                      target={isExternalContact(item.type) ? '_blank' : undefined}
                      rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 transition-opacity duration-200 ease-in-out hover:opacity-85"
                    >
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: 'var(--store-primary-faint)' }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: 'var(--store-primary)' }} />
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--store-text-muted)' }}
                        dir={item.type === 'phone' || item.type === 'email' ? 'ltr' : undefined}
                      >
                        {item.value}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
