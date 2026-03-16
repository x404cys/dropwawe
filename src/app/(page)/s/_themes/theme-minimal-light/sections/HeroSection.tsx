// THEME: minimal-light — HeroSection

'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { HeroSectionProps, StorefrontHeroSection } from '../../../_lib/types';

function getSectionStyle(hero: StorefrontHeroSection | null): CSSProperties {
  if (!hero) return {};

  if (hero.backgroundType === 'COLOR' && hero.backgroundColor) {
    return { backgroundColor: hero.backgroundColor };
  }

  if (hero.backgroundType === 'GRADIENT') {
    return {
      background: `linear-gradient(180deg, ${hero.backgroundGradientFrom || '#ffffff'}, ${
        hero.backgroundGradientVia || '#fafaf9'
      }, ${hero.backgroundGradientTo || '#f5f5f4'})`,
    };
  }

  return {};
}

function getHeightClass(hero: StorefrontHeroSection | null) {
  switch (hero?.sectionHeight) {
    case 'screen':
      return 'min-h-screen';
    case 'xl':
      return 'min-h-[90vh]';
    case 'lg':
      return 'min-h-[80vh]';
    case 'md':
      return 'min-h-[70vh]';
    case 'sm':
      return 'min-h-[60vh]';
    default:
      return 'min-h-[60vh]';
  }
}

function getTextAlignment(hero: StorefrontHeroSection | null) {
  switch (hero?.contentAlign) {
    case 'right':
      return 'text-right items-end';
    case 'center':
      return 'text-center items-center';
    default:
      return 'text-left items-start';
  }
}

export default function MinimalLightHeroSection({
  store,
  template,
  colors,
  fonts,
}: HeroSectionProps) {
  const hero = template.heroSection;

  if (hero && (!hero.enabled || hero.visible === false)) {
    return null;
  }

  const title = hero?.title?.trim() || store.name?.trim() || '';
  const overline = hero?.overline?.trim() || template.tagline?.trim() || '';
  const description =
    hero?.description?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const subtitle = hero?.subtitle?.trim() || '';
  const image = hero?.heroImage || hero?.heroImageMobile || null;
  const primaryText = hero?.primaryButtonText?.trim() || template.heroButtonText?.trim() || '';
  const secondaryText =
    hero?.secondaryButtonText?.trim() || template.heroSecondaryButton?.trim() || '';
  const primaryHref = hero?.primaryButtonLink?.trim() || '#store-section';
  const secondaryHref = hero?.secondaryButtonLink?.trim() || '#about-section';
  const stats = (hero?.stats ?? []).filter(item => item.enabled && item.label && item.value);
  const trustItems = (hero?.trustItems ?? []).filter(item => item.enabled && item.text);
  const backgroundImage =
    hero?.backgroundType === 'IMAGE' ? hero.backgroundImage || hero.backgroundImageMobile : null;
  const isCentered = hero?.layout === 'CENTERED' || hero?.layout === 'FULLSCREEN';
  const isMinimal = hero?.layout === 'MINIMAL';
  const imageFirst = hero?.layout === 'IMAGE_LEFT';
  const textAlign = getTextAlignment(hero);
  const sectionId = hero?.sectionId?.trim() || 'hero-section';

  return (
    <section
      id={sectionId}
      className={`relative overflow-hidden border-b border-stone-200 bg-stone-50 ${getHeightClass(hero)}`}
      style={getSectionStyle(hero)}
    >
      {backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={title || store.name || ''}
            fill
            className="object-cover"
          />
          {hero?.overlayEnabled ? (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: hero.overlayColor || '#ffffff',
                opacity: Math.max(0, Math.min(hero.overlayOpacity ?? 20, 100)) / 100,
              }}
            />
          ) : null}
        </div>
      ) : null}

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        {isCentered ? (
          <div className="flex min-h-[65vh] items-center justify-center">
            <div className={`flex max-w-3xl flex-col ${textAlign}`}>
              {overline ? (
                <p
                  className="mb-5 text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {overline}
                </p>
              ) : null}

              <h1
                className="text-5xl font-medium tracking-tight text-stone-900 lg:text-7xl"
                style={{ fontFamily: fonts.heading }}
              >
                {title}
              </h1>

              {subtitle ? (
                <p
                  className="mt-5 text-sm font-medium tracking-[0.16em] text-stone-500 uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {subtitle}
                </p>
              ) : null}

              {description ? (
                <p
                  className="mt-6 max-w-2xl text-base leading-8 text-stone-600"
                  style={{ fontFamily: fonts.body }}
                >
                  {description}
                </p>
              ) : null}

              {(primaryText || secondaryText) && hero?.showButtons !== false ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  {primaryText ? (
                    <a
                      href={primaryHref}
                      className="border border-stone-900 px-6 py-3 text-xs font-semibold tracking-[0.16em] text-stone-900 uppercase transition-colors duration-200"
                      style={{
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontFamily: fonts.body,
                      }}
                    >
                      {primaryText}
                    </a>
                  ) : null}
                  {secondaryText ? (
                    <a
                      href={secondaryHref}
                      className="text-xs font-semibold tracking-[0.16em] text-stone-600 uppercase transition-colors duration-200 hover:text-stone-900"
                      style={{ fontFamily: fonts.body }}
                    >
                      {secondaryText}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div
            className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-16 ${imageFirst ? '' : ''}`}
          >
            {!isMinimal && imageFirst && image ? (
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/5] overflow-hidden border border-stone-200 bg-white">
                  <Image
                    src={image}
                    alt={hero?.heroImageAlt || title || store.name || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}

            <div
              className={`${isMinimal ? 'lg:col-span-8' : 'lg:col-span-6'} flex flex-col ${textAlign}`}
            >
              {overline ? (
                <p
                  className="mb-5 text-xs font-semibold tracking-[0.24em] text-stone-500 uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {overline}
                </p>
              ) : null}

              <h1
                className="text-5xl font-medium tracking-tight text-stone-900 lg:text-6xl"
                style={{ fontFamily: fonts.heading }}
              >
                {title}
              </h1>

              {subtitle ? (
                <p
                  className="mt-5 text-sm font-medium tracking-[0.16em] text-stone-500 uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {subtitle}
                </p>
              ) : null}

              {description ? (
                <p
                  className="mt-6 max-w-xl text-base leading-8 text-stone-600"
                  style={{ fontFamily: fonts.body }}
                >
                  {description}
                </p>
              ) : null}

              {(primaryText || secondaryText) && hero?.showButtons !== false ? (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {primaryText ? (
                    <a
                      href={primaryHref}
                      className="border border-stone-900 px-6 py-3 text-xs font-semibold tracking-[0.16em] text-stone-900 uppercase transition-colors duration-200"
                      style={{
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontFamily: fonts.body,
                      }}
                    >
                      {primaryText}
                    </a>
                  ) : null}
                  {secondaryText ? (
                    <a
                      href={secondaryHref}
                      className="text-xs font-semibold tracking-[0.16em] text-stone-600 uppercase transition-colors duration-200 hover:text-stone-900"
                      style={{ fontFamily: fonts.body }}
                    >
                      {secondaryText}
                    </a>
                  ) : null}
                </div>
              ) : null}

              {hero?.showStats && stats.length > 0 ? (
                <div className="mt-10 grid w-full gap-4 border-t border-stone-200 pt-6 sm:grid-cols-3">
                  {stats.map(item => (
                    <div key={item.id} className="text-start">
                      <p
                        className="text-2xl font-semibold text-stone-900"
                        style={{ fontFamily: fonts.heading }}
                      >
                        {item.value}
                      </p>
                      <p
                        className="mt-1 text-xs tracking-[0.16em] text-stone-500 uppercase"
                        style={{ fontFamily: fonts.body }}
                      >
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {hero?.showTrustItems && trustItems.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  {trustItems.map(item => (
                    <span key={item.id} style={{ fontFamily: fonts.body }}>
                      {item.text}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {!isMinimal && !imageFirst && image ? (
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/5] overflow-hidden border border-stone-200 bg-white">
                  <Image
                    src={image}
                    alt={hero?.heroImageAlt || title || store.name || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
