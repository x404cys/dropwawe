'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ActiveColors } from '../_lib/types';
import { useLanguage } from '../_context/LanguageContext';

interface BannerCarouselProps {
  banners: string[];
  colors: ActiveColors;
}

export default function BannerCarousel({ banners, colors }: BannerCarouselProps) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  if (banners.length === 0) return null;

  const previous = () => setCurrent(index => (index - 1 + banners.length) % banners.length);
  const next = () => setCurrent(index => (index + 1) % banners.length);

  return (
    <div className="relative border border-white/10 bg-white/[0.02]">
      <div className="relative aspect-[21/8] overflow-hidden">
        <img
          // REDESIGN: banners become flat editorial panels with restrained controls.
          src={banners[current]}
          alt={t.store.bannerAlt}
          className="h-full w-full object-cover"
        />
      </div>

      {banners.length > 1 ? (
        <>
          <button
            type="button"
            onClick={previous}
            className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/30 transition-opacity duration-200 hover:opacity-70"
            style={{ color: colors.text }}
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/30 transition-opacity duration-200 hover:opacity-70"
            style={{ color: colors.text }}
            aria-label="Next banner"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute right-4 bottom-4 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className="h-[2px] w-8 transition-opacity duration-200"
                style={{
                  backgroundColor: index === current ? colors.accent : colors.text,
                  opacity: index === current ? 1 : 0.25,
                }}
                aria-label={`Banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
