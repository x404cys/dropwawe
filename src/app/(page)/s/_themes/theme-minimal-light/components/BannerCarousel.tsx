// THEME: minimal-light — BannerCarousel

'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BannerCarouselProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';

export default function MinimalLightBannerCarousel({ banners, colors }: BannerCarouselProps) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  if (banners.length === 0) return null;

  const goPrev = () => setCurrent(index => (index - 1 + banners.length) % banners.length);
  const goNext = () => setCurrent(index => (index + 1) % banners.length);

  return (
    <div className="relative border border-stone-200 bg-white">
      <div className="relative aspect-[21/8] overflow-hidden">
        <img
          src={banners[current]}
          alt={t.store.bannerAlt}
          className="h-full w-full object-cover"
        />
      </div>

      {banners.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute start-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-stone-200 bg-white text-stone-900 transition-colors duration-200 hover:border-stone-400"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute end-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-stone-200 bg-white text-stone-900 transition-colors duration-200 hover:border-stone-400"
            aria-label="Next banner"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className="h-2 w-2 rounded-full bg-stone-300 transition-colors duration-200"
                style={index === current ? { backgroundColor: colors.accent } : undefined}
                aria-label={`Banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
