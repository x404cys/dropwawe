'use client';

import type { AboutSectionProps } from '../../../_lib/types';
import {
  buildContactItems,
  getContactHref,
  getContactIcon,
  isExternalContact,
} from '../../../_utils/contacts';
import {
  storefrontContainerClass,
  storefrontSectionCompactClass,
  storefrontTitleClass,
} from '../themeSystem';

export default function DefaultThemeAboutSection({
  template,
  store,
  fonts,
}: AboutSectionProps) {
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
    <section id="about-section" className={storefrontSectionCompactClass}>
      <div className={`${storefrontContainerClass} grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-16`}>
        <div className="space-y-6">
          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase"
            style={{
              backgroundColor: 'var(--store-primary-faint)',
              color: 'var(--store-primary)',
            }}
          >
            About
          </span>

          <div className="space-y-4">
            <h2 className={storefrontTitleClass} style={{ fontFamily: fonts.heading }}>
              {template.tagline?.trim() || store.name || 'عن المتجر'}
            </h2>
            {aboutText ? (
              <p
                className="max-w-2xl text-sm leading-7 sm:text-base sm:leading-8"
                style={{ color: 'var(--store-text-muted)' }}
              >
                {aboutText}
              </p>
            ) : null}
          </div>
        </div>

        {contactItems.length > 0 ? (
          <div
            className="rounded-xl border p-6 sm:p-8"
            style={{
              backgroundColor: 'var(--store-surface)',
              borderColor: 'var(--store-border)',
            }}
          >
            <div className="mb-6 space-y-2">
              <p className="text-[11px] font-medium tracking-[0.16em] uppercase" style={{ color: 'var(--store-text-faint)' }}>
                Contact
              </p>
              <h3 className="text-xl font-bold tracking-[-0.02em]" style={{ fontFamily: fonts.heading }}>
                قنوات التواصل
              </h3>
            </div>

            <div className="space-y-4">
              {contactItems.map(item => {
                const Icon = getContactIcon(item.type);
                const href = getContactHref(item);

                if (!href) {
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: 'var(--store-primary-faint)',
                          color: 'var(--store-primary)',
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: 'var(--store-text-soft)' }}
                        dir={item.type === 'phone' || item.type === 'email' ? 'ltr' : undefined}
                      >
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
                    className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: 'var(--store-primary-faint)',
                        color: 'var(--store-primary)',
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: 'var(--store-text-soft)' }}
                      dir={item.type === 'phone' || item.type === 'email' ? 'ltr' : undefined}
                    >
                      {item.value}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
