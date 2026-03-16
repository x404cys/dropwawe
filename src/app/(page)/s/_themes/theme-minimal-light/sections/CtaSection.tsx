// THEME: minimal-light — CtaSection

'use client';

import type { CtaSectionProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';
import { buildContactItems } from '../../../_utils/contacts';

export default function MinimalLightCtaSection({
  template,
  store,
  colors,
  fonts,
}: CtaSectionProps) {
  const { t } = useLanguage();
  const whatsappItem = buildContactItems(template, store).find(
    item => item.type === 'whatsapp' && item.enabled && item.value.trim().length > 0
  );
  const whatsappNumber = whatsappItem?.value.replace(/\s+/g, '') ?? '';

  if (!template.ctaTitle?.trim() && !template.ctaDesc?.trim() && !template.ctaButton?.trim()) {
    return null;
  }

  return (
    <section id="cta-section" className="border-y border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-12 lg:py-24">
        {template.ctaTitle ? (
          <h2
            className="text-4xl font-medium tracking-tight text-stone-900 lg:text-5xl"
            style={{ fontFamily: fonts.heading }}
          >
            {template.ctaTitle}
          </h2>
        ) : null}

        {template.ctaDesc ? (
          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-600"
            style={{ fontFamily: fonts.body }}
          >
            {template.ctaDesc}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {template.ctaButton ? (
            <a
              href="#store-section"
              className="border border-stone-900 px-6 py-3 text-xs font-semibold tracking-[0.16em] text-stone-900 uppercase transition-colors duration-200"
              style={{ borderColor: colors.accent, color: colors.accent, fontFamily: fonts.body }}
            >
              {template.ctaButton}
            </a>
          ) : null}

          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold tracking-[0.16em] text-stone-600 uppercase transition-colors duration-200 hover:text-stone-900"
              style={{ fontFamily: fonts.body }}
            >
              {t.cta.whatsapp}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
