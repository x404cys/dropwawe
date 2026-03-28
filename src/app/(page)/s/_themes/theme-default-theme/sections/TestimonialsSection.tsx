// THEME: default-theme - TestimonialsSection

'use client';

import { Quote, Star } from 'lucide-react';
import type { TestimonialsSectionProps } from '../../../_lib/types';

export default function DefaultThemeTestimonialsSection({
  testimonials,
  colors,
  fonts,
}: TestimonialsSectionProps) {
  const items = testimonials
    .filter(item => item.text?.trim().length > 0)
    .sort((a, b) => a.order - b.order);

  if (items.length === 0) return null;

  return (
    <section id="testimonials-section" className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* DESIGN: Testimonial cards follow the reference storefront: quote icon, compact body, initials, and rating stars. */}
        <div className="mb-10 text-center">
          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ color: 'var(--store-primary)', backgroundColor: 'var(--store-primary-faint)' }}
          >
            آراء العملاء
          </span>
          <h2
            className="mt-4 text-xl font-bold sm:text-2xl"
            style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
          >
            ماذا يقولون عنا؟
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(item => (
            <article
              key={item.id}
              className="rounded-2xl border p-4 transition-all duration-200 ease-in-out hover:opacity-95"
              style={{
                backgroundColor: 'var(--store-surface)',
                borderColor: 'var(--store-border)',
              }}
            >
              <Quote
                className="mb-3 h-5 w-5 opacity-30"
                style={{ color: 'var(--store-primary)' }}
              />
              <p
                className="mb-4 text-xs leading-relaxed"
                style={{ color: 'var(--store-text-muted)' }}
              >
                {item.text}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: 'var(--store-primary-faint)',
                    color: 'var(--store-primary)',
                  }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-[11px] font-bold"
                    style={{ color: 'var(--store-text)', fontFamily: fonts.heading }}
                  >
                    {item.name}
                  </p>
                  {item.role ? (
                    <p className="text-[9px]" style={{ color: 'var(--store-text-faint)' }}>
                      {item.role}
                    </p>
                  ) : null}
                </div>
                <div className="me-auto flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className="h-2.5 w-2.5"
                      style={{
                        color: 'var(--store-primary)',
                        fill: star <= item.rating ? 'currentColor' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
