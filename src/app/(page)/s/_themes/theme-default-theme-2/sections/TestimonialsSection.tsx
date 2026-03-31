'use client';

import { Star } from 'lucide-react';

import type { TestimonialsSectionProps } from '../../../_lib/types';
import {
  storefrontContainerClass,
  storefrontSectionCompactClass,
  storefrontTitleClass,
} from '../themeSystem';

export default function DefaultThemeTestimonialsSection({
  testimonials,
  fonts,
}: TestimonialsSectionProps) {
  const items = testimonials
    .filter(item => item.text?.trim().length > 0)
    .sort((a, b) => a.order - b.order);

  if (items.length === 0) return null;

  return (
    <section id="testimonials-section" className={storefrontSectionCompactClass}>
      <div className={storefrontContainerClass}>
        <div className="mb-10 max-w-2xl space-y-3">
          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase"
            style={{
              backgroundColor: 'var(--store-primary-faint)',
              color: 'var(--store-primary)',
            }}
          >
            Reviews
          </span>

          <h2 className={storefrontTitleClass} style={{ fontFamily: fonts.heading }}>
            آراء العملاء
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <article
              key={item.id}
              className="rounded-xl border p-6"
              style={{
                backgroundColor: 'var(--store-surface)',
                borderColor: 'var(--store-border)',
              }}
            >
              <div
                className="mb-5 flex items-center gap-1"
                style={{ color: 'var(--store-primary)' }}
              >
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className="h-4 w-4"
                    style={{ fill: star <= item.rating ? 'currentColor' : 'none' }}
                  />
                ))}
              </div>

              <p
                className="text-sm leading-7 sm:text-base sm:leading-8"
                style={{ color: 'var(--store-text-soft)' }}
              >
                {item.text}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--store-primary-faint)',
                    color: 'var(--store-primary)',
                  }}
                >
                  {item.name.charAt(0)}
                </span>

                <div className="space-y-1">
                  <p className="text-sm font-semibold" style={{ fontFamily: fonts.heading }}>
                    {item.name}
                  </p>
                  {item.role ? (
                    <p className="text-sm" style={{ color: 'var(--store-text-muted)' }}>
                      {item.role}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
