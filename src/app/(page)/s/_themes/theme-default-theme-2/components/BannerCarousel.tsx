'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { BannerCarouselProps } from '../../../_lib/types';

export default function DefaultThemeBannerCarousel({ banners }: BannerCarouselProps) {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative h-[240px] w-full sm:h-[360px] lg:h-[440px]">
        <img src={banners[currentBanner]} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/5" />
      </div>

      {banners.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length)}
            className="absolute start-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border text-white transition-colors duration-200 hover:bg-white/15"
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
            className="absolute end-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border text-white transition-colors duration-200 hover:bg-white/15"
            style={{
              borderColor: 'rgba(255,255,255,0.28)',
              backgroundColor: 'rgba(10,10,10,0.24)',
              backdropFilter: 'blur(10px)',
            }}
            aria-label="التالي"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentBanner(index)}
                className="h-1.5 rounded-full transition-all duration-200"
                style={{
                  width: index === currentBanner ? '1.75rem' : '0.5rem',
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
