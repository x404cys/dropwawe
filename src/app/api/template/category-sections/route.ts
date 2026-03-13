// src/app/api/template/category-sections/route.ts
// POST   — create a new TemplateCategorySection
// PUT    — supports three actions:
//          { action: "update", id, category }    — update category name
//          { action: "toggle", id }              — toggle enabled flag
//          { action: "reorder", items: [{id,order}] } — batch reorder in a transaction
// DELETE — delete a TemplateCategorySection by id

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

async function verifyOwnershipByStore(storeId: string, userEmail: string): Promise<boolean> {
  const su = await prisma.storeUser.findFirst({
    where: { storeId, user: { email: userEmail } },
  });
  return !!su;
}

async function getTemplateId(storeId: string): Promise<string | null> {
  const t = await prisma.storeTemplate.findUnique({ where: { storeId }, select: { id: true } });
  return t?.id ?? null;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as {
      storeId: string; category: string; enabled?: boolean; order?: number;
    };
    const { storeId, category, enabled = true, order = 0 } = body;

    if (!storeId || !category) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const templateId = await getTemplateId(storeId);
    if (!templateId) return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });

    const section = await prisma.templateCategorySection.create({
      data: { templateId, category, enabled, order },
    });
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('[POST /api/template/category-sections]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as {
      storeId: string;
      action: 'update' | 'toggle' | 'reorder';
      id?: string;
      category?: string;
      enabled?: boolean;
      items?: { id: string; order: number }[];
    };
    const { storeId, action, id, category, items } = body;

    if (!storeId) return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    if (action === 'reorder') {
      if (!items?.length) return NextResponse.json({ error: 'items مطلوبة' }, { status: 400 });
      await prisma.$transaction(
        items.map(item =>
          prisma.templateCategorySection.update({
            where: { id: item.id },
            data: { order: item.order },
          }),
        ),
      );
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (action === 'toggle') {
      if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
      const current = await prisma.templateCategorySection.findUnique({ where: { id } });
      if (!current) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
      const updated = await prisma.templateCategorySection.update({
        where: { id },
        data: { enabled: !current.enabled },
      });
      return NextResponse.json(updated, { status: 200 });
    }

    if (action === 'update') {
      if (!id || !category) return NextResponse.json({ error: 'id والقسم مطلوبان' }, { status: 400 });
      const updated = await prisma.templateCategorySection.update({
        where: { id },
        data: { category },
      });
      return NextResponse.json(updated, { status: 200 });
    }

    return NextResponse.json({ error: 'action غير صالح' }, { status: 400 });
  } catch (error) {
    console.error('[PUT /api/template/category-sections]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as { storeId: string; id: string };
    const { storeId, id } = body;

    if (!storeId || !id) return NextResponse.json({ error: 'storeId و id مطلوبان' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.templateCategorySection.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/template/category-sections]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}
