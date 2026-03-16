'use client';

import { MessageCircle } from 'lucide-react';
import { ActiveColors, StorefrontStore, StorefrontTemplate } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';
import { buildContactItems } from '../../_utils/contacts';

interface CtaSectionProps {
  template: StorefrontTemplate;
  store: StorefrontStore;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function CtaSection({ template, store, colors, headingStyle }: CtaSectionProps) {
  const { t } = useLanguage();
  const whatsappItem = buildContactItems(template, store).find(
    item => item.type === 'whatsapp' && item.enabled && item.value.trim().length > 0
  );
  const whatsappNumber = whatsappItem?.value.replace(/\s+/g, '') ?? '';

  if (!template.ctaTitle?.trim() && !template.ctaDesc?.trim() && !template.ctaButton?.trim()) {
    return null;
  }

  return (
    <section id="cta-section" className="border-b border-white/5 bg-white/[0.03]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="text-xs font-light tracking-[0.32em] uppercase opacity-40"
            style={{ color: colors.text }}
          >
            {template.tagline || t.nav.store}
          </p>

          {template.ctaTitle ? (
            <h2
              // REDESIGN: CTA becomes a single dark luxury band with typography doing the work.
              className="mt-6 text-5xl font-thin tracking-tight lg:text-7xl"
              style={{ ...headingStyle, color: colors.text }}
            >
              {template.ctaTitle}
            </h2>
          ) : null}

          {template.ctaDesc ? (
            <p
              className="mx-auto mt-6 max-w-xl text-sm leading-relaxed font-light opacity-65"
              style={{ color: colors.text }}
            >
              {template.ctaDesc}
            </p>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {template.ctaButton ? (
              <a
                href="#store-section"
                className="border px-8 py-3 text-xs font-light tracking-[0.28em] uppercase transition-colors duration-200"
                style={{ color: colors.text, borderColor: colors.text }}
                onMouseEnter={event => {
                  event.currentTarget.style.backgroundColor = colors.accent;
                  event.currentTarget.style.borderColor = colors.accent;
                  event.currentTarget.style.color = colors.bg;
                }}
                onMouseLeave={event => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                  event.currentTarget.style.borderColor = colors.text;
                  event.currentTarget.style.color = colors.text;
                }}
              >
                {template.ctaButton}
              </a>
            ) : null}

            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-light tracking-[0.28em] uppercase opacity-60 transition-opacity duration-200 hover:opacity-100"
                style={{ color: colors.text }}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{t.cta.whatsapp}</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
