// THEME: tech-futuristic - TestimonialsSection

'use client';

import type { TestimonialsSectionProps } from '../../../_lib/types';

function renderRating(rating: number, accent: string, textFaint: string) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < safeRating;
    return (
      <span key={index} style={{ color: filled ? accent : textFaint }}>
        {filled ? '■' : '□'}
      </span>
    );
  });
}

export default function TechFuturisticTestimonialsSection({
  testimonials,
  colors,
  fonts,
}: TestimonialsSectionProps) {
  const items = testimonials.filter(item => item.text?.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <section
      id="testimonials-section"
      className="border-b"
      style={{ background: colors.bg, borderColor: colors.text + '0f' }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        {/* ── HEADER ── */}
        <div className="border-b pb-6" style={{ borderColor: colors.text + '0f' }}>
          <p
            className="font-mono text-xs tracking-[0.24em] uppercase"
            style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
          >
            CLIENT_REVIEWS.LOG
          </p>
        </div>

        {/* ── GRID ── */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <article
              key={item.id}
              className="p-6"
              style={{
                background: colors.bg,
                border: `0.5px solid ${colors.text + '0f'}`,
                borderTop: `1px solid ${colors.accent}`,
              }}
            >
              {/* Quote */}
              <p
                className="font-mono text-sm leading-7 italic"
                style={{ fontFamily: fonts.body, color: colors.text + '99' }}
              >
                {item.text}
              </p>

              {/* Footer */}
              <div className="mt-4 border-t pt-4" style={{ borderColor: colors.text + '0f' }}>
                {/* Rating */}
                <div
                  className="font-mono text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {renderRating(item.rating, colors.accent, colors.text + '26')}
                </div>

                {/* Name */}
                <p
                  className="mt-4 font-mono text-xs tracking-[0.22em] uppercase"
                  style={{ fontFamily: fonts.heading, color: colors.text }}
                >
                  {item.name}
                </p>

                {/* Role */}
                {item.role && (
                  <p
                    className="mt-1 font-mono text-xs"
                    style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
                  >
                    {item.role}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
