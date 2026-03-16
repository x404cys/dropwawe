import type { HeroSectionItem, TemplateFormState } from '@/lib/template/types';

export function createDefaultHero(
  storeName: string,
  storeDescription: string,
  state: TemplateFormState
): HeroSectionItem {
  return {
    id: 'hero_default',
    enabled: true,
    visible: true,
    order: 0,

    badgeText: '',
    badgeIcon: '',
    overline: state.tagline || '',
    title: storeName || '',
    highlightText: '',
    subtitle: '',
    description: state.storeDescription || storeDescription || '',

    trustText: '',
    smallNote: '',

    primaryButtonText: state.heroButtonText || '',
    primaryButtonLink: '',
    primaryButtonIcon: '',

    secondaryButtonText: state.heroSecondaryButton || '',
    secondaryButtonLink: '',
    secondaryButtonIcon: '',

    heroImage: null,
    heroImageAlt: '',
    heroImageMobile: null,

    backgroundType: 'COLOR',
    backgroundImage: null,
    backgroundImageMobile: null,
    backgroundColor: '#0f172a',
    backgroundGradientFrom: '#111827',
    backgroundGradientTo: '#1d4ed8',
    backgroundGradientVia: '#0f172a',

    overlayEnabled: true,
    overlayColor: '#000000',
    overlayOpacity: 35,

    layout: 'SPLIT',
    contentAlign: 'center',
    contentPosition: 'center',
    mediaPosition: 'right',

    contentMaxWidth: '640px',
    sectionHeight: 'lg',
    containerStyle: 'boxed',
    verticalPadding: 'lg',

    showButtons: true,
    showStats: true,
    showFeatures: false,
    showTrustItems: true,

    roundedMedia: true,
    glassEffect: false,
    blurBackground: false,
    shadowMedia: true,
    borderMedia: false,

    promoText: '',
    promoEndsAt: null,
    urgencyText: '',

    ariaLabel: '',
    sectionId: 'hero',

    stats: [],
    features: [],
    trustItems: [],
  };
}
