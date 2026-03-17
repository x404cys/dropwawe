'use client';

import { ChevronDown, Sparkles } from 'lucide-react';

import type {
  HeroSectionProps,
  StorefrontHeroBadge,
  StorefrontHeroFeature,
  StorefrontHeroStat,
  StorefrontHeroTrustItem,
} from '../../../_lib/types';
import { getIconComponent } from '../../../_utils/icons';
import {
  storefrontContainerClass,
  storefrontSectionClass,
  storefrontTitleClass,
} from '../themeSystem';

function sortEnabled<T extends { enabled: boolean; order: number }>(items: T[] | undefined) {
  return (items ?? []).filter(item => item.enabled).sort((a, b) => a.order - b.order);
}

function getMinHeight(sectionHeight: string | null | undefined) {
  switch (sectionHeight) {
    case 'screen':
      return 'min-h-screen';
    case 'xl':
      return 'min-h-[85vh]';
    case 'lg':
      return 'min-h-[72vh]';
    case 'md':
      return 'min-h-[60vh]';
    case 'sm':
      return 'min-h-[48vh]';
    default:
      return '';
  }
}

function getSectionStyle(hero: HeroSectionProps['template']['heroSection']) {
  if (!hero) {
    return { backgroundColor: 'var(--store-bg)' };
  }

  if (hero.backgroundType === 'COLOR') {
    return { backgroundColor: hero.backgroundColor ?? 'var(--store-bg)' };
  }

  if (hero.backgroundType === 'GRADIENT') {
    return {
      background: `linear-gradient(135deg, ${hero.backgroundGradientFrom ?? 'var(--store-bg)'}, ${hero.backgroundGradientVia ?? hero.backgroundGradientFrom ?? 'var(--store-surface)'}, ${hero.backgroundGradientTo ?? 'var(--store-surface)'})`,
    };
  }

  return { backgroundColor: 'var(--store-bg)' };
}

function getOverlayStyle(hero: HeroSectionProps['template']['heroSection']) {
  if (!hero?.overlayEnabled) {
    return {
      background: 'linear-gradient(90deg, rgba(0,0,0,0.45), rgba(0,0,0,0.14) 56%, rgba(0,0,0,0.08))',
    };
  }

  return {
    backgroundColor: hero.overlayColor ?? '#000',
    opacity: Math.min(Math.max((hero.overlayOpacity ?? 0) / 100, 0), 1),
  };
}

function HeroBadges({
  badges,
  isInverted,
}: {
  badges: StorefrontHeroBadge[];
  isInverted: boolean;
}) {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(badge => (
        <span
          key={badge.id}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.02em]"
          style={{
            backgroundColor: isInverted ? 'rgba(255,255,255,0.14)' : 'var(--store-primary-faint)',
            color: isInverted ? '#fff' : 'var(--store-primary)',
            border: isInverted ? '1px solid rgba(255,255,255,0.18)' : '1px solid var(--store-border)',
          }}
        >
          <Sparkles className="h-3 w-3" />
          {badge.text}
        </span>
      ))}
    </div>
  );
}

function HeroStats({
  stats,
  fonts,
  isInverted,
}: {
  stats: StorefrontHeroStat[];
  fonts: HeroSectionProps['fonts'];
  isInverted: boolean;
}) {
  if (stats.length === 0) return null;

  return (
    <div
      className="grid gap-5 border-t pt-6 sm:grid-cols-3"
      style={{ borderColor: isInverted ? 'rgba(255,255,255,0.18)' : 'var(--store-border)' }}
    >
      {stats.map(stat => (
        <div key={stat.id} className="space-y-1">
          <p
            className="text-2xl font-bold tracking-[-0.03em]"
            style={{ fontFamily: fonts.heading, color: isInverted ? '#fff' : 'var(--store-text)' }}
          >
            {stat.value}
          </p>
          <p
            className="text-sm"
            style={{ color: isInverted ? 'rgba(255,255,255,0.74)' : 'var(--store-text-muted)' }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function HeroTrustItems({
  items,
  isInverted,
}: {
  items: StorefrontHeroTrustItem[];
  isInverted: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {items.map(item => (
        <span
          key={item.id}
          className="inline-flex items-center gap-2"
          style={{ color: isInverted ? 'rgba(255,255,255,0.74)' : 'var(--store-text-muted)' }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: isInverted ? '#fff' : 'var(--store-primary)' }}
          />
          {item.text}
        </span>
      ))}
    </div>
  );
}

function HeroFeatures({
  features,
  fonts,
  isInverted,
}: {
  features: StorefrontHeroFeature[];
  fonts: HeroSectionProps['fonts'];
  isInverted: boolean;
}) {
  if (features.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {features.map(feature => {
        const Icon = feature.icon ? getIconComponent(feature.icon) : Sparkles;
        const content = (
          <div
            className="h-full rounded-xl border p-5"
            style={{
              backgroundColor: isInverted ? 'rgba(255,255,255,0.08)' : 'var(--store-surface)',
              borderColor: isInverted ? 'rgba(255,255,255,0.14)' : 'var(--store-border)',
            }}
          >
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: isInverted ? 'rgba(255,255,255,0.12)' : 'var(--store-primary-faint)',
                color: isInverted ? '#fff' : 'var(--store-primary)',
              }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <h3
              className="text-base font-bold tracking-[-0.02em]"
              style={{ fontFamily: fonts.heading, color: isInverted ? '#fff' : 'var(--store-text)' }}
            >
              {feature.title}
            </h3>
            {feature.desc ? (
              <p
                className="mt-2 text-sm leading-7"
                style={{
                  color: isInverted ? 'rgba(255,255,255,0.72)' : 'var(--store-text-muted)',
                }}
              >
                {feature.desc}
              </p>
            ) : null}
          </div>
        );

        return feature.link ? (
          <a
            key={feature.id}
            href={feature.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {content}
          </a>
        ) : (
          <div key={feature.id}>{content}</div>
        );
      })}
    </div>
  );
}

function MediaBlock({ hero }: { hero: NonNullable<HeroSectionProps['template']['heroSection']> }) {
  if (hero.heroVideo) {
    return (
      <div
        className="overflow-hidden rounded-xl"
        style={{ boxShadow: 'var(--store-shadow-lg)' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={hero.heroVideoPoster ?? undefined}
          className="h-full w-full object-cover"
        >
          <source src={hero.heroVideo} />
        </video>
      </div>
    );
  }

  if (hero.heroImage) {
    return (
      <div
        className="overflow-hidden rounded-xl"
        style={{ boxShadow: 'var(--store-shadow-lg)' }}
      >
        <picture>
          {hero.heroImageMobile ? (
            <source media="(max-width: 768px)" srcSet={hero.heroImageMobile} />
          ) : null}
          <img
            src={hero.heroImage}
            alt={hero.heroImageAlt ?? ''}
            className="h-full w-full object-cover"
          />
        </picture>
      </div>
    );
  }

  return null;
}

export default function DefaultThemeHeroSection({
  store,
  template,
  fonts,
}: HeroSectionProps) {
  const hero = template.heroSection;

  if (hero && (!hero.enabled || hero.visible === false)) return null;

  const sectionId = hero?.sectionId?.trim() || 'hero-section';
  const title = hero?.title?.trim() || template.tagline?.trim() || store.name?.trim() || '';
  const description =
    hero?.description?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const subtitle = hero?.subtitle?.trim() || '';
  const overline = hero?.overline?.trim() || '';
  const primaryText = hero?.primaryButtonText?.trim() || template.heroButtonText?.trim() || 'تسوق الآن';
  const secondaryText =
    hero?.secondaryButtonText?.trim() || template.heroSecondaryButton?.trim() || 'استكشف المزيد';
  const tertiaryText = hero?.tertiaryButtonText?.trim() || '';
  const primaryHref = hero?.primaryButtonLink?.trim() || '#store-section';
  const secondaryHref = hero?.secondaryButtonLink?.trim() || '#about-section';
  const tertiaryHref = hero?.tertiaryButtonLink?.trim() || '#testimonials-section';
  const badges = hero?.showBadge ? sortEnabled(hero.badges) : [];
  const stats = hero?.showStats ? sortEnabled(hero.stats) : [];
  const features = hero?.showFeatures ? sortEnabled(hero.features) : [];
  const trustItems = hero?.showTrustItems ? sortEnabled(hero.trustItems) : [];
  const layout = hero?.layout || 'CENTERED';
  const media = hero ? <MediaBlock hero={hero} /> : null;
  const isSplitLayout =
    media && (layout === 'SPLIT' || layout === 'IMAGE_RIGHT' || layout === 'IMAGE_LEFT');
  const mediaFirst = layout === 'IMAGE_LEFT';
  const minHeightClass = getMinHeight(hero?.sectionHeight);
  const hasBackgroundMedia =
    hero?.backgroundType === 'IMAGE' || hero?.backgroundType === 'VIDEO';
  const isInverted = hasBackgroundMedia || layout === 'FULLSCREEN';
  const fallbackBadge = hero?.badgeText?.trim();
  const badgeItems =
    badges.length > 0
      ? badges
      : fallbackBadge
        ? [
            {
              id: 'fallback-badge',
              text: fallbackBadge,
              enabled: true,
              order: 0,
              color: null,
              icon: null,
            },
          ]
        : [];

  return (
    <section
      id={sectionId}
      className={`relative isolate overflow-hidden ${minHeightClass} ${storefrontSectionClass}`}
      style={getSectionStyle(hero)}
    >
      {hero?.backgroundType === 'IMAGE' && (hero.backgroundImage || hero.backgroundImageMobile) ? (
        <div className="absolute inset-0">
          <picture>
            {hero.backgroundImageMobile ? (
              <source media="(max-width: 768px)" srcSet={hero.backgroundImageMobile} />
            ) : null}
            <img
              src={hero.backgroundImage || hero.backgroundImageMobile || ''}
              alt={hero.heroImageAlt ?? ''}
              className="h-full w-full object-cover"
            />
          </picture>
        </div>
      ) : null}

      {hero?.backgroundType === 'VIDEO' && hero.backgroundVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={hero.heroVideoPoster ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={hero.backgroundVideo} />
        </video>
      ) : null}

      {hasBackgroundMedia ? <div className="absolute inset-0" style={getOverlayStyle(hero)} /> : null}

      <div className={`relative ${storefrontContainerClass}`}>
        {layout === 'FULLSCREEN' ? (
          <div className="flex min-h-[60vh] items-end py-12 sm:min-h-[72vh] sm:py-16">
            <div className="max-w-2xl space-y-6">
              <HeroBadges badges={badgeItems} isInverted={true} />
              {overline ? (
                <p className="text-sm font-medium tracking-[0.12em] uppercase text-white/70">
                  {overline}
                </p>
              ) : null}
              <div className="space-y-4">
                <h1 className={storefrontTitleClass} style={{ fontFamily: fonts.heading, color: '#fff' }}>
                  {title}
                  {hero?.highlightText ? <span style={{ color: 'var(--store-primary)' }}> {hero.highlightText}</span> : null}
                </h1>
                {description ? (
                  <p className="max-w-xl text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : isSplitLayout ? (
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <div className={mediaFirst ? 'lg:order-2' : ''}>
              <div className="space-y-6">
                <HeroBadges badges={badgeItems} isInverted={isInverted} />
                {overline ? (
                  <p
                    className="text-sm font-medium tracking-[0.12em] uppercase"
                    style={{ color: isInverted ? 'rgba(255,255,255,0.7)' : 'var(--store-text-faint)' }}
                  >
                    {overline}
                  </p>
                ) : null}
                <div className="space-y-4">
                  <h1
                    className={storefrontTitleClass}
                    style={{ fontFamily: fonts.heading, color: isInverted ? '#fff' : 'var(--store-text)' }}
                  >
                    {title}
                    {hero?.highlightText ? (
                      <span style={{ color: 'var(--store-primary)' }}> {hero.highlightText}</span>
                    ) : null}
                  </h1>
                  {subtitle ? (
                    <p
                      className="text-base font-medium"
                      style={{ color: isInverted ? 'rgba(255,255,255,0.82)' : 'var(--store-text-soft)' }}
                    >
                      {subtitle}
                    </p>
                  ) : null}
                  {description ? (
                    <p
                      className="max-w-xl text-sm leading-7 sm:text-base sm:leading-8"
                      style={{ color: isInverted ? 'rgba(255,255,255,0.74)' : 'var(--store-text-muted)' }}
                    >
                      {description}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={primaryHref}
                    target={hero?.primaryButtonTarget === '_blank' ? '_blank' : undefined}
                    rel={hero?.primaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                    className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-opacity duration-200 hover:opacity-90"
                    style={{
                      backgroundColor: isInverted ? '#fff' : 'var(--store-text)',
                      color: isInverted ? 'var(--store-text)' : 'var(--store-bg)',
                    }}
                  >
                    {primaryText}
                  </a>

                  {secondaryText ? (
                    <a
                      href={secondaryHref}
                      target={hero?.secondaryButtonTarget === '_blank' ? '_blank' : undefined}
                      rel={hero?.secondaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                      className="inline-flex h-12 items-center justify-center rounded-xl border px-6 text-sm font-semibold transition-colors duration-200"
                      style={{
                        borderColor: isInverted ? 'rgba(255,255,255,0.2)' : 'var(--store-border)',
                        color: isInverted ? '#fff' : 'var(--store-text)',
                        backgroundColor: isInverted ? 'rgba(255,255,255,0.08)' : 'transparent',
                      }}
                    >
                      {secondaryText}
                    </a>
                  ) : null}

                  {tertiaryText ? (
                    <a
                      href={tertiaryHref}
                      target={hero?.tertiaryButtonTarget === '_blank' ? '_blank' : undefined}
                      rel={hero?.tertiaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                      className="inline-flex h-12 items-center justify-center px-2 text-sm font-medium"
                      style={{ color: isInverted ? 'rgba(255,255,255,0.72)' : 'var(--store-text-muted)' }}
                    >
                      {tertiaryText}
                    </a>
                  ) : null}
                </div>

                <HeroTrustItems items={trustItems} isInverted={isInverted} />
                <HeroStats stats={stats} fonts={fonts} isInverted={isInverted} />
              </div>
            </div>

            <div className={mediaFirst ? 'lg:order-1' : ''}>
              {media}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <HeroBadges badges={badgeItems} isInverted={isInverted} />
            {overline ? (
              <p
                className="text-sm font-medium tracking-[0.12em] uppercase"
                style={{ color: isInverted ? 'rgba(255,255,255,0.7)' : 'var(--store-text-faint)' }}
              >
                {overline}
              </p>
            ) : null}

            <div className="space-y-4">
              <h1
                className={storefrontTitleClass}
                style={{ fontFamily: fonts.heading, color: isInverted ? '#fff' : 'var(--store-text)' }}
              >
                {title}
                {hero?.highlightText ? (
                  <span style={{ color: 'var(--store-primary)' }}> {hero.highlightText}</span>
                ) : null}
              </h1>
              {subtitle ? (
                <p
                  className="text-base font-medium"
                  style={{ color: isInverted ? 'rgba(255,255,255,0.82)' : 'var(--store-text-soft)' }}
                >
                  {subtitle}
                </p>
              ) : null}
              {description ? (
                <p
                  className="mx-auto max-w-2xl text-sm leading-7 sm:text-base sm:leading-8"
                  style={{ color: isInverted ? 'rgba(255,255,255,0.74)' : 'var(--store-text-muted)' }}
                >
                  {description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={primaryHref}
                target={hero?.primaryButtonTarget === '_blank' ? '_blank' : undefined}
                rel={hero?.primaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-opacity duration-200 hover:opacity-90"
                style={{
                  backgroundColor: isInverted ? '#fff' : 'var(--store-text)',
                  color: isInverted ? 'var(--store-text)' : 'var(--store-bg)',
                }}
              >
                {primaryText}
              </a>

              {secondaryText ? (
                <a
                  href={secondaryHref}
                  target={hero?.secondaryButtonTarget === '_blank' ? '_blank' : undefined}
                  rel={hero?.secondaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                  className="inline-flex h-12 items-center justify-center rounded-xl border px-6 text-sm font-semibold"
                  style={{
                    borderColor: isInverted ? 'rgba(255,255,255,0.2)' : 'var(--store-border)',
                    color: isInverted ? '#fff' : 'var(--store-text)',
                    backgroundColor: isInverted ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  {secondaryText}
                </a>
              ) : null}
            </div>

            <HeroTrustItems items={trustItems} isInverted={isInverted} />
            <HeroStats stats={stats} fonts={fonts} isInverted={isInverted} />
            {features.length > 0 ? <HeroFeatures features={features} fonts={fonts} isInverted={isInverted} /> : null}
            {media ? <div>{media}</div> : null}
          </div>
        )}
      </div>

      {hero?.showScrollHint ? (
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
            style={{
              borderColor: isInverted ? 'rgba(255,255,255,0.18)' : 'var(--store-border)',
              color: isInverted ? 'rgba(255,255,255,0.72)' : 'var(--store-text-faint)',
              backgroundColor: isInverted ? 'rgba(255,255,255,0.08)' : 'var(--store-surface)',
            }}
          >
            <span>اكتشف المزيد</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
