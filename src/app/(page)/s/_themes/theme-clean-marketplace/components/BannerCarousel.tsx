// THEME: clean-marketplace - BannerCarousel

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { BannerCarouselProps } from '../../../_lib/types';

export default function CleanMarketplaceBannerCarousel({ banners, colors }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (banners.length === 0) return null;

  const previous = () => setCurrent(index => (index - 1 + banners.length) % banners.length);
  const next = () => setCurrent(index => (index + 1) % banners.length);

  return (
    <section className="px-4 lg:px-8">
      {/* DESIGN: Secondary banners stay lightweight and app-like, sitting inside rounded cards instead of full-bleed promos. */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <div className="aspect-[16/6] sm:aspect-[16/5] lg:aspect-[16/4]">
          <img src={banners[current]} alt="Banner" className="h-full w-full object-cover" />
        </div>

        {banners.length > 1 ? (
          <>
            <button
              type="button"
              onClick={previous}
              className="absolute start-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-all duration-200 ease-in-out hover:bg-white"
              aria-label="السابق"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute end-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-all duration-200 ease-in-out hover:bg-white"
              aria-label="التالي"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className="h-2 w-2 rounded-full bg-white/70 transition-all duration-200 ease-in-out"
                  style={index === current ? { backgroundColor: colors.accent } : undefined}
                  aria-label={`Banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
