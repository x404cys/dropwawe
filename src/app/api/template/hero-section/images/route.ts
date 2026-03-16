import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

// ─── PATCH /api/template/hero-section/images ─────────────────────────────────
// Updates ONLY the four image URL fields on the hero section.
// Completely isolated from stats / features / trustItems / scalar fields.
// Uses PATCH semantics: only keys present in the body are written.

type ImagesPayload = {
  storeId: string;
  heroImage?: string | null;
  heroImageMobile?: string | null;
  backgroundImage?: string | null;
  backgroundImageMobile?: string | null;
};

const IMAGE_FIELDS = [
  'heroImage',
  'heroImageMobile',
  'backgroundImage',
  'backgroundImageMobile',
] as const;

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as ImagesPayload;

    if (!body.storeId) {
      return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    }

    // Build a partial update with only the fields that were actually sent
    const updateData: Record<string, string | null> = {};
    for (const field of IMAGE_FIELDS) {
      if (field in body) {
        updateData[field] = body[field] ?? null;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'لم يتم إرسال أي حقل صورة' }, { status: 400 });
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

    // upsert so it works even before the first full save
    const hero = await prisma.templateHeroSection.upsert({
      where: { templateId: template.id },
      create: {
        templateId: template.id,
        // required non-nullable defaults
        enabled: true,
        visible: true,
        order: 0,
        backgroundType: 'COLOR',
        overlayEnabled: true,
        overlayOpacity: 35,
        layout: 'SPLIT',
        contentAlign: 'center',
        contentPosition: 'center',
        mediaPosition: 'right',
        showButtons: true,
        showStats: true,
        showFeatures: false,
        showTrustItems: true,
        roundedMedia: true,
        glassEffect: false,
        blurBackground: false,
        shadowMedia: true,
        borderMedia: false,
        ...updateData,
      },
      update: updateData,
      select: { id: true, ...Object.fromEntries(IMAGE_FIELDS.map(f => [f, true])) },
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error('PATCH /api/template/hero-section/images error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
