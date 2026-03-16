'use client';

import { ArrowDown, Check, Zap } from 'lucide-react';
import { ActiveColors, StorefrontHeroSection, StorefrontTemplate } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';

interface HeroSectionProps {
  template: StorefrontTemplate;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

type HeroStatView = {
  key: string;
  value: string;
  label: string;
};

function splitTitle(baseTitle: string, highlightText?: string | null) {
  if (highlightText) {
    return { first: baseTitle, second: highlightText };
  }

  const words = baseTitle.split(' ').filter(Boolean);
  const half = Math.ceil(words.length / 2);

  return {
    first: words.slice(0, half).join(' '),
    second: words.slice(half).join(' '),
  };
}

function buildStats(
  hero: StorefrontHeroSection | null | undefined,
  locale: string,
  t: ReturnType<typeof useLanguage>['t']
): HeroStatView[] {
  const enabledStats = hero?.stats?.filter(stat => stat.enabled) ?? [];

  if (enabledStats.length > 0) {
    return enabledStats.map(stat => ({
      key: stat.id,
      value: stat.value,
      label: stat.label,
    }));
  }

  return [
    {
      key: 'happy-clients',
      value: `${new Intl.NumberFormat(locale).format(5000)}+`,
      label: t.hero.stats.happyClients,
    },
    {
      key: 'products',
      value: `${new Intl.NumberFormat(locale).format(150)}+`,
      label: t.hero.stats.products,
    },
    {
      key: 'rating',
      value: '4.9',
      label: t.hero.stats.rating,
    },
  ];
}

function buildBackgroundStyle(
  hero: StorefrontHeroSection | null | undefined,
  colors: ActiveColors
) {
  if (!hero) {
    return {
      background: `linear-gradient(to bottom, ${colors.primary}0F, transparent)`,
    };
  }

  console.log('backgroundType', hero?.backgroundType);
  console.log('backgroundImage', hero?.heroImage);
  if (hero.backgroundType === 'IMAGE' && hero.heroImage) {
    return {
      backgroundImage: `url(${hero.heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  if (hero.backgroundType === 'GRADIENT') {
    const from = hero.backgroundGradientFrom || `${colors.primary}20`;
    const via = hero.backgroundGradientVia || 'transparent';
    const to = hero.backgroundGradientTo || 'transparent';

    return {
      background: `linear-gradient(to bottom, ${from}, ${via}, ${to})`,
    };
  }

  if (hero.backgroundType === 'COLOR' && hero.backgroundColor) {
    return {
      backgroundColor: hero.backgroundColor,
    };
  }

  return {
    background: `linear-gradient(to bottom, ${colors.primary}0F, transparent)`,
  };
}

function buildContentAlign(hero: StorefrontHeroSection | null | undefined) {
  switch (hero?.contentAlign) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
}

function buildItemsAlign(hero: StorefrontHeroSection | null | undefined) {
  switch (hero?.contentAlign) {
    case 'left':
      return 'items-start';
    case 'right':
      return 'items-end';
    default:
      return 'items-center';
  }
}

function buildJustify(hero: StorefrontHeroSection | null | undefined) {
  switch (hero?.contentPosition) {
    case 'start':
      return 'justify-start';
    case 'end':
      return 'justify-end';
    default:
      return 'justify-center';
  }
}

function buildSectionHeight(hero: StorefrontHeroSection | null | undefined) {
  switch (hero?.sectionHeight) {
    case 'screen':
      return 'min-h-screen';
    case 'xl':
      return 'min-h-[820px]';
    case 'lg':
      return 'min-h-[720px]';
    case 'md':
      return 'min-h-[620px]';
    case 'sm':
      return 'min-h-[520px]';
    default:
      return '';
  }
}

function buildContainerWidth(hero: StorefrontHeroSection | null | undefined) {
  if (hero?.containerStyle === 'full') {
    return 'max-w-none';
  }

  return 'max-w-5xl';
}

function buildTrustItems(hero: StorefrontHeroSection | null | undefined) {
  return hero?.trustItems?.filter(item => item.enabled) ?? [];
}

export default function HeroSection({ template, colors, headingStyle }: HeroSectionProps) {
  const { t, locale } = useLanguage();
  const hero = template.heroSection;

  if (hero && (!hero.enabled || hero.visible === false)) {
    return null;
  }

  const fallbackTagline = template.tagline ?? t.hero.taglineFallback;
  const overlineText = hero?.overline?.trim() || '';
  const titleText = hero?.title?.trim() || fallbackTagline;
  const titleParts = splitTitle(titleText, hero?.highlightText);

  const storeDescription = (
    hero?.description ??
    hero?.subtitle ??
    template.storeDescription ??
    ''
  ).trim();

  const subtitleText = hero?.subtitle?.trim() || '';
  const badgeText = hero?.badgeText?.trim() || t.hero.badge;
  const trustText = hero?.trustText?.trim() || '';
  const smallNote = hero?.smallNote?.trim() || '';

  const primaryCtaText =
    hero?.primaryButtonText?.trim() || template.heroButtonText || t.hero.primaryCta;

  const secondaryCtaText =
    hero?.secondaryButtonText?.trim() || template.heroSecondaryButton || t.hero.secondaryCta;

  const primaryHref = hero?.primaryButtonLink?.trim() || '#store-section';
  const secondaryHref = hero?.secondaryButtonLink?.trim() || '#works-section';

  const stats = buildStats(hero, locale, t);
  const trustItems = buildTrustItems(hero);

  const contentAlignClass = buildContentAlign(hero);
  const itemsAlignClass = buildItemsAlign(hero);
  const justifyClass = buildJustify(hero);
  const sectionHeightClass = buildSectionHeight(hero);
  const containerWidthClass = buildContainerWidth(hero);

  const backgroundStyle = buildBackgroundStyle(hero, colors);

  const overlayColor = hero?.overlayColor || '#000000';
  const overlayOpacity = 0;

  const sectionId = hero?.sectionId?.trim() || 'hero-section';

  return (
    <section id={sectionId} className={`relative overflow-hidden ${sectionHeightClass}`}>
      <div className="absolute inset-0" style={backgroundStyle} />

      {hero?.overlayEnabled && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      <div
        className="absolute top-20 right-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}0A` }}
      />
      <div
        className="absolute bottom-10 left-10 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.accent}0A` }}
      />

      <div
        className={`relative mx-auto flex ${justifyClass} px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 ${containerWidthClass} ${sectionHeightClass}`}
      >
        <div className={`mx-auto flex max-w-2xl flex-col ${itemsAlignClass} ${contentAlignClass}`}>
          {!!badgeText && (
            <div
              className="mb-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5"
              style={{
                backgroundColor: `${colors.primary}15`,
                borderColor: `${colors.primary}30`,
              }}
            >
              <Zap className="h-3 w-3" style={{ color: colors.primary }} />
              <span className="text-[11px] font-semibold" style={{ color: colors.primary }}>
                {badgeText}
              </span>
            </div>
          )}

          {!!overlineText && (
            <p
              className="mb-3 text-xs font-bold tracking-[0.22em] uppercase"
              style={{ color: `${colors.text}80` }}
            >
              {overlineText}
            </p>
          )}

          <h1
            className="mb-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl"
            style={{ ...headingStyle, color: colors.text }}
          >
            {titleParts.first}
            {titleParts.second ? (
              <>
                <br />
                <span style={{ color: colors.primary }}>{titleParts.second}</span>
              </>
            ) : null}
          </h1>

          {!!subtitleText && subtitleText !== storeDescription && (
            <p
              className="mb-3 text-sm font-semibold sm:text-base"
              style={{ color: `${colors.text}CC` }}
            >
              {subtitleText}
            </p>
          )}

          {!!storeDescription && (
            <p
              className="mx-auto mb-8 max-w-md text-sm leading-relaxed sm:text-base"
              style={{
                color: `${colors.text}99`,
                marginInline:
                  hero?.contentAlign === 'left'
                    ? '0'
                    : hero?.contentAlign === 'right'
                      ? '0 0 0 auto'
                      : 'auto',
              }}
            >
              {storeDescription}
            </p>
          )}

          {hero?.showButtons !== false && (
            <div
              className={`flex w-full flex-col gap-3 sm:w-auto sm:flex-row ${
                hero?.contentAlign === 'left'
                  ? 'justify-start'
                  : hero?.contentAlign === 'right'
                    ? 'justify-end'
                    : 'justify-center'
              }`}
            >
              {!!primaryCtaText && (
                <a
                  href={primaryHref}
                  className="w-full rounded-2xl px-8 py-3.5 text-center text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] sm:w-auto"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 10px 25px -5px ${colors.primary}40`,
                  }}
                >
                  {primaryCtaText}
                </a>
              )}

              {!!secondaryCtaText && (
                <a
                  href={secondaryHref}
                  className="border-border bg-card text-foreground hover:bg-muted w-full rounded-2xl border px-8 py-3.5 text-center text-sm font-bold transition-colors sm:w-auto"
                >
                  {secondaryCtaText}
                </a>
              )}
            </div>
          )}

          {!!trustText && (
            <p
              className="mt-5 text-xs font-semibold sm:text-sm"
              style={{ color: `${colors.text}B3` }}
            >
              {trustText}
            </p>
          )}

          {hero?.showTrustItems && trustItems.length > 0 && (
            <div
              className={`mt-5 flex flex-wrap gap-2 ${
                hero?.contentAlign === 'left'
                  ? 'justify-start'
                  : hero?.contentAlign === 'right'
                    ? 'justify-end'
                    : 'justify-center'
              }`}
            >
              {trustItems.map(item => (
                <div
                  key={item.id}
                  className="bg-card/70 border-border/60 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs"
                  style={{ color: `${colors.text}CC` }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {hero?.showStats !== false && stats.length > 0 && (
            <div
              className={`mt-12 flex flex-wrap gap-8 ${
                hero?.contentAlign === 'left'
                  ? 'justify-start'
                  : hero?.contentAlign === 'right'
                    ? 'justify-end'
                    : 'justify-center'
              }`}
            >
              {stats.map(stat => (
                <div key={stat.key} className="text-center">
                  <p
                    className="text-xl font-extrabold sm:text-2xl"
                    style={{ ...headingStyle, color: colors.text }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-0.5 text-[10px] sm:text-xs"
                    style={{ color: `${colors.text}66` }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!!smallNote && (
            <p className="mt-6 text-[11px] sm:text-xs" style={{ color: `${colors.text}70` }}>
              {smallNote}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 opacity-40">
        <ArrowDown className="text-muted-foreground h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}
