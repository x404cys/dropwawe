// src/app/api/template/works/route.ts
// POST   — create a new TemplateWork
// PUT    — update a TemplateWork by id
// DELETE — delete a TemplateWork by id

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

    // include image field—can be null or a data URL / URL string
    const body = (await req.json()) as {
      storeId: string;
      title: string;
      category?: string;
      link?: string;
      image?: string | null;
      order?: number;
    };
    const { storeId, title, category, link, image = null, order = 0 } = body;

    if (!storeId || !title)
      return NextResponse.json({ error: 'storeId والعنوان مطلوبان' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const templateId = await getTemplateId(storeId);
    if (!templateId) return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });

    const work = await prisma.templateWork.create({
      data: { templateId, title, category, link, image, order },
    });
    return NextResponse.json(work, { status: 201 });
  } catch (error) {
    console.error('[POST /api/template/works]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = (await req.json()) as {
      storeId: string;
      id: string;
      title?: string;
      category?: string;
      link?: string;
      image?: string | null;
      order?: number;
    };
    const { storeId, id, ...fields } = body;

    if (!storeId || !id)
      return NextResponse.json({ error: 'storeId و id مطلوبان' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const existing = await prisma.templateWork.findFirst({
      where: { id, template: { storeId } },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 });
    }

    const work = await prisma.templateWork.update({ where: { id }, data: fields });
    return NextResponse.json(work, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/template/works]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = (await req.json()) as { storeId: string; id: string };
    const { storeId, id } = body;

    if (!storeId || !id)
      return NextResponse.json({ error: 'storeId و id مطلوبان' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.templateWork.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/template/works]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}
