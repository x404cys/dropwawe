// THEME: modern-structured — HeroSection

'use client';

import Image from 'next/image';
import type { HeroSectionProps, StorefrontHeroSection } from '../../../_lib/types';

function getHeroHeightClass(hero: StorefrontHeroSection | null) {
  switch (hero?.sectionHeight) {
    case 'screen':
      return 'min-h-[85vh]';
    case 'xl':
      return 'min-h-[80vh]';
    case 'lg':
      return 'min-h-[72vh]';
    case 'md':
      return 'min-h-[64vh]';
    case 'sm':
      return 'min-h-[56vh]';
    default:
      return 'min-h-[85vh]';
  }
}

export default function ModernStructuredHeroSection({
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
  const highlightText = hero?.highlightText?.trim() || '';
  const description =
    hero?.description?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const label = hero?.overline?.trim() || template.tagline?.trim() || '';
  const subtitle = hero?.subtitle?.trim() || '';
  const primaryText = hero?.primaryButtonText?.trim() || template.heroButtonText?.trim() || '';
  const secondaryText =
    hero?.secondaryButtonText?.trim() || template.heroSecondaryButton?.trim() || '';
  const primaryHref = hero?.primaryButtonLink?.trim() || '#store-section';
  const secondaryHref = hero?.secondaryButtonLink?.trim() || '#about-section';
  const image = hero?.heroImage || hero?.heroImageMobile || hero?.backgroundImage || null;
  const stats = (hero?.stats ?? []).filter(item => item.enabled && item.label && item.value);
  const layout = hero?.layout || 'SPLIT';

  if (layout === 'FULLSCREEN') {
    return (
      <section
        id={hero?.sectionId?.trim() || 'hero-section'}
        className={`relative overflow-hidden ${getHeroHeightClass(hero)}`}
      >
        {image ? (
          <Image
            src={image}
            alt={hero?.heroImageAlt || title || store.name || ''}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: colors.primary }} />
        )}
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-16 lg:px-8">
          <div className="max-w-2xl">
            {label ? (
              <p
                className="mb-4 text-xs font-medium tracking-widest text-white/80 uppercase"
                style={{ color: colors.accent, fontFamily: fonts.body }}
              >
                {label}
              </p>
            ) : null}
            <h1
              className="text-5xl leading-[1.1] font-semibold tracking-tight text-white lg:text-6xl"
              style={{ fontFamily: fonts.heading }}
            >
              {title}{' '}
              {highlightText ? <span style={{ color: colors.accent }}>{highlightText}</span> : null}
            </h1>
            {description ? (
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80">{description}</p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'CENTERED') {
    return (
      <section
        id={hero?.sectionId?.trim() || 'hero-section'}
        className="border-b border-gray-200 bg-[#fafafa]"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {label ? (
              <p
                className="mb-4 text-xs font-medium tracking-widest uppercase"
                style={{ color: colors.accent, fontFamily: fonts.body }}
              >
                {label}
              </p>
            ) : null}
            <h1
              className="text-5xl font-semibold tracking-tight text-slate-900 lg:text-6xl"
              style={{ fontFamily: fonts.heading }}
            >
              {title}{' '}
              {highlightText ? <span style={{ color: colors.accent }}>{highlightText}</span> : null}
            </h1>
            {description ? (
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500">
                {description}
              </p>
            ) : null}
            {(primaryText || secondaryText) && hero?.showButtons !== false ? (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {primaryText ? (
                  <a
                    href={primaryHref}
                    className="rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all duration-150 ease-in-out hover:opacity-90"
                    style={{ backgroundColor: colors.accent, fontFamily: fonts.heading }}
                  >
                    {primaryText}
                  </a>
                ) : null}
                {secondaryText ? (
                  <a
                    href={secondaryHref}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-all duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-50"
                    style={{ fontFamily: fonts.heading }}
                  >
                    {secondaryText}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {image ? (
            <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <div className="relative aspect-[16/7]">
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
      </section>
    );
  }

  return (
    <section
      id={hero?.sectionId?.trim() || 'hero-section'}
      className="border-b border-gray-200 bg-[#fafafa]"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
        {/* DESIGN: The split hero keeps hierarchy explicit with a fixed two-column grid and a single bordered media surface. */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            {label ? (
              <p
                className="mb-4 text-xs font-medium tracking-widest uppercase"
                style={{ color: colors.accent, fontFamily: fonts.body }}
              >
                {label}
              </p>
            ) : null}
            <h1
              className="text-5xl leading-[1.1] font-semibold tracking-tight text-slate-900 lg:text-6xl"
              style={{ fontFamily: fonts.heading }}
            >
              {title}{' '}
              {highlightText ? <span style={{ color: colors.accent }}>{highlightText}</span> : null}
            </h1>
            {subtitle ? <p className="mt-3 text-sm text-slate-400">{subtitle}</p> : null}
            {description ? (
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
                {description}
              </p>
            ) : null}

            {(primaryText || secondaryText) && hero?.showButtons !== false ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryText ? (
                  <a
                    href={primaryHref}
                    className="rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all duration-150 ease-in-out hover:opacity-90"
                    style={{ backgroundColor: colors.accent, fontFamily: fonts.heading }}
                  >
                    {primaryText}
                  </a>
                ) : null}
                {secondaryText ? (
                  <a
                    href={secondaryHref}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-all duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-50"
                    style={{ fontFamily: fonts.heading }}
                  >
                    {secondaryText}
                  </a>
                ) : null}
              </div>
            ) : null}

            {hero?.showStats && stats.length > 0 ? (
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-200 pt-8">
                {stats.map(stat => (
                  <div key={stat.id}>
                    <p
                      className="text-2xl font-semibold text-slate-900"
                      style={{ fontFamily: fonts.heading }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="mt-1 text-xs tracking-wide text-slate-400 uppercase"
                      style={{ fontFamily: fonts.body }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            <div className="relative aspect-[4/3]">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
