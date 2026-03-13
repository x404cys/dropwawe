// Purpose: Banner image carousel — "use client", prev/next + dot indicators.
// Matches Storefront.tsx banner section exactly.

'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ActiveColors } from '../_lib/types';

interface BannerCarouselProps {
  banners: string[];
  colors: ActiveColors;
}

export default function BannerCarousel({ banners, colors }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (banners.length === 0) return null;

  const prev = () => setCurrent((p) => (p - 1 + banners.length) % banners.length);
  const next = () => setCurrent((p) => (p + 1) % banners.length);

  return (
    <div className="relative">
      <div className="w-full overflow-hidden" style={{ maxHeight: 300 }}>
        <img
          src={banners[current]}
          alt="بنر"
          className="w-full h-48 sm:h-72 object-cover"
        />
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-sm"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-6' : 'w-2 bg-white/50'
                }`}
                style={i === current ? { backgroundColor: colors.primary } : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
