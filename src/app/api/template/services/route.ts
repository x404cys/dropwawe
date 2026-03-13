// src/app/api/template/services/route.ts
// POST   — create a new TemplateService
// PUT    — update a TemplateService by id
// DELETE — delete a TemplateService by id

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

async function verifyTemplateOwnership(
  templateId: string,
  userEmail: string,
): Promise<boolean> {
  const template = await prisma.storeTemplate.findUnique({
    where: { id: templateId },
    select: { store: { select: { users: { where: { user: { email: userEmail } } } } } },
  });
  return (template?.store.users.length ?? 0) > 0;
}

async function getTemplateId(storeId: string): Promise<string | null> {
  const t = await prisma.storeTemplate.findUnique({ where: { storeId }, select: { id: true } });
  return t?.id ?? null;
}

async function verifyOwnershipByStore(storeId: string, userEmail: string): Promise<boolean> {
  const su = await prisma.storeUser.findFirst({
    where: { storeId, user: { email: userEmail } },
  });
  return !!su;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as { storeId: string; icon?: string; title: string; desc?: string; order?: number };
    const { storeId, icon = 'Sparkles', title, desc, order = 0 } = body;

    if (!storeId) return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    if (!title) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });

    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const templateId = await getTemplateId(storeId);
    if (!templateId) return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });

    const service = await prisma.templateService.create({
      data: { templateId, icon, title, desc, order },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('[POST /api/template/services]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as { storeId: string; id: string; icon?: string; title?: string; desc?: string; order?: number };
    const { storeId, id, ...fields } = body;

    if (!storeId || !id) return NextResponse.json({ error: 'storeId و id مطلوبان' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const service = await prisma.templateService.update({ where: { id }, data: fields });
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/template/services]', error);
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

    await prisma.templateService.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/template/services]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

// Workaround: suppress unused import warning
void verifyTemplateOwnership;
