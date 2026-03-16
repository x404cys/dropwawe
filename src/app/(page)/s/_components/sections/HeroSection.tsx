'use client';

import Image from 'next/image';
import { ArrowDownRight } from 'lucide-react';
import {
  ActiveColors,
  StorefrontHeroSection,
  StorefrontStore,
  StorefrontTemplate,
} from '../../_lib/types';
import { getIconComponent } from '../../_utils/icons';

interface HeroSectionProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

function getTextAlignClass(hero: StorefrontHeroSection | null | undefined) {
  switch (hero?.contentAlign) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
}

function getItemsClass(hero: StorefrontHeroSection | null | undefined) {
  switch (hero?.contentAlign) {
    case 'left':
      return 'items-start';
    case 'right':
      return 'items-end';
    default:
      return 'items-center';
  }
}

function getJustifyClass(hero: StorefrontHeroSection | null | undefined) {
  switch (hero?.contentPosition) {
    case 'start':
      return 'justify-start';
    case 'end':
      return 'justify-end';
    default:
      return 'justify-center';
  }
}

function getMinHeight(hero: StorefrontHeroSection | null | undefined) {
  switch (hero?.sectionHeight) {
    case 'sm':
      return '60vh';
    case 'md':
      return '70vh';
    case 'lg':
      return '80vh';
    case 'xl':
      return '90vh';
    case 'screen':
      return '100vh';
    default:
      return undefined;
  }
}

function getBackgroundStyle(
  hero: StorefrontHeroSection | null | undefined,
  colors: ActiveColors
): React.CSSProperties {
  if (!hero) {
    return { backgroundColor: colors.bg };
  }

  const imageSource =
    hero.backgroundImage || hero.backgroundImageMobile || hero.heroImage || hero.heroImageMobile;

  if (hero.backgroundType === 'IMAGE' && imageSource) {
    return {
      backgroundImage: `url(${imageSource})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  if (hero.backgroundType === 'VIDEO' && (hero.heroVideoPoster || imageSource)) {
    return {
      backgroundImage: `url(${hero.heroVideoPoster || imageSource})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  if (hero.backgroundType === 'GRADIENT') {
    const from = hero.backgroundGradientFrom || colors.bg;
    const via = hero.backgroundGradientVia || colors.bg;
    const to = hero.backgroundGradientTo || colors.bg;

    return {
      background: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
    };
  }

  if (hero.backgroundType === 'COLOR' && hero.backgroundColor) {
    return {
      backgroundColor: hero.backgroundColor,
    };
  }

  return { backgroundColor: colors.bg };
}

function getContentWidth(hero: StorefrontHeroSection | null | undefined) {
  return hero?.contentMaxWidth?.trim() || '42rem';
}

function getMediaSource(hero: StorefrontHeroSection | null | undefined) {
  return hero?.heroImage || hero?.heroImageMobile || null;
}

function getMediaAlt(hero: StorefrontHeroSection | null | undefined, fallback: string) {
  return hero?.heroImageAlt?.trim() || fallback;
}

function getLayout(hero: StorefrontHeroSection | null | undefined) {
  return hero?.layout || 'SPLIT';
}

export default function HeroSection({ store, template, colors, headingStyle }: HeroSectionProps) {
  const hero = template.heroSection;

  if (hero && (!hero.enabled || hero.visible === false)) {
    return null;
  }

  const layout = getLayout(hero);
  const sectionId = hero?.sectionId?.trim() || 'hero-section';
  const badgeText = hero?.showBadge === false ? null : hero?.badgeText?.trim() || null;
  const overlineText = hero?.overline?.trim() || template.tagline?.trim() || null;
  const titleText = hero?.title?.trim() || store.name?.trim() || null;
  const subtitleText = hero?.subtitle?.trim() || null;
  const descriptionText =
    hero?.description?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    null;
  const primaryText = hero?.primaryButtonText?.trim() || template.heroButtonText?.trim() || null;
  const secondaryText =
    hero?.secondaryButtonText?.trim() || template.heroSecondaryButton?.trim() || null;
  const primaryHref = hero?.primaryButtonLink?.trim() || '#store-section';
  const secondaryHref = hero?.secondaryButtonLink?.trim() || '#about-section';
  const stats = (hero?.stats ?? []).filter(stat => stat.enabled && stat.label && stat.value);
  const features = (hero?.features ?? []).filter(feature => feature.enabled && feature.title);
  const trustItems = (hero?.trustItems ?? []).filter(item => item.enabled && item.text);
  const mediaSrc = getMediaSource(hero);
  const minHeight = getMinHeight(hero);
  const textAlignClass = getTextAlignClass(hero);
  const itemsClass = getItemsClass(hero);
  const justifyClass = getJustifyClass(hero);
  const sectionStyle = getBackgroundStyle(hero, colors);
  const overlayOpacity = Math.max(0, Math.min(hero?.overlayOpacity ?? 0, 100)) / 100;
  const mediaAlt = getMediaAlt(hero, titleText || store.name || 'Store hero image');

  const renderButtons = hero?.showButtons !== false && (primaryText || secondaryText);

  const renderContent = (isFullscreen = false) => (
    <div
      className={`flex flex-col ${itemsClass} ${textAlignClass}`}
      style={{ maxWidth: getContentWidth(hero) }}
    >
      {badgeText ? (
        <span
          // REDESIGN: turn the hero badge into a restrained typographic marker.
          className="mb-6 border border-white/10 px-4 py-2 text-[10px] font-light tracking-[0.32em] uppercase opacity-80"
          style={{ color: colors.text }}
        >
          {badgeText}
        </span>
      ) : null}

      {overlineText ? (
        <p
          className="mb-6 text-xs font-light tracking-[0.34em] uppercase opacity-50"
          style={{ color: colors.text }}
        >
          {overlineText}
        </p>
      ) : null}

      {titleText ? (
        <h1
          // REDESIGN: use thin monumental typography instead of decorative split gradients.
          className="text-5xl font-thin tracking-tight text-balance sm:text-6xl lg:text-8xl"
          style={{ ...headingStyle, color: colors.text }}
        >
          {titleText}
        </h1>
      ) : null}

      {subtitleText ? (
        <p
          className="mt-6 text-sm font-light tracking-[0.18em] uppercase opacity-60"
          style={{ color: colors.text }}
        >
          {subtitleText}
        </p>
      ) : null}

      {descriptionText ? (
        <p
          className="mt-6 max-w-xl text-sm leading-relaxed font-light opacity-70 lg:text-base"
          style={{ color: colors.text }}
        >
          {descriptionText}
        </p>
      ) : null}

      {renderButtons ? (
        <div
          // REDESIGN: shift CTAs to outlined luxury controls with accent fill on hover only.
          className={`mt-10 flex flex-wrap gap-4 ${isFullscreen ? 'items-end' : ''}`}
        >
          {primaryText ? (
            <a
              href={primaryHref}
              className="border px-8 py-3 text-xs font-light tracking-[0.28em] uppercase transition-colors duration-200 hover:opacity-100"
              style={{ color: colors.text, borderColor: colors.text }}
              onMouseEnter={event => {
                event.currentTarget.style.backgroundColor = colors.accent;
                event.currentTarget.style.borderColor = colors.accent;
                event.currentTarget.style.color = colors.bg;
              }}
              onMouseLeave={event => {
                event.currentTarget.style.backgroundColor = 'transparent';
                event.currentTarget.style.borderColor = colors.text;
                event.currentTarget.style.color = colors.text;
              }}
            >
              {primaryText}
            </a>
          ) : null}

          {secondaryText ? (
            <a
              href={secondaryHref}
              className="inline-flex items-center gap-2 text-xs font-light tracking-[0.28em] uppercase opacity-60 transition-opacity duration-200 hover:opacity-100"
              style={{ color: colors.text }}
            >
              <span>{secondaryText}</span>
              <ArrowDownRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      ) : null}

      {hero?.showStats && stats.length > 0 ? (
        <div
          // REDESIGN: stats become a flat typographic row with no cards or counters.
          className="mt-14 grid w-full gap-8 border-t border-white/10 pt-8 sm:grid-cols-2 xl:grid-cols-3"
        >
          {stats.map(stat => (
            <div key={stat.id}>
              <p
                className="text-3xl font-thin tracking-tight lg:text-4xl"
                style={{ ...headingStyle, color: colors.text }}
              >
                {stat.value}
              </p>
              <p
                className="mt-2 text-[10px] font-light tracking-[0.28em] uppercase opacity-50"
                style={{ color: colors.text }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {hero?.showTrustItems && trustItems.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {trustItems.map(item => (
            <span
              key={item.id}
              className="text-xs font-light tracking-[0.18em] uppercase opacity-55"
              style={{ color: colors.text }}
            >
              {item.text}
            </span>
          ))}
        </div>
      ) : null}

      {hero?.showFeatures && features.length > 0 ? (
        <div className="mt-14 grid w-full gap-px border border-white/10 bg-white/10 md:grid-cols-2">
          {features.map(feature => {
            const FeatureIcon = feature.icon ? getIconComponent(feature.icon) : null;

            return (
              <a
                key={feature.id}
                href={feature.link || undefined}
                className="group bg-white/[0.02] p-6 transition-colors duration-200 hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-4">
                  {feature.image ? (
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-12 w-12 object-cover"
                    />
                  ) : FeatureIcon ? (
                    <FeatureIcon
                      className="mt-1 h-4 w-4 shrink-0 opacity-60"
                      style={{ color: colors.text }}
                    />
                  ) : null}

                  <div>
                    <p
                      className="text-sm font-light tracking-[0.08em]"
                      style={{ color: colors.text }}
                    >
                      {feature.title}
                    </p>
                    {feature.desc ? (
                      <p
                        className="mt-2 text-xs leading-relaxed font-light opacity-60"
                        style={{ color: colors.text }}
                      >
                        {feature.desc}
                      </p>
                    ) : null}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  const renderMedia = () => {
    if (!mediaSrc || layout === 'MINIMAL' || layout === 'CENTERED' || layout === 'FULLSCREEN') {
      return null;
    }

    return (
      <div className="relative lg:col-span-6">
        <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-white/[0.03]">
          <Image
            // REDESIGN: hero media is full-bleed and unrounded to keep the editorial look.
            src={mediaSrc}
            alt={mediaAlt}
            fill
            className="object-cover"
          />
        </div>
      </div>
    );
  };

  if (layout === 'FULLSCREEN') {
    return (
      <section
        id={sectionId}
        className="relative overflow-hidden border-b border-white/5"
        style={{ minHeight: minHeight || '100vh', backgroundColor: colors.bg }}
      >
        <div className="absolute inset-0" style={sectionStyle} />

        {hero?.overlayEnabled ? (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: hero.overlayColor || colors.bg, opacity: overlayOpacity }}
          />
        ) : null}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-end px-6 py-20 lg:px-12 lg:py-24">
          {renderContent(true)}
        </div>
      </section>
    );
  }

  if (layout === 'CENTERED') {
    return (
      <section
        id={sectionId}
        className="relative overflow-hidden border-b border-white/5"
        style={{ ...sectionStyle, minHeight }}
      >
        {hero?.overlayEnabled ? (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: hero.overlayColor || colors.bg, opacity: overlayOpacity }}
          />
        ) : null}

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="flex min-h-[60vh] items-center justify-center">{renderContent()}</div>
        </div>
      </section>
    );
  }

  if (layout === 'MINIMAL') {
    return (
      <section
        id={sectionId}
        className="relative overflow-hidden border-b border-white/5"
        style={{ ...sectionStyle, minHeight }}
      >
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          {renderContent()}
        </div>
      </section>
    );
  }

  const mediaFirst = layout === 'IMAGE_LEFT';

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden border-b border-white/5"
      style={{ ...sectionStyle, minHeight }}
    >
      {hero?.overlayEnabled ? (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: hero.overlayColor || colors.bg, opacity: overlayOpacity }}
        />
      ) : null}

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div
          // REDESIGN: move split heroes to a sparse editorial grid with image bleed and generous space.
          className={`grid items-center gap-12 lg:grid-cols-12 lg:gap-16 ${minHeight ? '' : 'min-h-[70vh]'}`}
          style={minHeight ? { minHeight } : undefined}
        >
          {mediaFirst ? renderMedia() : null}

          <div
            className={`lg:col-span-6 ${layout === 'SPLIT' || layout === 'IMAGE_RIGHT' ? '' : ''} flex ${justifyClass}`}
          >
            {renderContent()}
          </div>

          {!mediaFirst ? renderMedia() : null}
        </div>
      </div>
    </section>
  );
}
