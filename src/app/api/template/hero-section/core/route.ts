import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

// ─── PUT /api/template/hero-section/core ─────────────────────────────────────
// Saves ONLY the scalar fields of the hero section.
// Does NOT touch stats / features / trustItems at all.

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

type CorePayload = {
  storeId: string;

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
};

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as CorePayload;

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

    const data = {
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
    };

    const hero = await prisma.templateHeroSection.upsert({
      where: { templateId: template.id },
      create: { templateId: template.id, ...data },
      update: data,
      select: { id: true },
    });

    return NextResponse.json({ id: hero.id });
  } catch (error) {
    console.error('PUT /api/template/hero-section/core error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
