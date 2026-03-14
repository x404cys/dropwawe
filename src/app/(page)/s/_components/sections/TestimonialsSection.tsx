// Purpose: Testimonials section - Client Component.
// 1/2/4 col grid of review cards. Matches Storefront.tsx case "testimonials".

'use client';

import { Quote, Star } from 'lucide-react';
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

  return (
    <section id="testimonials-section" className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
          >
            {t.testimonials.badge}
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold mt-4"
            style={{ ...headingStyle, color: colors.text }}
          >
            {t.testimonials.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {testimonials.map((tItem, i) => (
            <div
              key={`${i}-${tItem.name}`}
              className="bg-card border border-border rounded-2xl p-4 hover:shadow-sm transition-colors"
            >
              <Quote className="h-5 w-5 mb-3" style={{ color: `${colors.primary}25` }} />
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tItem.text}</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                >
                  {tItem.name[0]}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground">{tItem.name}</p>
                  <p className="text-[9px] text-muted-foreground">{tItem.role}</p>
                </div>
                <div className="flex gap-0.5 mr-auto">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-2.5 w-2.5"
                      style={{
                        color: colors.primary,
                        fill: s <= tItem.rating ? 'currentColor' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
