// THEME: glassmorphism — BannerCarousel

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BannerCarouselProps } from '../../../_lib/types';

export default function GlassmorphismBannerCarousel({ banners, colors }: BannerCarouselProps) {
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
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl">
      {/* DESIGN: Global banners become luminous glass panels so promos feel integrated into the ambient background instead of pasted on top. */}
      <div className="relative aspect-[16/5]">
        <img src={banners[currentBanner]} alt="Banner" className="h-full w-full object-cover" />

        {banners.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length)}
              className="absolute start-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white/70 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-white/[0.18] hover:bg-black/40"
              aria-label="السابق"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentBanner(prev => (prev + 1) % banners.length)}
              className="absolute end-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white/70 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-white/[0.18] hover:bg-black/40"
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
                  className="h-2 w-2 rounded-full bg-white/35 transition-all duration-200 ease-in-out"
                  style={
                    index === currentBanner
                      ? { backgroundColor: colors.accent, boxShadow: `0 0 12px ${colors.accent}40` }
                      : undefined
                  }
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
