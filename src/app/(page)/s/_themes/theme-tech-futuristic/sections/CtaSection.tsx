// THEME: tech-futuristic - CtaSection

'use client';

import { type CSSProperties } from 'react';
import type { CtaSectionProps } from '../../../_lib/types';

export default function TechFuturisticCtaSection({
  template,
  store,
  colors,
  fonts,
}: CtaSectionProps) {
  if (!template.ctaTitle?.trim() && !template.ctaDesc?.trim() && !template.ctaButton?.trim()) {
    return null;
  }

  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;

  return (
    <section
      id="cta-section"
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#0f0f0f]"
      style={{ ...accentVars, borderTop: `1px solid ${colors.accent}` }}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <span
          className="font-mono text-[18vw] font-thin tracking-tight text-white/[0.02] uppercase"
          style={{ fontFamily: fonts.heading }}
        >
          {store.name}
        </span>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:px-12 lg:py-32">
        {/* DESIGN: The CTA uses a single accent rule and watermark text so it feels system-led, not promotional. */}
        <p
          className="font-mono text-xs tracking-[0.24em] uppercase"
          style={{ color: colors.accent, fontFamily: fonts.body, opacity: 0.7 }}
        >
          {template.tagline || 'SYSTEM READY'}
        </p>

        {template.ctaTitle ? (
          <h2
            className="mt-5 font-mono text-4xl font-light tracking-tight text-[#f2f2f2] lg:text-5xl"
            style={{ fontFamily: fonts.heading }}
          >
            {template.ctaTitle}
          </h2>
        ) : null}

        {template.ctaDesc ? (
          <p
            className="mx-auto mt-4 max-w-sm font-mono text-sm leading-7 text-white/45"
            style={{ fontFamily: fonts.body }}
          >
            {template.ctaDesc}
          </p>
        ) : null}

        {template.ctaButton ? (
          <div className="mt-8">
            <a
              href="#store-section"
              className="inline-flex border border-white/20 px-6 py-3 font-mono text-xs tracking-[0.22em] text-[#f2f2f2] uppercase transition-all duration-150 ease-out hover:border-[var(--tech-accent)] hover:text-[var(--tech-accent)]"
              style={{ fontFamily: fonts.body }}
            >
              {template.ctaButton}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
