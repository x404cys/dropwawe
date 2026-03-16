import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

// ─── /api/template/hero-section/features ─────────────────────────────────────
// PUT → full sync of features list. Isolated from all other sections.

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

type FeatureItem = {
  id?: string;
  title: string;
  desc?: string;
  icon?: string;
  image?: string | null;
  link?: string;
  order: number;
  enabled: boolean;
};

type FeaturesPayload = {
  storeId: string;
  features: FeatureItem[];
};

async function getHeroId(storeId: string): Promise<string | null> {
  const template = await prisma.storeTemplate.findUnique({
    where: { storeId },
    select: { heroSection: { select: { id: true } } },
  });
  return template?.heroSection?.id ?? null;
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as FeaturesPayload;

    if (!body.storeId) {
      return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    }

    const heroId = await getHeroId(body.storeId);
    if (!heroId) {
      return NextResponse.json(
        { error: 'يجب حفظ الهيرو سكشن أولاً قبل حفظ المميزات' },
        { status: 404 }
      );
    }

    const features = body.features ?? [];
    const persistedIds = features.filter(f => f.id && !f.id.startsWith('feature_')).map(f => f.id!);

    await prisma.templateHeroFeature.deleteMany({
      where: {
        heroId,
        ...(persistedIds.length > 0 ? { id: { notIn: persistedIds } } : {}),
      },
    });

    const saved = await Promise.all(
      features.map(item => {
        const isNew = !item.id || item.id.startsWith('feature_');
        const data = {
          heroId,
          title: item.title,
          desc: normalizeString(item.desc),
          icon: normalizeString(item.icon),
          image: item.image ?? null,
          link: normalizeString(item.link),
          order: item.order,
          enabled: item.enabled,
        };

        if (isNew) return prisma.templateHeroFeature.create({ data });

        return prisma.templateHeroFeature.upsert({
          where: { id: item.id },
          create: data,
          update: data,
        });
      })
    );

    return NextResponse.json(saved);
  } catch (error) {
    console.error('PUT /api/template/hero-section/features error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
