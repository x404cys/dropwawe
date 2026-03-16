// THEME: glassmorphism — TestimonialsSection

'use client';

import type { TestimonialsSectionProps } from '../../../_lib/types';

export default function GlassmorphismTestimonialsSection({
  testimonials,
  colors,
  fonts,
}: TestimonialsSectionProps) {
  const items = [...testimonials].sort((a, b) => a.order - b.order);

  if (items.length === 0) return null;

  return (
    <section
      id="testimonials-section"
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top, ${colors.primary}10 0%, transparent 60%), ${colors.bg}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 text-center">
          <p
            className="text-xs tracking-widest text-white/35 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            آراء العملاء
          </p>
        </div>

        {/* DESIGN: Testimonials use the same glass card recipe as products so the whole page feels assembled from one translucent system. */}
        <div className="grid gap-4 md:grid-cols-3">
          {items.map(item => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-200 ease-in-out hover:border-white/[0.14]"
            >
              <div className="text-sm" style={{ color: colors.accent }}>
                {'★'.repeat(Math.max(0, Math.min(5, Math.round(item.rating || 0))))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60 italic">{item.text}</p>
              <div className="mt-5 border-t border-white/[0.06] pt-5">
                <p
                  className="text-sm font-medium text-white/80"
                  style={{ fontFamily: fonts.heading }}
                >
                  {item.name}
                </p>
                {item.role ? <p className="mt-0.5 text-xs text-white/35">{item.role}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
