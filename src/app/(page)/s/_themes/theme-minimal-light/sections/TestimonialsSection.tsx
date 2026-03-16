// THEME: minimal-light — TestimonialsSection

'use client';

import type { TestimonialsSectionProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';

export default function MinimalLightTestimonialsSection({
  testimonials,
  fonts,
}: TestimonialsSectionProps) {
  const { t } = useLanguage();
  const items = testimonials.filter(item => item.text?.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <section id="testimonials-section" className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div className="max-w-2xl">
          <p
            className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {t.nav.testimonials}
          </p>
          <h2
            className="mt-4 text-4xl font-medium tracking-tight text-stone-900 lg:text-5xl"
            style={{ fontFamily: fonts.heading }}
          >
            {t.testimonials.heading}
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <article key={item.id} className="border border-stone-200 bg-white p-6">
              <p className="text-base leading-8 text-stone-700" style={{ fontFamily: fonts.body }}>
                {item.text}
              </p>
              <div className="mt-5 border-t border-stone-200 pt-4">
                <p
                  className="text-sm font-medium text-stone-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  {item.name}
                </p>
                {item.role ? (
                  <p
                    className="mt-1 text-xs tracking-[0.14em] text-stone-500 uppercase"
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
