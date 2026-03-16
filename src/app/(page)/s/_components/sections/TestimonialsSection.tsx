'use client';

import { ActiveColors, StorefrontTestimonial } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';

interface TestimonialsSectionProps {
  testimonials: StorefrontTestimonial[];
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function TestimonialsSection({
  testimonials,
  colors,
  headingStyle,
}: TestimonialsSectionProps) {
  const { t } = useLanguage();
  const items = testimonials.filter(item => item.text?.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <section id="testimonials-section" className="border-b border-white/5 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="mb-16 max-w-2xl">
          <p
            className="text-xs font-light tracking-[0.32em] uppercase opacity-40"
            style={{ color: colors.text }}
          >
            {t.nav.testimonials}
          </p>
          <h2
            // REDESIGN: testimonials shift from card grid to a calmer editorial reading column.
            className="mt-6 text-4xl font-thin tracking-tight lg:text-6xl"
            style={{ ...headingStyle, color: colors.text }}
          >
            {t.testimonials.heading}
          </h2>
        </div>

        <div className="mx-auto flex max-w-3xl flex-col gap-14">
          {items.map(item => (
            <article key={item.id} className="border-t border-white/10 pt-8">
              <p
                className="text-2xl leading-relaxed font-light italic lg:text-3xl"
                style={{ color: colors.text }}
              >
                {item.text}
              </p>

              <div className="mt-6">
                <p
                  className="text-xs font-light tracking-[0.28em] uppercase opacity-60"
                  style={{ color: colors.text }}
                >
                  {item.name}
                </p>
                {item.role ? (
                  <p
                    className="mt-2 text-[10px] font-light tracking-[0.22em] uppercase opacity-40"
                    style={{ color: colors.text }}
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
