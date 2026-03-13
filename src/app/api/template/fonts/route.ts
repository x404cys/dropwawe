// src/app/api/template/fonts/route.ts
// POST   — upload a custom font (stores base64 as-is for now)
// DELETE — delete a font, and reset headingFont/bodyFont on the template
//          to "IBM Plex Sans Arabic" in a transaction if they reference the deleted font.

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

    const body = await req.json() as { storeId: string; name: string; url: string };
    const { storeId, name, url } = body;

    if (!storeId || !name || !url) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const templateId = await getTemplateId(storeId);
    if (!templateId) return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });

    // TODO: replace with storage upload (Supabase/S3) and store URL
    const font = await prisma.templateCustomFont.upsert({
      where: { templateId_name: { templateId, name } },
      create: { templateId, name, url },
      update: { url },
    });
    return NextResponse.json(font, { status: 201 });
  } catch (error) {
    console.error('[POST /api/template/fonts]', error);
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

    const font = await prisma.templateCustomFont.findUnique({ where: { id } });
    if (!font) return NextResponse.json({ error: 'الخط غير موجود' }, { status: 404 });

    const template = await prisma.storeTemplate.findUnique({
      where: { storeId },
      select: { id: true, headingFont: true, bodyFont: true },
    });

    const DEFAULT_FONT = 'IBM Plex Sans Arabic';
    const headingReset = template?.headingFont === font.name;
    const bodyReset = template?.bodyFont === font.name;

    // Use a transaction: delete font + conditionally reset font references
    await prisma.$transaction([
      prisma.templateCustomFont.delete({ where: { id } }),
      ...(template && (headingReset || bodyReset)
        ? [
            prisma.storeTemplate.update({
              where: { id: template.id },
              data: {
                ...(headingReset && { headingFont: DEFAULT_FONT }),
                ...(bodyReset && { bodyFont: DEFAULT_FONT }),
              },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({ ok: true, headingReset, bodyReset }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/template/fonts]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}
