// THEME: default-theme - CtaSection

'use client';

import { MessageCircle } from 'lucide-react';
import type { CtaSectionProps } from '../../../_lib/types';
import { getReadableTextColor } from '../themeSystem';

export default function DefaultThemeCtaSection({
  template,
  store,
  colors,
  fonts,
}: CtaSectionProps) {
  const whatsappNumber =
    template.whatsappNumber ||
    store.phone?.replace(/\s+/g, '') ||
    template.contactItems?.find(item => item.type === 'whatsapp' && item.enabled)?.value ||
    null;

  if (!template.ctaTitle?.trim() && !template.ctaDesc?.trim() && !template.ctaButton?.trim()) {
    return null;
  }

  const primaryButtonTextColor = getReadableTextColor(colors.primary);

  return (
    <section id="cta-section" className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* DESIGN: The CTA keeps the original source layout: centered copy, solid primary button, secondary WhatsApp action. */}
        <div
          className="mx-auto max-w-3xl rounded-3xl border px-6 py-10 sm:px-10 sm:py-12"
          style={{
            backgroundColor: 'var(--store-surface)',
            borderColor: 'var(--store-border)',
          }}
        >
          {template.ctaTitle ? (
            <h2
              className="mb-3 text-xl font-bold sm:text-2xl"
              style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
            >
              {template.ctaTitle}
            </h2>
          ) : null}
          {template.ctaDesc ? (
            <p className="mb-6 text-xs sm:text-sm" style={{ color: 'var(--store-text-muted)' }}>
              {template.ctaDesc}
            </p>
          ) : null}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {template.ctaButton ? (
              <a
                href="#store-section"
                className="inline-flex w-full items-center justify-center rounded-2xl px-8 py-3.5 text-sm font-bold transition-all duration-200 ease-in-out hover:opacity-95 sm:w-auto"
                style={{
                  backgroundColor: 'var(--store-primary)',
                  color: primaryButtonTextColor,
                  fontFamily: fonts.heading,
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-8 py-3.5 text-sm font-bold transition-all duration-200 ease-in-out hover:opacity-90 sm:w-auto"
                style={{
                  backgroundColor: 'var(--store-bg)',
                  borderColor: 'var(--store-border)',
                  color: 'var(--store-text)',
                }}
              >
                <MessageCircle className="h-4 w-4" /> تواصل واتساب
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
