// THEME: tech-futuristic - BannerCarousel

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import type { BannerCarouselProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';

export default function TechFuturisticBannerCarousel({ banners, colors }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();
  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;

  if (banners.length === 0) return null;

  const goPrev = () => setCurrent(index => (index - 1 + banners.length) % banners.length);
  const goNext = () => setCurrent(index => (index + 1) % banners.length);

  return (
    <section className="border-b border-white/[0.06] bg-[#0f0f0f]" style={accentVars}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* DESIGN: Keep the carousel framed like a dashboard panel so banners inherit the software UI language. */}
        <div className="relative border-x border-white/[0.06]">
          <div className="relative aspect-[21/8] overflow-hidden bg-[#080808]">
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
                className="absolute start-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/[0.08] bg-[#0f0f0f]/90 text-white/70 transition-all duration-150 ease-out hover:border-white/[0.15] hover:text-[var(--tech-accent)]"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute end-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/[0.08] bg-[#0f0f0f]/90 text-white/70 transition-all duration-150 ease-out hover:border-white/[0.15] hover:text-[var(--tech-accent)]"
                aria-label="Next banner"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-white/35 uppercase">
                  {String(current + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
                </span>
                <div className="flex flex-1 items-center gap-1">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrent(index)}
                      className="h-px flex-1 bg-white/10 transition-all duration-150 ease-out"
                      style={index === current ? { backgroundColor: colors.accent } : undefined}
                      aria-label={`Banner ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
