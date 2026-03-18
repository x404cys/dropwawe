// THEME: tech-futuristic - BannerCarousel

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { BannerCarouselProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';

export default function TechFuturisticBannerCarousel({ banners, colors }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t } = useLanguage();

  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;

  if (banners.length === 0) return null;

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(idx);
        setIsTransitioning(false);
      }, 300);
    },
    [isTransitioning]
  );

  const next = useCallback(
    () => goTo((current + 1) % banners.length),
    [current, goTo, banners.length]
  );

  const prev = useCallback(
    () => goTo((current - 1 + banners.length) % banners.length),
    [current, goTo, banners.length]
  );

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(next, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, next]);

  const arrowBtnStyle: CSSProperties = {
    background: colors.bg + 'e6',
    borderColor: colors.text + '14',
    color: colors.text + 'b3',
  };

  return (
    <section
      className="border-b"
      style={{
        ...accentVars,
        background: colors.bg,
        borderColor: colors.text + '0f',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="relative border-x" style={{ borderColor: colors.text + '0f' }}>
          {/* ── IMAGE ── */}
          <div
            className={`relative aspect-[21/8] overflow-hidden transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ background: colors.bg }}
          >
            <img
              src={banners[current]}
              alt={t.store.bannerAlt}
              className="h-full w-full object-cover"
            />
          </div>

          {/* ── CONTROLS ── */}
          {banners.length > 1 && (
            <>
              {/* Prev */}
              <button
                type="button"
                onClick={prev}
                className="absolute start-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border transition-all duration-150 ease-out hover:border-[var(--tech-accent)] hover:text-[var(--tech-accent)]"
                style={arrowBtnStyle}
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={next}
                className="absolute end-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border transition-all duration-150 ease-out hover:border-[var(--tech-accent)] hover:text-[var(--tech-accent)]"
                style={arrowBtnStyle}
                aria-label="Next banner"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Counter + progress dots */}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4">
                <span
                  className="font-mono text-[11px] tracking-[0.2em] uppercase"
                  style={{ color: colors.text + '59' }}
                >
                  {String(current + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
                </span>

                <div className="flex flex-1 items-center gap-1">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goTo(index)}
                      className="h-px flex-1 transition-all duration-300 ease-out"
                      style={{
                        backgroundColor: index === current ? colors.accent : colors.text + '1a',
                      }}
                      aria-label={`Banner ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
