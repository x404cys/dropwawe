// THEME: modern-structured — CtaSection

'use client';

import type { CtaSectionProps } from '../../../_lib/types';

export default function ModernStructuredCtaSection({ template, colors, fonts }: CtaSectionProps) {
  if (!template.ctaTitle?.trim() && !template.ctaDesc?.trim() && !template.ctaButton?.trim()) {
    return null;
  }

  return (
    <section id="cta-section" className="bg-[#fafafa] py-20">
      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-slate-900 px-6 py-12 lg:px-8"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 100%',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* DESIGN: CTA is the only dark band so it clearly punctuates the page hierarchy without affecting the rest of the layout system. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[60%_40%] lg:items-center">
          <div>
            {template.ctaTitle ? (
              <h2
                className="text-4xl font-semibold tracking-tight text-white"
                style={{ fontFamily: fonts.heading }}
              >
                {template.ctaTitle}
              </h2>
            ) : null}
            {template.ctaDesc ? (
              <p className="mt-4 max-w-md text-base text-slate-400">{template.ctaDesc}</p>
            ) : null}
          </div>

          <div className="flex lg:justify-center">
            {template.ctaButton ? (
              <a
                href="#store-section"
                className="rounded-xl px-8 py-3.5 text-sm font-medium text-white transition-all duration-150 ease-in-out hover:opacity-90"
                style={{ backgroundColor: colors.accent, fontFamily: fonts.heading }}
              >
                {template.ctaButton}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
