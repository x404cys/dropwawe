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
      className="relative overflow-hidden"
      style={{
        ...accentVars,
        background: colors.bg,
        borderTop: `1px solid ${colors.accent}`,
        borderBottom: `0.5px solid ${colors.text + '0f'}`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <span
          className="font-mono text-[18vw] font-thin tracking-tight uppercase"
          style={{
            fontFamily: fonts.heading,
            color: colors.text + '05',
          }}
        >
          {store.name}
        </span>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:px-12 lg:py-32">
        <p
          className="font-mono text-xs tracking-[0.24em] uppercase"
          style={{
            fontFamily: fonts.body,
            color: colors.accent,
            opacity: 0.7,
          }}
        >
          {template.tagline || 'SYSTEM READY'}
        </p>

        {template.ctaTitle && (
          <h2
            className="mt-5 font-mono text-4xl font-light tracking-tight lg:text-5xl"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            {template.ctaTitle}
          </h2>
        )}

        {template.ctaDesc && (
          <p
            className="mx-auto mt-4 max-w-sm font-mono text-sm leading-7"
            style={{ fontFamily: fonts.body, color: colors.text + '73' }}
          >
            {template.ctaDesc}
          </p>
        )}

        {template.ctaButton && (
          <div className="mt-8">
            <a
              href="#store-section"
              className="inline-flex border px-6 py-3 font-mono text-xs tracking-[0.22em] uppercase transition-all duration-150 ease-out hover:border-[var(--tech-accent)] hover:text-[var(--tech-accent)]"
              style={{
                fontFamily: fonts.body,
                color: colors.text,
                borderColor: colors.text + '33',
              }}
            >
              {template.ctaButton}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
