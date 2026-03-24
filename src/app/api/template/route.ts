// src/app/api/template/route.ts
// GET  /api/template?storeId=xxx  — returns full template with all relations.
//                                   Returns default values if no template exists (does NOT auto-create).
// POST /api/template              — upserts scalar fields for the StoreTemplate.
//                                   Does NOT handle relation arrays.

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

// ── shared ownership guard ────────────────────────────────────────────────────

async function verifyStoreOwnership(storeId: string, userEmail: string): Promise<boolean> {
  const storeUser = await prisma.storeUser.findFirst({
    where: {
      storeId,
      user: { email: userEmail },
    },
  });
  return !!storeUser;
}

type HeroButtonActionType = 'scroll' | 'url' | 'whatsapp' | 'phone' | 'email' | 'none';

const HERO_BUTTON_ACTION_TYPES = new Set<HeroButtonActionType>([
  'scroll',
  'url',
  'whatsapp',
  'phone',
  'email',
  'none',
]);

function normalizeHeroButtons(raw: unknown) {
  if (!Array.isArray(raw)) return undefined;

  return raw.map((item, index) => {
    const button = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const actionType = HERO_BUTTON_ACTION_TYPES.has(button.actionType as HeroButtonActionType)
      ? (button.actionType as HeroButtonActionType)
      : 'none';
    const actionDetail = typeof button.actionDetail === 'string' ? button.actionDetail : '';

    return {
      label: typeof button.label === 'string' ? button.label : '',
      text: typeof button.text === 'string' ? button.text : '',
      actionType,
      actionTarget: actionType === 'scroll' ? actionDetail : null,
      actionUrl: actionType === 'url' ? actionDetail : null,
      actionMessage:
        actionType === 'whatsapp' || actionType === 'phone' || actionType === 'email'
          ? actionDetail
          : null,
      order: typeof button.order === 'number' ? button.order : index,
    };
  });
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');
    if (!storeId) {
      return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    }

    const owned = await verifyStoreOwnership(storeId, session.user.email);
    if (!owned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const template = await prisma.storeTemplate.findUnique({
      where: { storeId },
      include: {
        services: { orderBy: { order: 'asc' }, include: { works: { orderBy: { order: 'asc' } } } },
        works: { orderBy: { order: 'asc' } },
        testimonials: { orderBy: { order: 'asc' } },
        bannerImages: { orderBy: { order: 'asc' } },
        categorySections: { orderBy: { order: 'asc' } },
        heroButtons: { orderBy: { order: 'asc' } },
        heroSection: {
          include: {
            stats: true,
            features: true,
            trustItems: true,
          },
        },
        categoryIcons: true,
        customFonts: true,
        store: {
          include: {
            products: {
              select: {
                category: true,
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    // Return null if not found — client will use defaults
    return NextResponse.json({ template: template ?? null }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/template]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const { storeId, ...fields } = body;

    if (typeof storeId !== 'string' || !storeId) {
      return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    }

    const owned = await verifyStoreOwnership(storeId, session.user.email);
    if (!owned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const heroButtons = normalizeHeroButtons(fields.heroButtons);
    const data = {
      tagline: typeof fields.tagline === 'string' ? fields.tagline : undefined,
      heroButtonText: typeof fields.heroButtonText === 'string' ? fields.heroButtonText : undefined,
      heroSecondaryButton:
        typeof fields.heroSecondaryButton === 'string' ? fields.heroSecondaryButton : undefined,
      aboutText: typeof fields.aboutText === 'string' ? fields.aboutText : undefined,
      storeDescription:
        typeof fields.storeDescription === 'string' ? fields.storeDescription : undefined,
      ctaTitle: typeof fields.ctaTitle === 'string' ? fields.ctaTitle : undefined,
      ctaDesc: typeof fields.ctaDesc === 'string' ? fields.ctaDesc : undefined,
      ctaButton: typeof fields.ctaButton === 'string' ? fields.ctaButton : undefined,
      contactEmail: typeof fields.contactEmail === 'string' ? fields.contactEmail : undefined,
      contactWebsite: typeof fields.contactWebsite === 'string' ? fields.contactWebsite : undefined,
      whatsappNumber: typeof fields.whatsappNumber === 'string' ? fields.whatsappNumber : undefined,
      contactItems: fields.contactItems !== undefined ? fields.contactItems : undefined,
      headingFont: typeof fields.headingFont === 'string' ? fields.headingFont : undefined,
      bodyFont: typeof fields.bodyFont === 'string' ? fields.bodyFont : undefined,
      selectedPreset: typeof fields.selectedPreset === 'number' ? fields.selectedPreset : undefined,
      useCustomColors:
        typeof fields.useCustomColors === 'boolean' ? fields.useCustomColors : undefined,
      colorPrimary: typeof fields.colorPrimary === 'string' ? fields.colorPrimary : undefined,
      colorAccent: typeof fields.colorAccent === 'string' ? fields.colorAccent : undefined,
      colorBg: typeof fields.colorBg === 'string' ? fields.colorBg : undefined,
      colorText: typeof fields.colorText === 'string' ? fields.colorText : undefined,
      categoryDisplayMode:
        typeof fields.categoryDisplayMode === 'string' ? fields.categoryDisplayMode : undefined,
      isDraft: typeof fields.isDraft === 'boolean' ? fields.isDraft : undefined,
      announcementBar: fields.announcementBar !== undefined ? fields.announcementBar : undefined,
      sectionsConfig: fields.sectionsConfig !== undefined ? fields.sectionsConfig : undefined,
    };

    // Remove undefined keys so Prisma doesn't overwrite with undefined
    const cleanData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
    const createData = {
      storeId,
      ...cleanData,
      ...(heroButtons !== undefined ? { heroButtons: { create: heroButtons } } : {}),
    };
    const updateData = {
      ...cleanData,
      ...(heroButtons !== undefined
        ? {
            heroButtons: {
              deleteMany: {},
              create: heroButtons,
            },
          }
        : {}),
    };

    const updated = await prisma.storeTemplate.upsert({
      where: { storeId },
      create: createData,
      update: updateData,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('[POST /api/template]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}
