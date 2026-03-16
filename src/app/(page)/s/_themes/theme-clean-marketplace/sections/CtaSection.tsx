// THEME: clean-marketplace - CtaSection

'use client';

import type { CtaSectionProps } from '../../../_lib/types';

export default function CleanMarketplaceCtaSection({ template, colors, fonts }: CtaSectionProps) {
  if (!template.ctaTitle?.trim() && !template.ctaDesc?.trim() && !template.ctaButton?.trim()) {
    return null;
  }

  return (
    <section
      id="cta-section"
      className="px-4 py-12 text-center text-white lg:px-8"
      style={{ backgroundColor: colors.accent }}
    >
      <div className="mx-auto max-w-3xl">
        {/* DESIGN: The CTA is a simple marketplace prompt, not a split-band marketing section. */}
        {template.ctaTitle ? (
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: fonts.heading }}>
            {template.ctaTitle}
          </h2>
        ) : null}
        {template.ctaDesc ? <p className="mt-2 text-sm text-white/80">{template.ctaDesc}</p> : null}
        {template.ctaButton ? (
          <a
            href="#store-section"
            className="mt-6 inline-flex rounded-lg bg-white px-6 py-2.5 text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-white/90"
            style={{ color: colors.accent, fontFamily: fonts.heading }}
          >
            {template.ctaButton}
          </a>
        ) : null}
      </div>
    </section>
  );
}
