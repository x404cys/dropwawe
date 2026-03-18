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
      background: `linear-gradient(180deg,
        ${hero.backgroundGradientFrom || '#080808'},
        ${hero.backgroundGradientVia || '#0f0f0f'},
        ${hero.backgroundGradientTo || '#161616'})`,
    };
  }
  return {};
}

// ── HERO BUTTONS ──────────────────────────────────────────
function HeroButtons({
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
  colors,
  fonts,
  forceLight = false,
}: {
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
  colors: HeroSectionProps['colors'];
  fonts: HeroSectionProps['fonts'];
  forceLight?: boolean;
}) {
  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;
  if (!primaryText && !secondaryText) return null;

  const primaryColor = forceLight ? '#ffffff' : colors.text;
  const primaryBorder = forceLight ? '#ffffff40' : colors.text + '33';
  const primaryBg = forceLight ? 'rgba(0,0,0,0.35)' : 'transparent';
  const secondaryColor = forceLight ? '#ffffff99' : colors.text + '73';

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4" style={accentVars}>
      {primaryText && (
        <a
          href={primaryHref}
          className="border px-6 py-3 font-mono text-xs tracking-[0.22em] uppercase transition-all duration-150 ease-out hover:border-[var(--tech-accent)] hover:text-[var(--tech-accent)]"
          style={{
            fontFamily: fonts.body,
            color: primaryColor,
            borderColor: primaryBorder,
            background: primaryBg,
            backdropFilter: forceLight ? 'blur(4px)' : undefined,
          }}
        >
          {primaryText}
        </a>
      )}
      {secondaryText && (
        <a
          href={secondaryHref}
          className="font-mono text-xs tracking-[0.22em] uppercase transition-all duration-150 ease-out"
          style={{ fontFamily: fonts.body, color: secondaryColor }}
          onMouseEnter={e => {
            e.currentTarget.style.color = forceLight ? '#ffffff' : colors.text;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = secondaryColor;
          }}
        >
          {secondaryText}
        </a>
      )}
    </div>
  );
}

// ── STATS ROW ─────────────────────────────────────────────
function StatsRow({
  stats,
  fonts,
  colors,
  forceLight = false,
}: {
  stats: NonNullable<StorefrontHeroSection['stats']>;
  fonts: HeroSectionProps['fonts'];
  colors: HeroSectionProps['colors'];
  forceLight?: boolean;
}) {
  if (stats.length === 0) return null;

  const textColor = forceLight ? '#ffffff' : colors.text;
  const textMuted = forceLight ? '#ffffff4d' : colors.text + '4d';
  const borderCol = forceLight ? '#ffffff14' : colors.text + '0f';

  return (
    <div
      className="mt-10 grid gap-4 border-t pt-6 sm:grid-cols-3"
      style={{ borderColor: borderCol }}
    >
      {stats.map(stat => (
        <div key={stat.id} className="space-y-1">
          <p
            className="font-mono text-3xl font-thin"
            style={{ fontFamily: fonts.heading, color: textColor }}
          >
            {stat.value}
          </p>
          <p
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: fonts.body, color: textMuted }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── TRUST ROW ─────────────────────────────────────────────
function TrustRow({
  items,
  fonts,
  colors,
  forceLight = false,
}: {
  items: NonNullable<StorefrontHeroSection['trustItems']>;
  fonts: HeroSectionProps['fonts'];
  colors: HeroSectionProps['colors'];
  forceLight?: boolean;
}) {
  if (items.length === 0) return null;

  const textMuted = forceLight ? '#ffffff4d' : colors.text + '4d';
  const borderCol = forceLight ? '#ffffff14' : colors.text + '0f';

  return (
    <div
      className="mt-6 flex flex-wrap items-center gap-3 border-t pt-5"
      style={{ borderColor: borderCol }}
    >
      {items.map(item => (
        <span
          key={item.id}
          className="font-mono text-[10px] tracking-[0.2em] uppercase"
          style={{ fontFamily: fonts.body, color: textMuted }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}

// ── HERO MEDIA ────────────────────────────────────────────
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
      <div
        className="relative h-full min-h-[22rem] overflow-hidden"
        style={{ background: colors.bg }}
      >
        <Image src={image} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className="relative grid h-full min-h-[22rem] place-items-center overflow-hidden border-s px-8"
      style={{ background: colors.bg, borderColor: colors.text + '0f' }}
    >
      <div className="absolute inset-8 border" style={{ borderColor: colors.text + '14' }} />
      <div className="absolute inset-14 border" style={{ borderColor: colors.text + '0f' }} />
      <div className="absolute inset-20 border" style={{ borderColor: colors.text + '0a' }} />
      <div className="relative text-center">
        <div className="mx-auto mb-6 h-px w-16" style={{ backgroundColor: colors.accent }} />
        <p
          className="font-mono text-xs tracking-[0.22em] uppercase"
          style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
        >
          MEDIA.OFFLINE
        </p>
        <p
          className="mt-3 font-mono text-lg"
          style={{ fontFamily: fonts.heading, color: colors.text }}
        >
          {storeName}
        </p>
      </div>
    </div>
  );
}

// ── SPLIT CONTENT ─────────────────────────────────────────
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
  forceLight = false,
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
  forceLight?: boolean;
}) {
  const textColor = forceLight ? '#ffffff' : colors.text;
  const textMuted = forceLight ? '#ffffff73' : colors.text + '73';
  const textHint = forceLight ? '#ffffff40' : colors.text + '40';
  const textSubtitle = forceLight ? '#ffffff66' : colors.text + '66';
  const borderSubtle = forceLight ? '#ffffff14' : colors.text + '14';
  const bgBadge = forceLight ? 'rgba(0,0,0,0.35)' : colors.bg;

  return (
    <div className="flex h-full flex-col justify-center px-6 py-16 sm:px-8 lg:px-20 lg:py-24">
      <p
        className="font-mono text-[10px] tracking-[0.24em] uppercase"
        style={{ fontFamily: fonts.body, color: textHint }}
      >
        // STORE_ID: {storeId}
      </p>

      {overline && (
        <p
          className="mt-4 font-mono text-xs tracking-[0.24em] uppercase"
          style={{ color: colors.accent, fontFamily: fonts.body }}
        >
          {overline}
        </p>
      )}

      {badge && hero?.showBadge !== false && (
        <div
          className="mt-4 inline-flex w-fit border px-3 py-2"
          style={{
            borderColor: borderSubtle,
            background: bgBadge,
            backdropFilter: forceLight ? 'blur(4px)' : undefined,
          }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: fonts.body, color: forceLight ? '#ffffff8c' : colors.text + '8c' }}
          >
            {badge}
          </span>
        </div>
      )}

      <h1
        className="mt-6 max-w-3xl font-mono text-5xl leading-[1.1] font-light tracking-tight lg:text-7xl"
        style={{ fontFamily: fonts.heading, color: textColor }}
      >
        {title}
        {highlight && (
          <span className="block" style={{ color: colors.accent }}>
            {highlight}
          </span>
        )}
      </h1>

      {subtitle && (
        <p
          className="mt-4 max-w-2xl font-mono text-sm tracking-[0.18em] uppercase"
          style={{ fontFamily: fonts.body, color: textSubtitle }}
        >
          {subtitle}
        </p>
      )}

      {description && (
        <p
          className="mt-6 max-w-sm font-mono text-sm leading-7"
          style={{ fontFamily: fonts.body, color: textMuted }}
        >
          {description}
        </p>
      )}

      {hero?.showButtons !== false && (
        <HeroButtons
          primaryText={primaryText}
          primaryHref={primaryHref}
          secondaryText={secondaryText}
          secondaryHref={secondaryHref}
          colors={colors}
          fonts={fonts}
          forceLight={forceLight}
        />
      )}

      {hero?.showStats && (
        <StatsRow stats={stats} fonts={fonts} colors={colors} forceLight={forceLight} />
      )}
      {hero?.showTrustItems && (
        <TrustRow items={trustItems} fonts={fonts} colors={colors} forceLight={forceLight} />
      )}
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────
export default function TechFuturisticHeroSection({
  store,
  template,
  colors,
  fonts,
}: HeroSectionProps) {
  const hero = template.heroSection;
  if (hero && (!hero.enabled || hero.visible === false)) return null;

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
  const stats = (hero?.stats ?? []).filter(i => i.enabled && i.label && i.value);
  const trustItems = (hero?.trustItems ?? []).filter(i => i.enabled && i.text);
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

  const sharedSplitProps = {
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
  };

  // ── SPLIT layout ──
  const splitLayout = (
    <div
      className={`grid h-full lg:grid-cols-2 ${
        mediaFirst ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
      }`}
    >
      <SplitContent {...sharedSplitProps} forceLight={false} />
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

  // ── MINIMAL layout ──
  if (isMinimal) {
    content = (
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className={`flex max-w-3xl flex-col ${contentAlignClass}`}>
          <SplitContent {...sharedSplitProps} forceLight={false} />
        </div>
      </div>
    );
  }

  // ── CENTERED layout ──
  if (isCentered) {
    content = (
      <div className="relative mx-auto flex max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div
          className={`mx-auto flex min-h-[65vh] max-w-5xl flex-col justify-center ${contentAlignClass}`}
        >
          {overline && (
            <p
              className="font-mono text-xs tracking-[0.24em] uppercase"
              style={{ color: colors.accent, fontFamily: fonts.body }}
            >
              {overline}
            </p>
          )}
          <h1
            className="mt-6 font-mono text-[15vw] leading-[0.95] font-light tracking-tight sm:text-7xl lg:text-[9vw]"
            style={{ fontFamily: fonts.heading, color: '#ffffff' }}
          >
            {title}
            {highlight && <span className="block">{highlight}</span>}
          </h1>
          <div className="mt-6 h-px w-12" style={{ backgroundColor: colors.accent }} />
          {subtitle && (
            <p
              className="mt-5 font-mono text-xs tracking-[0.18em] uppercase"
              style={{ fontFamily: fonts.body, color: '#ffffff59' }}
            >
              {subtitle}
            </p>
          )}
          {description && (
            <p
              className="mt-6 max-w-md font-mono text-sm leading-7"
              style={{ fontFamily: fonts.body, color: '#ffffff73' }}
            >
              {description}
            </p>
          )}
          {hero?.showButtons !== false && (
            <HeroButtons
              primaryText={primaryText}
              primaryHref={primaryHref}
              secondaryText={secondaryText}
              secondaryHref={secondaryHref}
              colors={colors}
              fonts={fonts}
              forceLight={true}
            />
          )}
          {hero?.showTrustItems && (
            <TrustRow items={trustItems} fonts={fonts} colors={colors} forceLight={true} />
          )}
        </div>
      </div>
    );
  }

  // ── FULLSCREEN layout ──
  if (isFullscreen) {
    content = (
      <div className="relative flex min-h-screen items-end px-6 py-16 sm:px-8 lg:px-16 lg:py-20">
        {/* overlay داكن ثابت بغض النظر عن الثيم */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex max-w-3xl items-start gap-6">
          <div className="mt-3 h-12 w-px shrink-0" style={{ backgroundColor: colors.accent }} />
          <div>
            {overline && (
              <p
                className="font-mono text-xs tracking-[0.24em] uppercase"
                style={{ color: colors.accent, fontFamily: fonts.body }}
              >
                {overline}
              </p>
            )}
            <h1
              className="mt-6 font-mono text-5xl leading-[1.05] font-light tracking-tight lg:text-7xl"
              style={{ fontFamily: fonts.heading, color: '#ffffff' }}
            >
              {title}
              {highlight && <span className="block">{highlight}</span>}
            </h1>
            {description && (
              <p
                className="mt-6 max-w-md font-mono text-sm leading-7"
                style={{ fontFamily: fonts.body, color: '#ffffff73' }}
              >
                {description}
              </p>
            )}
            {hero?.showButtons !== false && (
              <HeroButtons
                primaryText={primaryText}
                primaryHref={primaryHref}
                secondaryText={secondaryText}
                secondaryHref={secondaryHref}
                colors={colors}
                fonts={fonts}
                forceLight={true}
              />
            )}
            {hero?.showStats && (
              <StatsRow stats={stats} fonts={fonts} colors={colors} forceLight={true} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      id={sectionId}
      className={`relative overflow-hidden border-b ${getHeightClass(hero)}`}
      style={{
        ...backgroundStyle,
        ...accentVars,
        background: backgroundStyle.background ?? backgroundStyle.backgroundColor ?? colors.bg,
        borderColor: colors.text + '0f',
      }}
    >
      {/* Ambient media — FULLSCREEN & CENTERED only */}
      {showAmbientMedia && (backgroundImage || backgroundVideo) && (
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
          {/* overlay يتحكم فيه المستخدم أو fallback */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: hero?.overlayEnabled ? hero.overlayColor || '#000000' : '#000000',
              opacity: hero?.overlayEnabled ? overlayOpacity : isFullscreen ? 0 : 0.5,
            }}
          />
        </div>
      )}

      <div className="relative z-[1]">{content}</div>
    </section>
  );
}
