import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

type HeroStatInput = {
  id?: string;
  label: string;
  value: string;
  icon?: string;
  order: number;
  enabled: boolean;
};

type HeroFeatureInput = {
  id?: string;
  title: string;
  desc?: string;
  icon?: string;
  image?: string | null;
  link?: string;
  order: number;
  enabled: boolean;
};

type HeroTrustInput = {
  id?: string;
  text: string;
  icon?: string;
  order: number;
  enabled: boolean;
};

type HeroSectionPayload = {
  storeId: string;

  id?: string;
  enabled: boolean;
  visible: boolean;
  order: number;

  badgeText?: string;
  badgeIcon?: string;
  overline?: string;
  title?: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;

  trustText?: string;
  smallNote?: string;

  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonIcon?: string;

  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonIcon?: string;

  heroImage?: string | null;
  heroImageAlt?: string;
  heroImageMobile?: string | null;

  backgroundType: string;
  backgroundImage?: string | null;
  backgroundImageMobile?: string | null;
  backgroundColor?: string;
  backgroundGradientFrom?: string;
  backgroundGradientVia?: string;
  backgroundGradientTo?: string;

  overlayEnabled: boolean;
  overlayColor?: string;
  overlayOpacity: number;

  layout: string;
  contentAlign: string;
  contentPosition: string;
  mediaPosition: string;

  contentMaxWidth?: string;
  sectionHeight?: string;
  containerStyle?: string;
  verticalPadding?: string;

  showButtons: boolean;
  showStats: boolean;
  showFeatures: boolean;
  showTrustItems: boolean;

  roundedMedia: boolean;
  glassEffect: boolean;
  blurBackground: boolean;
  shadowMedia: boolean;
  borderMedia: boolean;

  promoText?: string;
  promoEndsAt?: string | null;
  urgencyText?: string;

  ariaLabel?: string;
  sectionId?: string;

  stats: HeroStatInput[];
  features: HeroFeatureInput[];
  trustItems: HeroTrustInput[];
};

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as HeroSectionPayload;

    if (!body.storeId) {
      return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    }

    const template = await prisma.storeTemplate.findUnique({
      where: { storeId: body.storeId },
      select: { id: true },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'لم يتم العثور على StoreTemplate لهذا المتجر' },
        { status: 404 }
      );
    }

    const savedHero = await prisma.templateHeroSection.upsert({
      where: {
        templateId: template.id,
      },
      create: {
        templateId: template.id,

        enabled: body.enabled,
        visible: body.visible,
        order: body.order,

        badgeText: normalizeString(body.badgeText),
        badgeIcon: normalizeString(body.badgeIcon),
        overline: normalizeString(body.overline),
        title: normalizeString(body.title),
        highlightText: normalizeString(body.highlightText),
        subtitle: normalizeString(body.subtitle),
        description: normalizeString(body.description),

        trustText: normalizeString(body.trustText),
        smallNote: normalizeString(body.smallNote),

        primaryButtonText: normalizeString(body.primaryButtonText),
        primaryButtonLink: normalizeString(body.primaryButtonLink),
        primaryButtonIcon: normalizeString(body.primaryButtonIcon),

        secondaryButtonText: normalizeString(body.secondaryButtonText),
        secondaryButtonLink: normalizeString(body.secondaryButtonLink),
        secondaryButtonIcon: normalizeString(body.secondaryButtonIcon),

        heroImage: body.heroImage ?? null,
        heroImageAlt: normalizeString(body.heroImageAlt),
        heroImageMobile: body.heroImageMobile ?? null,

        backgroundType: body.backgroundType,
        backgroundImage: body.backgroundImage ?? null,
        backgroundImageMobile: body.backgroundImageMobile ?? null,
        backgroundColor: normalizeString(body.backgroundColor),
        backgroundGradientFrom: normalizeString(body.backgroundGradientFrom),
        backgroundGradientVia: normalizeString(body.backgroundGradientVia),
        backgroundGradientTo: normalizeString(body.backgroundGradientTo),

        overlayEnabled: body.overlayEnabled,
        overlayColor: normalizeString(body.overlayColor),
        overlayOpacity: body.overlayOpacity,

        layout: body.layout,
        contentAlign: body.contentAlign,
        contentPosition: body.contentPosition,
        mediaPosition: body.mediaPosition,

        contentMaxWidth: normalizeString(body.contentMaxWidth),
        sectionHeight: normalizeString(body.sectionHeight),
        containerStyle: normalizeString(body.containerStyle),
        verticalPadding: normalizeString(body.verticalPadding),

        showButtons: body.showButtons,
        showStats: body.showStats,
        showFeatures: body.showFeatures,
        showTrustItems: body.showTrustItems,

        roundedMedia: body.roundedMedia,
        glassEffect: body.glassEffect,
        blurBackground: body.blurBackground,
        shadowMedia: body.shadowMedia,
        borderMedia: body.borderMedia,

        promoText: normalizeString(body.promoText),
        promoEndsAt: body.promoEndsAt ? new Date(body.promoEndsAt) : null,
        urgencyText: normalizeString(body.urgencyText),

        ariaLabel: normalizeString(body.ariaLabel),
        sectionId: normalizeString(body.sectionId),
      },
      update: {
        enabled: body.enabled,
        visible: body.visible,
        order: body.order,

        badgeText: normalizeString(body.badgeText),
        badgeIcon: normalizeString(body.badgeIcon),
        overline: normalizeString(body.overline),
        title: normalizeString(body.title),
        highlightText: normalizeString(body.highlightText),
        subtitle: normalizeString(body.subtitle),
        description: normalizeString(body.description),

        trustText: normalizeString(body.trustText),
        smallNote: normalizeString(body.smallNote),

        primaryButtonText: normalizeString(body.primaryButtonText),
        primaryButtonLink: normalizeString(body.primaryButtonLink),
        primaryButtonIcon: normalizeString(body.primaryButtonIcon),

        secondaryButtonText: normalizeString(body.secondaryButtonText),
        secondaryButtonLink: normalizeString(body.secondaryButtonLink),
        secondaryButtonIcon: normalizeString(body.secondaryButtonIcon),

        heroImage: body.heroImage ?? null,
        heroImageAlt: normalizeString(body.heroImageAlt),
        heroImageMobile: body.heroImageMobile ?? null,

        backgroundType: body.backgroundType,
        backgroundImage: body.backgroundImage ?? null,
        backgroundImageMobile: body.backgroundImageMobile ?? null,
        backgroundColor: normalizeString(body.backgroundColor),
        backgroundGradientFrom: normalizeString(body.backgroundGradientFrom),
        backgroundGradientVia: normalizeString(body.backgroundGradientVia),
        backgroundGradientTo: normalizeString(body.backgroundGradientTo),

        overlayEnabled: body.overlayEnabled,
        overlayColor: normalizeString(body.overlayColor),
        overlayOpacity: body.overlayOpacity,

        layout: body.layout,
        contentAlign: body.contentAlign,
        contentPosition: body.contentPosition,
        mediaPosition: body.mediaPosition,

        contentMaxWidth: normalizeString(body.contentMaxWidth),
        sectionHeight: normalizeString(body.sectionHeight),
        containerStyle: normalizeString(body.containerStyle),
        verticalPadding: normalizeString(body.verticalPadding),

        showButtons: body.showButtons,
        showStats: body.showStats,
        showFeatures: body.showFeatures,
        showTrustItems: body.showTrustItems,

        roundedMedia: body.roundedMedia,
        glassEffect: body.glassEffect,
        blurBackground: body.blurBackground,
        shadowMedia: body.shadowMedia,
        borderMedia: body.borderMedia,

        promoText: normalizeString(body.promoText),
        promoEndsAt: body.promoEndsAt ? new Date(body.promoEndsAt) : null,
        urgencyText: normalizeString(body.urgencyText),

        ariaLabel: normalizeString(body.ariaLabel),
        sectionId: normalizeString(body.sectionId),
      },
      select: { id: true },
    });

    await prisma.templateHeroStat.deleteMany({
      where: { heroId: savedHero.id },
    });

    await prisma.templateHeroFeature.deleteMany({
      where: { heroId: savedHero.id },
    });

    await prisma.templateHeroTrustItem.deleteMany({
      where: { heroId: savedHero.id },
    });

    if (body.stats?.length) {
      await prisma.templateHeroStat.createMany({
        data: body.stats.map(item => ({
          heroId: savedHero.id,
          label: item.label,
          value: item.value,
          icon: normalizeString(item.icon),
          order: item.order,
          enabled: item.enabled,
        })),
      });
    }

    if (body.features?.length) {
      await prisma.templateHeroFeature.createMany({
        data: body.features.map(item => ({
          heroId: savedHero.id,
          title: item.title,
          desc: normalizeString(item.desc),
          icon: normalizeString(item.icon),
          image: item.image ?? null,
          link: normalizeString(item.link),
          order: item.order,
          enabled: item.enabled,
        })),
      });
    }

    if (body.trustItems?.length) {
      await prisma.templateHeroTrustItem.createMany({
        data: body.trustItems.map(item => ({
          heroId: savedHero.id,
          text: item.text,
          icon: normalizeString(item.icon),
          order: item.order,
          enabled: item.enabled,
        })),
      });
    }

    const hero = await prisma.templateHeroSection.findUnique({
      where: { id: savedHero.id },
      include: {
        stats: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
        trustItems: { orderBy: { order: 'asc' } },
      },
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error('PUT /api/template/hero-section error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء حفظ الهيرو',
      },
      { status: 500 }
    );
  }
}
