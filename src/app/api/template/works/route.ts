// src/app/api/template/works/route.ts
// POST   — create a new TemplateWork
// PUT    — update a TemplateWork by id
// DELETE — delete a TemplateWork by id

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
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

    const body = (await req.json()) as {
      storeId: string;
      title: string;
      category?: string;
      link?: string;
      image?: string | null;
      order?: number;
      serviceId?: string | null;
      icon?: string;
      showTitle?: string;
    };
    const {
      storeId,
      title,
      category,
      link,
      image = null,
      order = 0,
      serviceId = null,
      icon,
      showTitle,
    } = body;

    if (!storeId) return NextResponse.json({ error: 'storeId والعنوان مطلوبان' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const templateId = await getTemplateId(storeId);
    if (!templateId) return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });

    try {
      const work = await prisma.templateWork.create({
        data: { templateId, title, category, link, image, order, serviceId, icon, showTitle },
      });
      return NextResponse.json(work, { status: 201 });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientValidationError &&
        /Unknown argument `(?:icon|showTitle)`/i.test(error.message)
      ) {
        const work = await prisma.templateWork.create({
          data: { templateId, title, category, link, image, order, serviceId },
        });
        return NextResponse.json(work, { status: 201 });
      }
      throw error;
    }
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
      serviceId?: string | null;
      icon?: string | null;
      showTitle?: string | null;
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

    const data = {
      ...(fields.title !== undefined ? { title: fields.title } : {}),
      ...(fields.category !== undefined ? { category: fields.category } : {}),
      ...(fields.link !== undefined ? { link: fields.link } : {}),
      ...(fields.image !== undefined ? { image: fields.image } : {}),
      ...(fields.order !== undefined ? { order: fields.order } : {}),
      ...(fields.serviceId !== undefined ? { serviceId: fields.serviceId } : {}),
      ...(fields.icon !== undefined ? { icon: fields.icon } : {}),
      ...(fields.showTitle !== undefined ? { showTitle: fields.showTitle } : {}),
    };

    try {
      const work = await prisma.templateWork.update({ where: { id }, data });
      return NextResponse.json(work, { status: 200 });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientValidationError &&
        /Unknown argument `(?:icon|showTitle)`/i.test(error.message)
      ) {
        const { icon: _icon, showTitle: _showTitle, ...fallbackData } = data;
        const work = await prisma.templateWork.update({ where: { id }, data: fallbackData });
        return NextResponse.json(work, { status: 200 });
      }
      throw error;
    }
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
