// THEME: glassmorphism — CtaSection

'use client';

import type { CtaSectionProps } from '../../../_lib/types';

export default function GlassmorphismCtaSection({
  template,
  store,
  colors,
  fonts,
}: CtaSectionProps) {
  const whatsappNumber =
    template.whatsappNumber ||
    store.phone?.replace(/\s+/g, '') ||
    template.contactItems?.find(contact => contact.type === 'whatsapp' && contact.enabled)?.value ||
    null;

  const ctaHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : template.contactEmail
      ? `mailto:${template.contactEmail}`
      : template.contactWebsite || null;

  if (!template.ctaTitle?.trim() && !template.ctaDesc?.trim() && !template.ctaButton?.trim())
    return null;

  return (
    <section
      id="cta-section"
      className="relative overflow-hidden py-24"
      style={{
        background: `radial-gradient(ellipse at top, ${colors.primary}15 0%, transparent 60%), radial-gradient(ellipse at bottom right, ${colors.accent}10 0%, transparent 50%), ${colors.bg}`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -end-40 -top-40 h-96 w-96 rounded-full opacity-20 blur-[128px]"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute -start-40 -bottom-40 h-80 w-80 rounded-full opacity-15 blur-[128px]"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[16vw] font-thin text-white/[0.02]"
        style={{ fontFamily: fonts.heading }}
      >
        {store.name}
      </div>

      <div className="relative z-[1] mx-auto max-w-xl px-6 text-center">
        {/* DESIGN: CTA is a centered luminous moment that uses glow sparingly so the accent color still feels premium. */}
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: colors.accent, fontFamily: fonts.body }}
        >
          تواصل معنا
        </p>
        {template.ctaTitle ? (
          <h2
            className="mt-4 text-5xl font-light tracking-tight text-white/90"
            style={{ fontFamily: fonts.heading }}
          >
            {template.ctaTitle}
          </h2>
        ) : null}
        {template.ctaDesc ? (
          <p className="mt-4 text-base text-white/50">{template.ctaDesc}</p>
        ) : null}
        {template.ctaButton && ctaHref ? (
          <a
            href={ctaHref}
            target={ctaHref.startsWith('http') ? '_blank' : undefined}
            rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="mt-8 inline-flex rounded-xl border border-white/20 bg-white/10 px-10 py-4 text-white/90 backdrop-blur-xl transition-all duration-200 ease-in-out hover:border-white/30 hover:bg-white/15"
            style={{ boxShadow: `0 0 30px ${colors.accent}30`, fontFamily: fonts.heading }}
          >
            {template.ctaButton}
          </a>
        ) : null}
      </div>
    </section>
  );
}
