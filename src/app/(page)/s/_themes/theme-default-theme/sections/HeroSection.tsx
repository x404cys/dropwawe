// THEME: default-theme - HeroSection

'use client';

import { ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import type {
  HeroSectionProps,
  StorefrontHeroBadge,
  StorefrontHeroFeature,
  StorefrontHeroStat,
  StorefrontHeroTrustItem,
} from '../../../_lib/types';
import { getIconComponent } from '../../../_utils/icons';

function sortEnabled<T extends { enabled: boolean; order: number }>(items: T[] | undefined) {
  return (items ?? []).filter(item => item.enabled).sort((a, b) => a.order - b.order);
}

function getHeightClass(sectionHeight: string | null | undefined) {
  switch (sectionHeight) {
    case 'screen':
      return 'min-h-screen';
    case 'xl':
      return 'min-h-[90vh]';
    case 'lg':
      return 'min-h-[80vh]';
    case 'md':
      return 'min-h-[65vh]';
    case 'sm':
      return 'min-h-[50vh]';
    default:
      return '';
  }
}

function getPaddingClass(verticalPadding: string | null | undefined) {
  switch (verticalPadding) {
    case 'none':
      return 'py-0';
    case 'sm':
      return 'py-8';
    case 'md':
      return 'py-16';
    case 'lg':
      return 'py-24';
    case 'xl':
      return 'py-32';
    default:
      return 'py-16 sm:py-24';
  }
}

function getContainerClass(containerStyle: string | null | undefined) {
  if (containerStyle === 'full') return 'w-full px-4 sm:px-6';
  return 'mx-auto max-w-5xl px-4 sm:px-6';
}

function getOverlayStyle(hero: HeroSectionProps['template']['heroSection']) {
  if (!hero?.overlayEnabled) return undefined;
  return {
    backgroundColor: hero.overlayColor ?? '#000',
    opacity: (hero.overlayOpacity ?? 0) / 100,
  };
}

function getBackgroundStyle(
  hero: HeroSectionProps['template']['heroSection'],
  colors: HeroSectionProps['colors']
) {
  if (!hero) {
    return { background: `linear-gradient(to bottom, ${colors.primary}0F, transparent)` };
  }

  if (hero.backgroundType === 'COLOR') {
    return { backgroundColor: hero.backgroundColor ?? colors.bg };
  }

  if (hero.backgroundType === 'GRADIENT') {
    return {
      background: `linear-gradient(135deg, ${hero.backgroundGradientFrom ?? colors.primary}, ${hero.backgroundGradientVia ?? hero.backgroundGradientFrom ?? colors.primary}, ${hero.backgroundGradientTo ?? colors.accent})`,
    };
  }

  return { background: `linear-gradient(to bottom, ${colors.primary}0F, transparent)` };
}

function HeroBadges({
  badges,
  colors,
}: {
  badges: StorefrontHeroBadge[];
  colors: HeroSectionProps['colors'];
}) {
  if (badges.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
      {badges.map(badge => (
        <span
          key={badge.id}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold"
          style={{
            backgroundColor: badge.color ? `${badge.color}15` : `${colors.primary}15`,
            borderColor: badge.color ? `${badge.color}30` : `${colors.primary}30`,
            color: badge.color ?? colors.primary,
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
  colors,
}: {
  stats: StorefrontHeroStat[];
  fonts: HeroSectionProps['fonts'];
  colors: HeroSectionProps['colors'];
}) {
  if (stats.length === 0) return null;

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
      {stats.map(stat => (
        <div key={stat.id} className="text-center">
          <p
            className="text-xl font-extrabold sm:text-2xl"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            {stat.value}
          </p>
          <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function HeroTrustItems({
  items,
  colors,
}: {
  items: StorefrontHeroTrustItem[];
  colors: HeroSectionProps['colors'];
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
      {items.map(item => (
        <span
          key={item.id}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 shadow-sm"
        >
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: colors.primary }} />
          {item.text}
        </span>
      ))}
    </div>
  );
}

function HeroFeatures({
  features,
  colors,
  fonts,
}: {
  features: StorefrontHeroFeature[];
  colors: HeroSectionProps['colors'];
  fonts: HeroSectionProps['fonts'];
}) {
  if (features.length === 0) return null;

  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(feature => {
        const Icon = feature.icon ? getIconComponent(feature.icon) : Sparkles;
        const card = (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <Icon className="h-4 w-4" style={{ color: colors.primary }} />
            </div>
            <p className="text-sm font-bold text-gray-900" style={{ fontFamily: fonts.heading }}>
              {feature.title}
            </p>
            {feature.desc ? (
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{feature.desc}</p>
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
            {card}
          </a>
        ) : (
          <div key={feature.id}>{card}</div>
        );
      })}
    </div>
  );
}

function MediaBlock({
  hero,
  colors,
}: {
  hero: NonNullable<HeroSectionProps['template']['heroSection']>;
  colors: HeroSectionProps['colors'];
}) {
  const mediaClass = `${hero.roundedMedia ? 'rounded-3xl' : 'rounded-2xl'} overflow-hidden border bg-white shadow-lg ${hero.borderMedia ? 'border-white/50' : 'border-gray-200'}`;
  const mediaStyle = hero.shadowMedia
    ? { boxShadow: `0 20px 45px -15px ${colors.primary}35` }
    : undefined;

  if (hero.heroVideo) {
    return (
      <div className={mediaClass} style={mediaStyle}>
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
      <div className={mediaClass} style={mediaStyle}>
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
  colors,
  fonts,
}: HeroSectionProps) {
  const hero = template.heroSection;

  if (hero && (!hero.enabled || hero.visible === false)) return null;

  const sectionId = hero?.sectionId?.trim() || 'hero-section';
  const layout = hero?.layout || 'CENTERED';
  const title = hero?.title?.trim() || template.tagline?.trim() || store.name?.trim() || '';
  const description =
    hero?.description?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const subtitle = hero?.subtitle?.trim() || '';
  const overline = hero?.overline?.trim() || '';
  const primaryText =
    hero?.primaryButtonText?.trim() || template.heroButtonText?.trim() || 'تسوق الآن';
  const secondaryText =
    hero?.secondaryButtonText?.trim() || template.heroSecondaryButton?.trim() || 'شاهد الأعمال';
  const tertiaryText = hero?.tertiaryButtonText?.trim() || '';
  const primaryHref = hero?.primaryButtonLink?.trim() || '#store-section';
  const secondaryHref = hero?.secondaryButtonLink?.trim() || '#works-section';
  const tertiaryHref = hero?.tertiaryButtonLink?.trim() || '#about-section';
  const badges = hero?.showBadge ? sortEnabled(hero.badges) : [];
  const stats = hero?.showStats ? sortEnabled(hero.stats) : [];
  const features = hero?.showFeatures ? sortEnabled(hero.features) : [];
  const trustItems = hero?.showTrustItems ? sortEnabled(hero.trustItems) : [];
  const overlayStyle = getOverlayStyle(hero);
  const mediaBlock = hero ? <MediaBlock hero={hero} colors={colors} /> : null;
  const fallbackBadge = hero?.badgeText?.trim();
  const heightClass = getHeightClass(hero?.sectionHeight);
  const paddingClass = getPaddingClass(hero?.verticalPadding);
  const containerClass = getContainerClass(hero?.containerStyle);
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
      className={`relative overflow-hidden bg-white ${heightClass}`}
      style={getBackgroundStyle(hero, colors)}
    >
      {/* DESIGN: The ambient blobs and centered rhythm reproduce the original storefront hero while still supporting typed media/background fields. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute end-10 top-20 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.primary}0A` }}
        />
        <div
          className="absolute start-10 bottom-10 h-56 w-56 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.accent}0A` }}
        />
      </div>

      {hero?.backgroundType === 'IMAGE' && (hero.backgroundImage || hero.backgroundImageMobile) ? (
        <div className={`absolute inset-0 ${hero.blurBackground ? 'scale-[1.03] blur-sm' : ''}`}>
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

      {overlayStyle ? <div className="absolute inset-0" style={overlayStyle} /> : null}

      <div className={`relative ${containerClass} ${paddingClass}`}>
        {layout === 'FULLSCREEN' ? (
          <div className="flex min-h-[70vh] items-end pb-16 sm:min-h-[80vh]">
            <div className="max-w-2xl rounded-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
              <HeroBadges badges={badgeItems} colors={colors} />
              {overline ? (
                <p className="mb-4 text-xs font-semibold text-gray-500">{overline}</p>
              ) : null}
              <h1
                className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl"
                style={{ fontFamily: fonts.heading }}
              >
                {title}
              </h1>
              {description ? (
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-gray-600">{description}</p>
              ) : null}
            </div>
          </div>
        ) : layout === 'SPLIT' || layout === 'IMAGE_RIGHT' || layout === 'IMAGE_LEFT' ? (
          <div
            className={`grid items-center gap-10 lg:grid-cols-2 ${layout === 'IMAGE_LEFT' ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
          >
            <div className="max-w-xl">
              <HeroBadges badges={badgeItems} colors={colors} />
              {overline ? (
                <p className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  {overline}
                </p>
              ) : null}
              <h1
                className="text-3xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl"
                style={{ fontFamily: fonts.heading }}
              >
                {title}
                {hero?.highlightText ? (
                  <span style={{ color: colors.primary }}> {hero.highlightText}</span>
                ) : null}
              </h1>
              {subtitle ? (
                <p className="mt-3 text-sm font-medium text-gray-500">{subtitle}</p>
              ) : null}
              {description ? (
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
                  {description}
                </p>
              ) : null}
              {hero?.promoText ? (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  <span>{hero.promoText}</span>
                  {hero.promoEndsAt ? <span>{hero.promoEndsAt}</span> : null}
                </div>
              ) : null}
              {hero?.showButtons !== false ? (
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <a
                    href={primaryHref}
                    target={hero?.primaryButtonTarget === '_blank' ? '_blank' : undefined}
                    rel={hero?.primaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 ease-in-out hover:opacity-95"
                    style={{
                      backgroundColor: colors.primary,
                      boxShadow: `0 10px 25px -5px ${colors.primary}40`,
                      fontFamily: fonts.heading,
                    }}
                  >
                    {primaryText}
                  </a>
                  {secondaryText ? (
                    <a
                      href={secondaryHref}
                      target={hero?.secondaryButtonTarget === '_blank' ? '_blank' : undefined}
                      rel={
                        hero?.secondaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined
                      }
                      className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-50"
                      style={{ fontFamily: fonts.heading }}
                    >
                      {secondaryText}
                    </a>
                  ) : null}
                  {tertiaryText ? (
                    <a
                      href={tertiaryHref}
                      target={hero?.tertiaryButtonTarget === '_blank' ? '_blank' : undefined}
                      rel={
                        hero?.tertiaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined
                      }
                      className="inline-flex items-center justify-center rounded-2xl border border-transparent px-6 py-3 text-sm font-semibold text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-900"
                    >
                      {tertiaryText}
                    </a>
                  ) : null}
                </div>
              ) : null}
              {hero?.urgencyText ? (
                <p className="mt-2 text-xs text-red-500">{hero.urgencyText}</p>
              ) : null}
              <HeroStats stats={stats} fonts={fonts} colors={colors} />
              <HeroTrustItems items={trustItems} colors={colors} />
            </div>

            <div>
              {mediaBlock ?? (
                <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/70 p-10 text-gray-400 shadow-sm">
                  <Sparkles className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            <HeroBadges badges={badgeItems} colors={colors} />
            {overline ? (
              <p className="mb-4 text-xs font-semibold text-gray-500">{overline}</p>
            ) : null}
            <h1
              className="text-3xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl"
              style={{ fontFamily: fonts.heading }}
            >
              {title}
              {hero?.highlightText ? (
                <span style={{ color: colors.primary }}> {hero.highlightText}</span>
              ) : null}
            </h1>
            {subtitle ? <p className="mt-3 text-sm font-medium text-gray-500">{subtitle}</p> : null}
            {description ? (
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                {description}
              </p>
            ) : null}
            {hero?.promoText ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <span>{hero.promoText}</span>
                {hero.promoEndsAt ? <span>{hero.promoEndsAt}</span> : null}
              </div>
            ) : null}
            {hero?.showButtons !== false ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={primaryHref}
                  target={hero?.primaryButtonTarget === '_blank' ? '_blank' : undefined}
                  rel={hero?.primaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                  className="inline-flex w-full items-center justify-center rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 ease-in-out hover:opacity-95 sm:w-auto"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 10px 25px -5px ${colors.primary}40`,
                    fontFamily: fonts.heading,
                  }}
                >
                  {primaryText}
                </a>
                {secondaryText ? (
                  <a
                    href={secondaryHref}
                    target={hero?.secondaryButtonTarget === '_blank' ? '_blank' : undefined}
                    rel={
                      hero?.secondaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined
                    }
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-50 sm:w-auto"
                    style={{ fontFamily: fonts.heading }}
                  >
                    {secondaryText}
                  </a>
                ) : null}
                {tertiaryText ? (
                  <a
                    href={tertiaryHref}
                    target={hero?.tertiaryButtonTarget === '_blank' ? '_blank' : undefined}
                    rel={
                      hero?.tertiaryButtonTarget === '_blank' ? 'noopener noreferrer' : undefined
                    }
                    className="inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-900"
                  >
                    {tertiaryText}
                  </a>
                ) : null}
              </div>
            ) : null}
            {hero?.urgencyText ? (
              <p className="mt-2 text-xs text-red-500">{hero.urgencyText}</p>
            ) : null}
            <HeroStats stats={stats} fonts={fonts} colors={colors} />
            <HeroTrustItems items={trustItems} colors={colors} />
            <HeroFeatures features={features} colors={colors} fonts={fonts} />
            {mediaBlock ? <div className="mt-10">{mediaBlock}</div> : null}
          </div>
        )}
      </div>

      {hero?.showScrollHint ? (
        <div className="absolute start-1/2 bottom-6 flex -translate-x-1/2 flex-col items-center gap-1 opacity-40">
          <ChevronDown className="h-4 w-4 animate-bounce text-gray-500" />
        </div>
      ) : null}
    </section>
  );
}
