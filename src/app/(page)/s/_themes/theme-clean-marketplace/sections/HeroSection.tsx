// THEME: clean-marketplace - HeroSection

'use client';

import Image from 'next/image';
import type { HeroSectionProps } from '../../../_lib/types';

export default function CleanMarketplaceHeroSection({
  store,
  template,
  colors,
  fonts,
}: HeroSectionProps) {
  const hero = template.heroSection;

  if (hero && (!hero.enabled || hero.visible === false)) {
    return null;
  }

  const image = hero?.backgroundImage || hero?.heroImage || hero?.heroImageMobile || null;
  const title = hero?.title?.trim() || store.name?.trim() || '';
  const subtitle =
    hero?.subtitle?.trim() || hero?.description?.trim() || template.storeDescription?.trim() || '';
  const sideLabel =
    hero?.overline?.trim() || template.tagline?.trim() || store.description?.trim() || '';

  return (
    <section id={hero?.sectionId?.trim() || 'hero-section'} className="w-full bg-white">
      {/* DESIGN: The hero is treated as a marketplace banner, so it bleeds edge-to-edge and avoids centered landing-page composition. */}
      <div className="relative aspect-[16/7] overflow-hidden md:aspect-[16/6] lg:aspect-[16/5]">
        {image ? (
          <Image
            src={image}
            alt={hero?.heroImageAlt || title || store.name || ''}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full" style={{ backgroundColor: colors.primary }} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 grid gap-4 p-4 lg:grid-cols-2 lg:p-8">
          <div className="lg:col-start-2">
            <h1
              className="text-3xl leading-tight font-bold text-white lg:text-5xl"
              style={{ fontFamily: fonts.heading }}
            >
              {title}
            </h1>
            {subtitle ? <p className="mt-2 text-base text-white/80">{subtitle}</p> : null}
          </div>

          {sideLabel ? (
            <div className="lg:col-start-1 lg:self-end lg:text-end">
              <p className="text-sm font-light whitespace-pre-line text-white/70">{sideLabel}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
