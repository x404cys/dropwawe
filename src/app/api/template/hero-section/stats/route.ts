import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

// ─── /api/template/hero-section/stats ────────────────────────────────────────
// PUT  → full sync of stats list for a hero section
// Uses upsert-per-item + orphan cleanup (never deletes then recreates all)

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

type StatItem = {
  id?: string;
  label: string;
  value: string;
  icon?: string;
  order: number;
  enabled: boolean;
};

type StatsPayload = {
  storeId: string;
  stats: StatItem[];
};

async function getHeroId(storeId: string): Promise<string | null> {
  const template = await prisma.storeTemplate.findUnique({
    where: { storeId },
    select: {
      heroSection: { select: { id: true } },
    },
  });
  return template?.heroSection?.id ?? null;
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as StatsPayload;

    if (!body.storeId) {
      return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    }

    const heroId = await getHeroId(body.storeId);
    if (!heroId) {
      return NextResponse.json(
        { error: 'يجب حفظ الهيرو سكشن أولاً قبل حفظ الإحصائيات' },
        { status: 404 }
      );
    }

    const stats = body.stats ?? [];

    // IDs that came from the DB (not client-generated)
    const persistedIds = stats.filter(s => s.id && !s.id.startsWith('stat_')).map(s => s.id!);

    // Delete only orphaned rows (no longer in the list)
    await prisma.templateHeroStat.deleteMany({
      where: {
        heroId,
        ...(persistedIds.length > 0 ? { id: { notIn: persistedIds } } : {}),
      },
    });

    // Upsert each item
    const saved = await Promise.all(
      stats.map(item => {
        const isNew = !item.id || item.id.startsWith('stat_');
        const data = {
          heroId,
          label: item.label,
          value: item.value,
          icon: normalizeString(item.icon),
          order: item.order,
          enabled: item.enabled,
        };

        if (isNew) {
          return prisma.templateHeroStat.create({ data });
        }

        return prisma.templateHeroStat.upsert({
          where: { id: item.id },
          create: data,
          update: data,
        });
      })
    );

    return NextResponse.json(saved);
  } catch (error) {
    console.error('PUT /api/template/hero-section/stats error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
