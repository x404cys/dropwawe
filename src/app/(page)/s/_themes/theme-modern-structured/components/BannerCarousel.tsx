// THEME: modern-structured — BannerCarousel

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { BannerCarouselProps } from '../../../_lib/types';

export default function ModernStructuredBannerCarousel({ banners, colors }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (banners.length === 0) return null;

  const previous = () => setCurrent(index => (index - 1 + banners.length) % banners.length);
  const next = () => setCurrent(index => (index + 1) % banners.length);

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      {/* DESIGN: Supplemental banners keep the same bordered, rounded surface language as the rest of the structured layout. */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="aspect-[16/5] bg-slate-100">
          <img src={banners[current]} alt="Banner" className="h-full w-full object-cover" />
        </div>

        {banners.length > 1 ? (
          <>
            <button
              type="button"
              onClick={previous}
              className="absolute start-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-gray-200 bg-white/95 text-slate-600 shadow-lg transition-all duration-150 ease-in-out hover:border-gray-300 hover:text-slate-900"
              aria-label="Previous banner"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute end-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-gray-200 bg-white/95 text-slate-600 shadow-lg transition-all duration-150 ease-in-out hover:border-gray-300 hover:text-slate-900"
              aria-label="Next banner"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className="h-2 w-2 rounded-full bg-white/80 transition-all duration-150 ease-in-out"
                  style={index === current ? { backgroundColor: colors.accent } : undefined}
                  aria-label={`Banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
