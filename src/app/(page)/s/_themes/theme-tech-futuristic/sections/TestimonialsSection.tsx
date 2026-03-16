// THEME: tech-futuristic - TestimonialsSection

'use client';

import type { TestimonialsSectionProps } from '../../../_lib/types';

function renderRating(rating: number, accent: string) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating || 0)));

  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < safeRating;
    return (
      <span key={index} style={filled ? { color: accent } : undefined}>
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
    <section id="testimonials-section" className="border-b border-white/[0.06] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        <div className="border-b border-white/[0.06] pb-6">
          <p
            className="font-mono text-xs tracking-[0.24em] text-white/30 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            CLIENT_REVIEWS.LOG
          </p>
        </div>

        {/* DESIGN: Review cards are framed as discrete log entries rather than lifestyle testimonials. */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <article
              key={item.id}
              className="border border-white/[0.06] bg-[#0f0f0f] p-6"
              style={{ borderTop: `1px solid ${colors.accent}` }}
            >
              <p
                className="font-mono text-sm leading-7 text-white/60 italic"
                style={{ fontFamily: fonts.body }}
              >
                {item.text}
              </p>

              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <div
                  className="font-mono text-xs tracking-[0.2em] text-white/60 uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {renderRating(item.rating, colors.accent)}
                </div>
                <p
                  className="mt-4 font-mono text-xs tracking-[0.22em] text-[#f2f2f2] uppercase"
                  style={{ fontFamily: fonts.heading }}
                >
                  {item.name}
                </p>
                {item.role ? (
                  <p
                    className="mt-1 font-mono text-xs text-white/30"
                    style={{ fontFamily: fonts.body }}
                  >
                    {item.role}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
