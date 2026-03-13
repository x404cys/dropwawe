// src/app/api/template/banners/route.ts
// POST   — create a new TemplateBanner (stores base64 url as-is)
// DELETE — delete a TemplateBanner by id

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

    const body = (await req.json()) as { storeId: string; url: string; order?: number };
    const { storeId, url, order = 0 } = body;

    if (!storeId || !url)
      return NextResponse.json({ error: 'storeId و url مطلوبان' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const templateId = await getTemplateId(storeId);
    if (!templateId) return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });

    const banner = await prisma.templateBanner.create({
      data: { templateId, url, order },
    });
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('[POST /api/template/banners]', error);
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

    await prisma.templateBanner.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/template/banners]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}
