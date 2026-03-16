// THEME: tech-futuristic - HeroSection

'use client';

import Image from 'next/image';
import { type CSSProperties, type ReactNode } from 'react';
import type { HeroSectionProps, StorefrontHeroSection } from '../../../_lib/types';

function getHeightClass(hero: StorefrontHeroSection | null) {
  switch (hero?.sectionHeight) {
    case 'screen':
      return 'min-h-screen';
    case 'xl':
      return 'min-h-[95vh]';
    case 'lg':
      return 'min-h-[85vh]';
    case 'md':
      return 'min-h-[70vh]';
    case 'sm':
      return 'min-h-[60vh]';
    default:
      return 'min-h-[70vh]';
  }
}

function getBackgroundStyle(hero: StorefrontHeroSection | null): CSSProperties {
  if (!hero) return {};

  if (hero.backgroundType === 'COLOR' && hero.backgroundColor) {
    return { backgroundColor: hero.backgroundColor };
  }

  if (hero.backgroundType === 'GRADIENT') {
    return {
      background: `linear-gradient(180deg, ${hero.backgroundGradientFrom || '#080808'}, ${
        hero.backgroundGradientVia || '#0f0f0f'
      }, ${hero.backgroundGradientTo || '#161616'})`,
    };
  }

  return {};
}

function HeroButtons({
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
  colors,
  fonts,
}: {
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
  colors: HeroSectionProps['colors'];
  fonts: HeroSectionProps['fonts'];
}) {
  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;

  if (!primaryText && !secondaryText) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4" style={accentVars}>
      {primaryText ? (
        <a
          href={primaryHref}
          className="border border-white/20 px-6 py-3 font-mono text-xs tracking-[0.22em] text-[#f2f2f2] uppercase transition-all duration-150 ease-out hover:border-[var(--tech-accent)] hover:text-[var(--tech-accent)]"
          style={{ fontFamily: fonts.body }}
        >
          {primaryText}
        </a>
      ) : null}
      {secondaryText ? (
        <a
          href={secondaryHref}
          className="font-mono text-xs tracking-[0.22em] text-white/45 uppercase transition-all duration-150 ease-out hover:text-[#f2f2f2]"
          style={{ fontFamily: fonts.body }}
        >
          {secondaryText}
        </a>
      ) : null}
    </div>
  );
}

function StatsRow({
  stats,
  fonts,
}: {
  stats: NonNullable<StorefrontHeroSection['stats']>;
  fonts: HeroSectionProps['fonts'];
}) {
  if (stats.length === 0) return null;

  return (
    <div className="mt-10 grid gap-4 border-t border-white/[0.06] pt-6 sm:grid-cols-3">
      {stats.map(stat => (
        <div key={stat.id} className="space-y-1">
          <p
            className="font-mono text-3xl font-thin text-[#f2f2f2]"
            style={{ fontFamily: fonts.heading }}
          >
            {stat.value}
          </p>
          <p
            className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function TrustRow({
  items,
  fonts,
}: {
  items: NonNullable<StorefrontHeroSection['trustItems']>;
  fonts: HeroSectionProps['fonts'];
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5">
      {items.map(item => (
        <span
          key={item.id}
          className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase"
          style={{ fontFamily: fonts.body }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}

function HeroMedia({
  image,
  alt,
  storeName,
  fonts,
  colors,
}: {
  image: string | null;
  alt: string;
  storeName: string;
  fonts: HeroSectionProps['fonts'];
  colors: HeroSectionProps['colors'];
}) {
  if (image) {
    return (
      <div className="relative h-full min-h-[22rem] overflow-hidden bg-[#0f0f0f]">
        <Image src={image} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className="relative grid h-full min-h-[22rem] place-items-center overflow-hidden border-s border-white/[0.06] bg-[#0f0f0f] px-8">
      {/* DESIGN: Nested border geometry keeps the hero intentional even when media is missing. */}
      <div className="absolute inset-8 border border-white/[0.08]" />
      <div className="absolute inset-14 border border-white/[0.06]" />
      <div className="absolute inset-20 border border-white/[0.04]" />
      <div className="relative text-center">
        <div className="mx-auto mb-6 h-px w-16" style={{ backgroundColor: colors.accent }} />
        <p
          className="font-mono text-xs tracking-[0.22em] text-white/30 uppercase"
          style={{ fontFamily: fonts.body }}
        >
          MEDIA.OFFLINE
        </p>
        <p className="mt-3 font-mono text-lg text-[#f2f2f2]" style={{ fontFamily: fonts.heading }}>
          {storeName}
        </p>
      </div>
    </div>
  );
}

function SplitContent({
  hero,
  storeId,
  title,
  subtitle,
  description,
  overline,
  badge,
  highlight,
  colors,
  fonts,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
  stats,
  trustItems,
}: {
  hero: StorefrontHeroSection | null;
  storeId: string;
  title: string;
  subtitle: string;
  description: string;
  overline: string;
  badge: string;
  highlight: string;
  colors: HeroSectionProps['colors'];
  fonts: HeroSectionProps['fonts'];
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
  stats: NonNullable<StorefrontHeroSection['stats']>;
  trustItems: NonNullable<StorefrontHeroSection['trustItems']>;
}) {
  return (
    <div className="flex h-full flex-col justify-center px-6 py-16 sm:px-8 lg:px-20 lg:py-24">
      <p
        className="font-mono text-[10px] tracking-[0.24em] text-white/25 uppercase"
        style={{ fontFamily: fonts.body }}
      >
        // STORE_ID: {storeId}
      </p>

      {overline ? (
        <p
          className="mt-4 font-mono text-xs tracking-[0.24em] uppercase"
          style={{ color: colors.accent, fontFamily: fonts.body }}
        >
          {overline}
        </p>
      ) : null}

      {badge && hero?.showBadge !== false ? (
        <div className="mt-4 inline-flex w-fit border border-white/[0.08] bg-[#0f0f0f] px-3 py-2">
          <span
            className="font-mono text-[10px] tracking-[0.2em] text-white/55 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {badge}
          </span>
        </div>
      ) : null}

      <h1
        className="mt-6 max-w-3xl font-mono text-5xl leading-[1.1] font-light tracking-tight text-[#f2f2f2] lg:text-7xl"
        style={{ fontFamily: fonts.heading }}
      >
        {title}
        {highlight ? (
          <span className="block" style={{ color: colors.accent }}>
            {highlight}
          </span>
        ) : null}
      </h1>

      {subtitle ? (
        <p
          className="mt-4 max-w-2xl font-mono text-sm tracking-[0.18em] text-white/40 uppercase"
          style={{ fontFamily: fonts.body }}
        >
          {subtitle}
        </p>
      ) : null}

      {description ? (
        <p
          className="mt-6 max-w-sm font-mono text-sm leading-7 text-white/45"
          style={{ fontFamily: fonts.body }}
        >
          {description}
        </p>
      ) : null}

      {hero?.showButtons !== false ? (
        <HeroButtons
          primaryText={primaryText}
          primaryHref={primaryHref}
          secondaryText={secondaryText}
          secondaryHref={secondaryHref}
          colors={colors}
          fonts={fonts}
        />
      ) : null}

      {hero?.showStats ? <StatsRow stats={stats} fonts={fonts} /> : null}
      {hero?.showTrustItems ? <TrustRow items={trustItems} fonts={fonts} /> : null}
    </div>
  );
}

export default function TechFuturisticHeroSection({
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
  const subtitle = hero?.subtitle?.trim() || '';
  const description =
    hero?.description?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const overline = hero?.overline?.trim() || template.tagline?.trim() || '';
  const badge = hero?.badgeText?.trim() || '';
  const highlight = hero?.highlightText?.trim() || '';
  const mediaImage = hero?.heroImage || hero?.heroImageMobile || null;
  const backgroundImage = hero?.backgroundImage || hero?.backgroundImageMobile || null;
  const backgroundVideo = hero?.backgroundVideo || hero?.heroVideo || null;
  const primaryText = hero?.primaryButtonText?.trim() || template.heroButtonText?.trim() || '';
  const primaryHref = hero?.primaryButtonLink?.trim() || '#store-section';
  const secondaryText =
    hero?.secondaryButtonText?.trim() || template.heroSecondaryButton?.trim() || '';
  const secondaryHref = hero?.secondaryButtonLink?.trim() || '#about-section';
  const stats = (hero?.stats ?? []).filter(item => item.enabled && item.label && item.value);
  const trustItems = (hero?.trustItems ?? []).filter(item => item.enabled && item.text);
  const sectionId = hero?.sectionId?.trim() || 'hero-section';
  const layout = hero?.layout || 'SPLIT';
  const isFullscreen = layout === 'FULLSCREEN';
  const isCentered = layout === 'CENTERED';
  const isMinimal = layout === 'MINIMAL';
  const mediaFirst = layout === 'IMAGE_LEFT';
  const showAmbientMedia = isFullscreen || isCentered;
  const backgroundStyle = getBackgroundStyle(hero);
  const overlayOpacity = Math.max(0, Math.min(hero?.overlayOpacity ?? 60, 100)) / 100;
  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;
  const contentAlignClass =
    hero?.contentAlign === 'center'
      ? 'items-center text-center'
      : hero?.contentAlign === 'right'
        ? 'items-end text-right'
        : 'items-start text-left';
  const storeId = store.id.slice(0, 8).toUpperCase();
  const heroAlt = hero?.heroImageAlt || title || store.name || 'Hero image';

  const splitLayout = (
    <div
      className={`grid h-full lg:grid-cols-2 ${
        mediaFirst ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
      }`}
    >
      <SplitContent
        hero={hero}
        storeId={storeId}
        title={title}
        subtitle={subtitle}
        description={description}
        overline={overline}
        badge={badge}
        highlight={highlight}
        colors={colors}
        fonts={fonts}
        primaryText={primaryText}
        primaryHref={primaryHref}
        secondaryText={secondaryText}
        secondaryHref={secondaryHref}
        stats={stats}
        trustItems={trustItems}
      />
      <HeroMedia
        image={mediaImage}
        alt={heroAlt}
        storeName={store.name || title}
        fonts={fonts}
        colors={colors}
      />
    </div>
  );

  let content: ReactNode = splitLayout;

  if (isMinimal) {
    content = (
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className={`flex max-w-3xl flex-col ${contentAlignClass}`}>
          <SplitContent
            hero={hero}
            storeId={storeId}
            title={title}
            subtitle={subtitle}
            description={description}
            overline={overline}
            badge={badge}
            highlight={highlight}
            colors={colors}
            fonts={fonts}
            primaryText={primaryText}
            primaryHref={primaryHref}
            secondaryText={secondaryText}
            secondaryHref={secondaryHref}
            stats={stats}
            trustItems={trustItems}
          />
        </div>
      </div>
    );
  }

  if (isCentered) {
    content = (
      <div className="relative mx-auto flex max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div
          className={`mx-auto flex min-h-[65vh] max-w-5xl flex-col justify-center ${contentAlignClass}`}
        >
          {overline ? (
            <p
              className="font-mono text-xs tracking-[0.24em] uppercase"
              style={{ color: colors.accent, fontFamily: fonts.body }}
            >
              {overline}
            </p>
          ) : null}
          <h1
            className="mt-6 font-mono text-[15vw] leading-[0.95] font-light tracking-tight text-[#f2f2f2] sm:text-7xl lg:text-[9vw]"
            style={{ fontFamily: fonts.heading }}
          >
            {title}
            {highlight ? <span className="block">{highlight}</span> : null}
          </h1>
          <div className="mt-6 h-px w-12" style={{ backgroundColor: colors.accent }} />
          {subtitle ? (
            <p
              className="mt-5 font-mono text-xs tracking-[0.18em] text-white/35 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              {subtitle}
            </p>
          ) : null}
          {description ? (
            <p
              className="mt-6 max-w-md font-mono text-sm leading-7 text-white/45"
              style={{ fontFamily: fonts.body }}
            >
              {description}
            </p>
          ) : null}
          {hero?.showButtons !== false ? (
            <HeroButtons
              primaryText={primaryText}
              primaryHref={primaryHref}
              secondaryText={secondaryText}
              secondaryHref={secondaryHref}
              colors={colors}
              fonts={fonts}
            />
          ) : null}
          {hero?.showTrustItems ? <TrustRow items={trustItems} fonts={fonts} /> : null}
        </div>
      </div>
    );
  }

  if (isFullscreen) {
    content = (
      <div className="relative flex min-h-screen items-end px-6 py-16 sm:px-8 lg:px-16 lg:py-20">
        <div className="flex max-w-3xl items-start gap-6">
          <div className="mt-3 h-12 w-px shrink-0" style={{ backgroundColor: colors.accent }} />
          <div>
            {overline ? (
              <p
                className="font-mono text-xs tracking-[0.24em] uppercase"
                style={{ color: colors.accent, fontFamily: fonts.body }}
              >
                {overline}
              </p>
            ) : null}
            <h1
              className="mt-6 font-mono text-5xl leading-[1.05] font-light tracking-tight text-[#f2f2f2] lg:text-7xl"
              style={{ fontFamily: fonts.heading }}
            >
              {title}
              {highlight ? <span className="block">{highlight}</span> : null}
            </h1>
            {description ? (
              <p
                className="mt-6 max-w-md font-mono text-sm leading-7 text-white/45"
                style={{ fontFamily: fonts.body }}
              >
                {description}
              </p>
            ) : null}
            {hero?.showButtons !== false ? (
              <HeroButtons
                primaryText={primaryText}
                primaryHref={primaryHref}
                secondaryText={secondaryText}
                secondaryHref={secondaryHref}
                colors={colors}
                fonts={fonts}
              />
            ) : null}
            {hero?.showStats ? <StatsRow stats={stats} fonts={fonts} /> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      id={sectionId}
      className={`relative overflow-hidden border-b border-white/[0.06] bg-[#080808] ${getHeightClass(hero)}`}
      style={{ ...backgroundStyle, ...accentVars }}
    >
      {showAmbientMedia && (backgroundImage || backgroundVideo) ? (
        <div className="absolute inset-0">
          {backgroundVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              poster={hero?.heroVideoPoster || undefined}
            >
              <source src={backgroundVideo} />
            </video>
          ) : backgroundImage ? (
            <Image src={backgroundImage} alt={heroAlt} fill className="object-cover" />
          ) : null}
          <div
            className="absolute inset-0 bg-black"
            style={{
              backgroundColor: hero?.overlayEnabled ? hero.overlayColor || '#000000' : '#000000',
              opacity: hero?.overlayEnabled ? overlayOpacity : isFullscreen ? 0.6 : 0.45,
            }}
          />
        </div>
      ) : null}

      {/* DESIGN: Layout switching keeps the same content contract while changing the spatial behavior completely. */}
      <div className="relative z-[1]">{content}</div>
    </section>
  );
}
