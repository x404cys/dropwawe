// THEME: default-theme - BannerCarousel

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BannerCarouselProps } from '../../../_lib/types';

export default function DefaultThemeBannerCarousel({ banners }: BannerCarouselProps) {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="relative">
      {/* DESIGN: The top banner mirrors the original storefront with full-width media, soft controls, and compact dots. */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 300 }}>
        <img
          src={banners[currentBanner]}
          alt="Banner"
          className="h-48 w-full object-cover sm:h-72"
        />
      </div>

      {banners.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length)}
            className="absolute start-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border text-white transition-colors duration-200 ease-in-out hover:bg-white/15"
            style={{
              borderColor: 'rgba(255,255,255,0.28)',
              backgroundColor: 'rgba(10,10,10,0.24)',
              backdropFilter: 'blur(10px)',
            }}
            aria-label="السابق"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentBanner(prev => (prev + 1) % banners.length)}
            className="absolute end-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border text-white transition-colors duration-200 ease-in-out hover:bg-white/15"
            style={{
              borderColor: 'rgba(255,255,255,0.28)',
              backgroundColor: 'rgba(10,10,10,0.24)',
              backdropFilter: 'blur(10px)',
            }}
            aria-label="التالي"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="absolute start-1/2 bottom-3 flex -translate-x-1/2 items-center gap-1.5">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentBanner(index)}
                className={`h-2 rounded-full transition-all duration-200 ease-in-out ${
                  index === currentBanner ? 'w-6' : 'w-2'
                }`}
                style={{
                  backgroundColor:
                    index === currentBanner ? 'var(--store-primary)' : 'rgba(255,255,255,0.45)',
                }}
                aria-label={`banner-${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
