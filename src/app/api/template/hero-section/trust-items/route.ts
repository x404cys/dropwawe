import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

// ─── /api/template/hero-section/trust-items ──────────────────────────────────
// PUT → full sync of trustItems list. Isolated from all other sections.

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

type TrustItem = {
  id?: string;
  text: string;
  icon?: string;
  order: number;
  enabled: boolean;
};

type TrustPayload = {
  storeId: string;
  trustItems: TrustItem[];
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
    const body = (await req.json()) as TrustPayload;

    if (!body.storeId) {
      return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    }

    const heroId = await getHeroId(body.storeId);
    if (!heroId) {
      return NextResponse.json(
        { error: 'يجب حفظ الهيرو سكشن أولاً قبل حفظ عناصر الثقة' },
        { status: 404 }
      );
    }

    const trustItems = body.trustItems ?? [];
    const persistedIds = trustItems.filter(t => t.id && !t.id.startsWith('trust_')).map(t => t.id!);

    await prisma.templateHeroTrustItem.deleteMany({
      where: {
        heroId,
        ...(persistedIds.length > 0 ? { id: { notIn: persistedIds } } : {}),
      },
    });

    const saved = await Promise.all(
      trustItems.map(item => {
        const isNew = !item.id || item.id.startsWith('trust_');
        const data = {
          heroId,
          text: item.text,
          icon: normalizeString(item.icon),
          order: item.order,
          enabled: item.enabled,
        };

        if (isNew) return prisma.templateHeroTrustItem.create({ data });

        return prisma.templateHeroTrustItem.upsert({
          where: { id: item.id },
          create: data,
          update: data,
        });
      })
    );

    return NextResponse.json(saved);
  } catch (error) {
    console.error('PUT /api/template/hero-section/trust-items error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
