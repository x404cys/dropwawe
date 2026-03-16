// THEME: modern-structured — TestimonialsSection

'use client';

import type { TestimonialsSectionProps } from '../../../_lib/types';

export default function ModernStructuredTestimonialsSection({
  testimonials,
  colors,
  fonts,
}: TestimonialsSectionProps) {
  const items = testimonials.filter(item => item.text?.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <section id="testimonials-section" className="bg-slate-50">
      <div className="mx-auto max-w-6xl border-t border-gray-200 px-6 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <p
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: colors.accent, fontFamily: fonts.body }}
          >
            Testimonials
          </p>
          <h2
            className="mt-3 text-2xl font-semibold tracking-tight text-slate-900"
            style={{ fontFamily: fonts.heading }}
          >
            What customers say
          </h2>
        </div>

        {/* DESIGN: Testimonials use a fixed three-column grid to keep the section predictable and easy to scan. */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map(item => (
            <article
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow duration-150 ease-in-out hover:shadow-sm"
            >
              <div className="text-sm" style={{ color: colors.accent }}>
                {'★'.repeat(Math.max(0, Math.min(5, Math.round(item.rating || 0))))}
                <span className="text-slate-300">
                  {'★'.repeat(Math.max(0, 5 - Math.round(item.rating || 0)))}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 italic">{item.text}</p>
              <div className="mt-5 border-t border-gray-100 pt-5">
                <p
                  className="text-sm font-semibold text-slate-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  {item.name}
                </p>
                {item.role ? <p className="mt-0.5 text-xs text-slate-400">{item.role}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
