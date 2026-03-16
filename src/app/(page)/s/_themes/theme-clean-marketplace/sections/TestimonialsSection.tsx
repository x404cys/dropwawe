// THEME: clean-marketplace - TestimonialsSection

'use client';

import { Star } from 'lucide-react';
import type { TestimonialsSectionProps } from '../../../_lib/types';

export default function CleanMarketplaceTestimonialsSection({
  testimonials,
  colors,
  fonts,
}: TestimonialsSectionProps) {
  const items = testimonials.filter(item => item.text?.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <section id="testimonials-section" className="bg-white px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* DESIGN: Testimonials reuse soft marketplace cards so the section feels like part of the shopping app. */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {items.map(item => (
            <article key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: Math.max(0, Math.min(5, Math.round(item.rating || 0))) }).map(
                  (_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-current"
                      style={{ color: colors.accent }}
                    />
                  )
                )}
              </div>
              <p className="text-sm leading-relaxed text-gray-700 italic">{item.text}</p>
              <p
                className="mt-3 text-xs font-semibold text-gray-900"
                style={{ fontFamily: fonts.heading }}
              >
                {item.name}
              </p>
              {item.role ? <p className="text-xs text-gray-400">{item.role}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
