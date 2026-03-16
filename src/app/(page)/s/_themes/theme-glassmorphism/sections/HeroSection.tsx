// THEME: glassmorphism — HeroSection

'use client';

import { ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import type {
  HeroSectionProps,
  StorefrontHeroBadge,
  StorefrontHeroFeature,
  StorefrontHeroStat,
  StorefrontHeroTrustItem,
} from '../../../_lib/types';
import { getCategoryIcon, getIconComponent } from '../../../_utils/icons';

function sortEnabled<T extends { enabled: boolean; order: number }>(items: T[] | undefined) {
  return (items ?? []).filter(item => item.enabled).sort((a, b) => a.order - b.order);
}

function getSectionHeight(sectionHeight: string | null | undefined) {
  switch (sectionHeight) {
    case 'sm':
      return 'min-h-[50vh]';
    case 'md':
      return 'min-h-[65vh]';
    case 'lg':
      return 'min-h-[80vh]';
    case 'xl':
      return 'min-h-[90vh]';
    case 'screen':
      return 'min-h-screen';
    default:
      return '';
  }
}

function getVerticalPadding(verticalPadding: string | null | undefined) {
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
      return 'py-16 lg:py-24';
  }
}

function getContainerClass(containerStyle: string | null | undefined) {
  if (containerStyle === 'full') return 'w-full px-0';
  return 'mx-auto max-w-6xl px-6 lg:px-8';
}

function getContentAlignment(contentAlign: string | null | undefined) {
  switch (contentAlign) {
    case 'center':
      return 'items-center text-center';
    case 'right':
      return 'items-end text-right';
    default:
      return 'items-start text-left';
  }
}

function getSectionBackground(
  colors: HeroSectionProps['colors'],
  hero: HeroSectionProps['template']['heroSection']
): CSSProperties {
  const ambient = `radial-gradient(ellipse at top, ${colors.primary}15 0%, transparent 60%), radial-gradient(ellipse at bottom right, ${colors.accent}10 0%, transparent 50%), ${colors.bg}`;

  if (!hero) {
    return { background: ambient };
  }

  if (hero.backgroundType === 'COLOR') {
    return { backgroundColor: hero.backgroundColor ?? colors.bg };
  }

  if (hero.backgroundType === 'GRADIENT') {
    return {
      background: `linear-gradient(135deg, ${hero.backgroundGradientFrom ?? colors.bg}, ${hero.backgroundGradientVia ?? hero.backgroundGradientFrom ?? colors.bg}, ${hero.backgroundGradientTo ?? colors.bg})`,
    };
  }

  return { background: ambient };
}

function MediaAsset({
  heroImage,
  heroImageMobile,
  heroImageAlt,
  heroVideo,
  roundedMedia,
  shadowMedia,
  borderMedia,
  colors,
}: {
  heroImage: string | null | undefined;
  heroImageMobile: string | null | undefined;
  heroImageAlt: string | null | undefined;
  heroVideo: string | null | undefined;
  roundedMedia: boolean;
  shadowMedia: boolean;
  borderMedia: boolean;
  colors: HeroSectionProps['colors'];
}) {
  const mediaClass = `${roundedMedia ? 'rounded-2xl' : 'rounded-none'} ${borderMedia ? 'border border-white/20' : ''} overflow-hidden bg-white/[0.04]`;
  const mediaStyle = shadowMedia ? { boxShadow: `0 0 60px ${colors.accent}25` } : undefined;

  if (heroVideo) {
    return (
      <div className={mediaClass} style={mediaStyle}>
        <video autoPlay muted loop playsInline className="h-full w-full object-cover">
          <source src={heroVideo} />
        </video>
      </div>
    );
  }

  if (heroImage) {
    return (
      <div className={mediaClass} style={mediaStyle}>
        <picture>
          {heroImageMobile ? <source media="(max-width: 768px)" srcSet={heroImageMobile} /> : null}
          <img src={heroImage} alt={heroImageAlt ?? ''} className="h-full w-full object-cover" />
        </picture>
      </div>
    );
  }

  return (
    <div
      className={`${mediaClass} flex aspect-[4/3] items-center justify-center`}
      style={mediaStyle}
    >
      <div className="text-white/35">{heroImageAlt ?? 'Storefront'}</div>
    </div>
  );
}

function HeroBadges({
  badges,
  colors,
  fonts,
}: {
  badges: StorefrontHeroBadge[];
  colors: HeroSectionProps['colors'];
  fonts: HeroSectionProps['fonts'];
}) {
  if (badges.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {badges.map(badge => {
        const Icon = badge.icon ? getCategoryIcon(badge.icon) : Sparkles;
        return (
          <span
            key={badge.id}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/70 backdrop-blur-sm"
            style={
              badge.color
                ? { borderColor: `${badge.color}40`, fontFamily: fonts.body }
                : { fontFamily: fonts.body }
            }
          >
            <Icon
              className="h-3.5 w-3.5"
              style={badge.color ? { color: badge.color } : { color: colors.accent }}
            />
            {badge.text}
          </span>
        );
      })}
    </div>
  );
}

function HeroStats({
  stats,
  fonts,
}: {
  stats: StorefrontHeroStat[];
  fonts: HeroSectionProps['fonts'];
}) {
  if (stats.length === 0) return null;

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      {stats.map(stat => (
        <div
          key={stat.id}
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl"
        >
          <p className="text-2xl font-thin text-white/90" style={{ fontFamily: fonts.heading }}>
            {stat.value}
          </p>
          <p
            className="mt-1 text-xs tracking-wide text-white/40 uppercase"
            style={{ fontFamily: fonts.body }}
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
  colors,
  fonts,
}: {
  items: StorefrontHeroTrustItem[];
  colors: HeroSectionProps['colors'];
  fonts: HeroSectionProps['fonts'];
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-6">
      {items.map(item => {
        const Icon = item.icon ? getIconComponent(item.icon) : ShieldCheck;
        return (
          <span
            key={item.id}
            className="inline-flex items-center gap-2 text-xs text-white/50"
            style={{ fontFamily: fonts.body }}
          >
            <Icon className="h-4 w-4" style={{ color: colors.accent }} />
            {item.text}
          </span>
        );
      })}
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
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {features.map(feature => {
        const Icon = feature.icon ? getIconComponent(feature.icon) : Sparkles;
        const content = (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
              style={{ boxShadow: `0 0 12px ${colors.accent}40` }}
            >
              <Icon className="h-4 w-4" style={{ color: colors.accent }} />
            </div>
            <p className="text-sm font-medium text-white/85" style={{ fontFamily: fonts.heading }}>
              {feature.title}
            </p>
            {feature.desc ? (
              <p className="mt-2 text-sm leading-relaxed text-white/45">{feature.desc}</p>
            ) : null}
          </div>
        );

        return feature.link ? (
          <a key={feature.id} href={feature.link} className="block">
            {content}
          </a>
        ) : (
          <div key={feature.id}>{content}</div>
        );
      })}
    </div>
  );
}

function HeroButtons({
  hero,
  colors,
  fonts,
}: {
  hero: NonNullable<HeroSectionProps['template']['heroSection']>;
  colors: HeroSectionProps['colors'];
  fonts: HeroSectionProps['fonts'];
}) {
  const buttons = [
    { text: hero.primaryButtonText, href: hero.primaryButtonLink, key: 'primary' },
    { text: hero.secondaryButtonText, href: hero.secondaryButtonLink, key: 'secondary' },
    { text: hero.tertiaryButtonText, href: hero.tertiaryButtonLink, key: 'tertiary' },
  ].filter(button => button.text && button.href);

  if (buttons.length === 0) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {buttons.map((button, index) => (
        <a
          key={button.key}
          href={button.href!}
          className={`rounded-xl border px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
            index === 0
              ? 'border-white/20 bg-white/[0.12] text-white/90 hover:border-white/30 hover:bg-white/[0.18]'
              : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
          }`}
          style={
            index === 0
              ? { boxShadow: `0 0 20px ${colors.accent}30`, fontFamily: fonts.heading }
              : { fontFamily: fonts.heading }
          }
        >
          {button.text}
        </a>
      ))}
    </div>
  );
}

export default function GlassmorphismHeroSection({
  store,
  template,
  colors,
  fonts,
}: HeroSectionProps) {
  const hero = template.heroSection;

  if (hero && (!hero.enabled || hero.visible === false)) return null;

  const heroTitle = hero?.title?.trim() || store.name?.trim() || '';
  const description =
    hero?.description?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const overline = hero?.overline?.trim() || template.tagline?.trim() || '';
  const badges = hero?.showBadge ? sortEnabled(hero.badges) : [];
  const stats = hero?.showStats ? sortEnabled(hero.stats) : [];
  const features = hero?.showFeatures ? sortEnabled(hero.features) : [];
  const trustItems = hero?.showTrustItems ? sortEnabled(hero.trustItems) : [];
  const heightClass = getSectionHeight(hero?.sectionHeight);
  const paddingClass = getVerticalPadding(hero?.verticalPadding);
  const containerClass = getContainerClass(hero?.containerStyle);
  const contentAlign = getContentAlignment(hero?.contentAlign);
  const layout = hero?.layout || 'SPLIT';
  const glassCardClass = hero?.glassEffect
    ? 'rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-2xl'
    : '';
  const mediaWrapperClass = `${hero?.roundedMedia ? 'rounded-2xl' : 'rounded-none'} ${hero?.borderMedia ? 'border border-white/20' : ''}`;
  const mediaGlowStyle = hero?.shadowMedia
    ? { boxShadow: `0 0 60px ${colors.accent}25, 0 0 120px ${colors.primary}15` }
    : undefined;
  const baseStyle = getSectionBackground(colors, hero);
  const overlayStyle = hero?.overlayEnabled
    ? {
        backgroundColor: hero.overlayColor ?? '#000',
        opacity: (hero.overlayOpacity ?? 0) / 100,
      }
    : undefined;

  const textContent = (
    <div
      className={`flex flex-col ${contentAlign} ${glassCardClass}`}
      style={hero?.contentMaxWidth ? { maxWidth: hero.contentMaxWidth } : undefined}
    >
      {badges.length > 0 ? <HeroBadges badges={badges} colors={colors} fonts={fonts} /> : null}

      {overline ? (
        <p
          className="mb-4 text-xs tracking-widest text-white/40 uppercase"
          style={{ color: colors.accent, fontFamily: fonts.body }}
        >
          {overline}
        </p>
      ) : null}

      <h1
        className="text-5xl font-light tracking-tight text-white/90 lg:text-7xl"
        style={{ fontFamily: fonts.heading }}
      >
        {heroTitle}{' '}
        {hero?.highlightText ? (
          <span style={{ color: colors.accent }}>{hero.highlightText}</span>
        ) : null}
      </h1>

      {description ? (
        <p className="mt-5 text-base leading-relaxed text-white/55">{description}</p>
      ) : null}

      {hero?.promoText ? (
        <div
          className="mt-6 inline-flex w-fit flex-wrap items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300 backdrop-blur-sm"
          style={{ fontFamily: fonts.body }}
        >
          <span>{hero.promoText}</span>
          {hero.promoEndsAt ? <span className="text-amber-200/70">{hero.promoEndsAt}</span> : null}
        </div>
      ) : null}

      {hero && hero.showButtons ? <HeroButtons hero={hero} colors={colors} fonts={fonts} /> : null}

      {hero?.urgencyText ? <p className="mt-2 text-xs text-red-400">{hero.urgencyText}</p> : null}

      {stats.length > 0 ? <HeroStats stats={stats} fonts={fonts} /> : null}
      {trustItems.length > 0 ? (
        <HeroTrustItems items={trustItems} colors={colors} fonts={fonts} />
      ) : null}
      {features.length > 0 ? (
        <HeroFeatures features={features} colors={colors} fonts={fonts} />
      ) : null}
    </div>
  );

  const mediaContent = hero ? (
    <div className={mediaWrapperClass} style={mediaGlowStyle}>
      <MediaAsset
        heroImage={hero.heroImage}
        heroImageMobile={hero.heroImageMobile}
        heroImageAlt={hero.heroImageAlt}
        heroVideo={hero.heroVideo}
        roundedMedia={Boolean(hero.roundedMedia)}
        shadowMedia={Boolean(hero.shadowMedia)}
        borderMedia={Boolean(hero.borderMedia)}
        colors={colors}
      />
    </div>
  ) : null;

  return (
    <section
      id={hero?.sectionId?.trim() || 'hero-section'}
      className={`relative overflow-hidden ${heightClass}`}
      style={baseStyle}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -end-40 -top-40 h-96 w-96 rounded-full opacity-20 blur-[128px]"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute -start-40 -bottom-40 h-80 w-80 rounded-full opacity-15 blur-[128px]"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      {hero?.backgroundType === 'IMAGE' && (hero.backgroundImage || hero.backgroundImageMobile) ? (
        <div className={`absolute inset-0 ${hero.blurBackground ? 'scale-[1.03] blur-sm' : ''}`}>
          <img
            src={hero.backgroundImageMobile || hero.backgroundImage!}
            alt={hero.heroImageAlt ?? ''}
            className="h-full w-full object-cover"
          />
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

      <div className={`relative z-[1] ${containerClass} ${paddingClass}`}>
        {layout === 'CENTERED' ? (
          <div className="mx-auto max-w-3xl py-24 text-center">
            <div className={`${hero?.glassEffect ? glassCardClass : ''}`}>
              {badges.length > 0 ? (
                <HeroBadges badges={badges} colors={colors} fonts={fonts} />
              ) : null}
              {overline ? (
                <p
                  className="mb-4 text-xs tracking-widest text-white/40 uppercase"
                  style={{ color: colors.accent, fontFamily: fonts.body }}
                >
                  {overline}
                </p>
              ) : null}
              <h1
                className="text-5xl font-light tracking-tight text-white/90 lg:text-7xl"
                style={{ fontFamily: fonts.heading }}
              >
                {heroTitle}{' '}
                {hero?.highlightText ? (
                  <span style={{ color: colors.accent }}>{hero.highlightText}</span>
                ) : null}
              </h1>
              {description ? (
                <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
                  {description}
                </p>
              ) : null}
              {hero && hero.showButtons ? (
                <div className="flex justify-center">
                  <HeroButtons hero={hero} colors={colors} fonts={fonts} />
                </div>
              ) : null}
              {hero?.urgencyText ? (
                <p className="mt-2 text-xs text-red-400">{hero.urgencyText}</p>
              ) : null}
              {stats.length > 0 ? <HeroStats stats={stats} fonts={fonts} /> : null}
              {trustItems.length > 0 ? (
                <HeroTrustItems items={trustItems} colors={colors} fonts={fonts} />
              ) : null}
              {features.length > 0 ? (
                <HeroFeatures features={features} colors={colors} fonts={fonts} />
              ) : null}
            </div>

            {mediaContent ? <div className="mt-12">{mediaContent}</div> : null}
          </div>
        ) : layout === 'FULLSCREEN' ? (
          <div className="flex min-h-[85vh] items-end pb-16">
            <div className="max-w-3xl">{textContent}</div>
          </div>
        ) : layout === 'MINIMAL' ? (
          <div className="py-16 lg:py-24">{textContent}</div>
        ) : (
          <div
            className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${layout === 'IMAGE_LEFT' ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
          >
            <div>{textContent}</div>
            {mediaContent ? <div>{mediaContent}</div> : null}
          </div>
        )}
      </div>

      {hero?.showScrollHint ? (
        <div className="absolute inset-x-0 bottom-6 flex justify-center text-white/40">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      ) : null}
    </section>
  );
}
