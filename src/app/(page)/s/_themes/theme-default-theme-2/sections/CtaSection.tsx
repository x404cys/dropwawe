'use client';

import { MessageCircle } from 'lucide-react';

import type { CtaSectionProps } from '../../../_lib/types';
import { storefrontContainerClass, storefrontSectionCompactClass } from '../themeSystem';

export default function DefaultThemeCtaSection({ template, store, fonts }: CtaSectionProps) {
  const whatsappNumber =
    template.whatsappNumber ||
    store.phone?.replace(/\s+/g, '') ||
    template.contactItems?.find(item => item.type === 'whatsapp' && item.enabled)?.value ||
    null;

  if (!template.ctaTitle?.trim() && !template.ctaDesc?.trim() && !template.ctaButton?.trim()) {
    return null;
  }

  return (
    <section id="cta-section" className={storefrontSectionCompactClass}>
      <div className={storefrontContainerClass}>
        <div
          className="rounded-xl border px-6 py-10 text-center sm:px-10 sm:py-12"
          style={{
            backgroundColor: 'var(--store-surface)',
            borderColor: 'var(--store-border)',
          }}
        >
          <div className="mx-auto max-w-2xl space-y-4">
            {template.ctaTitle ? (
              <h2
                className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl"
                style={{ fontFamily: fonts.heading }}
              >
                {template.ctaTitle}
              </h2>
            ) : null}

            {template.ctaDesc ? (
              <p
                className="text-sm leading-7 sm:text-base sm:leading-8"
                style={{ color: 'var(--store-text-muted)' }}
              >
                {template.ctaDesc}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {template.ctaButton ? (
              <a
                href="#store-section"
                className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--store-text)',
                  color: 'var(--store-bg)',
                }}
              >
                {template.ctaButton}
              </a>
            ) : null}

            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-semibold"
                style={{
                  borderColor: 'var(--store-border)',
                  color: 'var(--store-text)',
                }}
              >
                <MessageCircle className="h-4 w-4" />
                تواصل واتساب
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
