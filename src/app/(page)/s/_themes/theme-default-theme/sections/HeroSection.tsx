'use client';

import type { HeroSectionProps, StorefrontHeroButton } from '../../../_lib/types';

type LegacyTemplateHeroButtons = HeroSectionProps['template'] & {
  heroButtons?: StorefrontHeroButton[];
};

type MinimalHeroSection = Pick<
  NonNullable<HeroSectionProps['template']['heroSection']>,
  'title' | 'highlightText' | 'subtitle' | 'description' | 'heroButtons'
>;

function getHeroContent(template: HeroSectionProps['template']): MinimalHeroSection | null {
  const hero = template.heroSection;
  const legacyHeroButtons = (template as LegacyTemplateHeroButtons).heroButtons ?? [];

  if (!hero && legacyHeroButtons.length === 0) return null;

  return {
    title: hero?.title ?? null,
    highlightText: hero?.highlightText ?? null,
    subtitle: hero?.subtitle ?? null,
    description: hero?.description ?? null,
    heroButtons: hero?.heroButtons?.length ? hero.heroButtons : legacyHeroButtons,
  };
}

function sortButtons(buttons: StorefrontHeroButton[] | undefined) {
  return [...(buttons ?? [])]
    .sort((left, right) => left.order - right.order)
    .filter(button => {
      const label = typeof button.label === 'string' ? button.label.trim() : '';
      const text = typeof button.text === 'string' ? button.text.trim() : '';
      return label.length > 0 || text.length > 0;
    });
}

function getButtonLabel(button: StorefrontHeroButton) {
  const text = typeof button.text === 'string' ? button.text.trim() : '';
  const label = typeof button.label === 'string' ? button.label.trim() : '';
  return text || label;
}

function getButtonHref(button: StorefrontHeroButton) {
  const actionType = typeof button.actionType === 'string' ? button.actionType : 'none';
  const actionTarget = typeof button.actionTarget === 'string' ? button.actionTarget.trim() : '';
  const actionUrl = typeof button.actionUrl === 'string' ? button.actionUrl.trim() : '';
  const actionMessage = typeof button.actionMessage === 'string' ? button.actionMessage.trim() : '';

  switch (actionType) {
    case 'scroll':
      return `#${(actionTarget || 'store-section').replace(/^#/, '')}`;
    case 'url':
      return actionUrl || '#';
    case 'phone':
      return actionMessage ? `tel:${actionMessage}` : '#';
    case 'email':
      return actionMessage ? `mailto:${actionMessage}` : '#';
    case 'whatsapp':
      return actionMessage
        ? `https://wa.me/?text=${encodeURIComponent(actionMessage)}`
        : 'https://wa.me/';
    default:
      return '#';
  }
}

function shouldOpenInNewTab(button: StorefrontHeroButton) {
  const actionUrl = typeof button.actionUrl === 'string' ? button.actionUrl.trim() : '';
  return button.actionType === 'url' && /^https?:\/\//i.test(actionUrl);
}

export default function DefaultThemeHeroSection({
  store,
  template,
  colors,
  fonts,
}: HeroSectionProps) {
  const hero = getHeroContent(template);
  const title = hero?.title?.trim() || store.name?.trim() || '';
  const highlightText = hero?.highlightText?.trim() || '';
  const subtitle = hero?.subtitle?.trim() || '';
  const description =
    hero?.description?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const buttons = sortButtons(hero?.heroButtons);

  if (!title && !highlightText && !subtitle && !description && buttons.length === 0) {
    return null;
  }

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${colors.bg}, #ffffff)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.accent}18` }}
        />
        <div
          className="absolute top-12 right-8 h-40 w-40 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.primary}12` }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {subtitle ? (
            <p
              className="mb-4 text-sm leading-relaxed font-medium tracking-[0.2em] uppercase sm:text-base"
              style={{ color: `${colors.text}99`, fontFamily: fonts.body }}
            >
              {subtitle?.split(' ').map((word, index) => (
                <span key={index}>
                  {word} {(index + 1) % 2 === 0 && <br />}
                </span>
              ))}
            </p>
          ) : null}
          {title || highlightText ? (
            <h1
              className="text-4xl leading-[0.95] font-black tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: colors.text, fontFamily: fonts.heading }}
            >
              {title?.split(' ').map((word, index) => (
                <span key={index}>
                  <span
                    style={{
                      color: index < 2 ? colors.primary : colors.text,
                    }}
                  >
                    {word}
                  </span>{' '}
                  {index === 1 && <br />}
                </span>
              ))}
              {highlightText ? (
                <span className="mt-2 block" style={{ color: colors.accent }}>
                  {highlightText}
                </span>
              ) : null}
            </h1>
          ) : null}
          {description ? (
            <p
              className="mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-xl"
              style={{ color: `${colors.text}B3`, fontFamily: fonts.body }}
            >
              {description}
            </p>
          ) : null}

          {buttons.length > 0 ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {buttons.map((button, index) => {
                const href = getButtonHref(button);
                const label = getButtonLabel(button);
                const openInNewTab = shouldOpenInNewTab(button);

                return (
                  <a
                    key={`${button.label}-${button.order}`}
                    href={href}
                    target={openInNewTab ? '_blank' : undefined}
                    rel={openInNewTab ? 'noopener noreferrer' : undefined}
                    className={`inline-flex min-w-[160px] items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:text-base ${
                      index === 0 ? 'text-white shadow-lg' : 'border bg-white/80 backdrop-blur'
                    }`}
                    style={
                      index === 0
                        ? {
                            background: `linear-gradient(135deg, ${colors.primary})`,
                            fontFamily: fonts.body,
                          }
                        : {
                            borderColor: `${colors.text}1F`,
                            color: colors.text,
                            fontFamily: fonts.body,
                          }
                    }
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
