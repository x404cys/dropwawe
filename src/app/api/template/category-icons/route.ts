// src/app/api/template/category-icons/route.ts
// POST — ensure/create a TemplateCategoryIcon by category.
// PUT  — update a TemplateCategoryIcon by id (icon name, image, or category).

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

async function getOrCreateTemplateId(storeId: string): Promise<string> {
  const template = await prisma.storeTemplate.upsert({
    where: { storeId },
    create: { storeId },
    update: {},
    select: { id: true },
  });
  return template.id;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as {
      storeId: string;
      category: string;
      icon?: string;
      image?: string | null;
    };
    const { storeId, category, icon = 'Package', image = null } = body;

    if (!storeId || !category) {
      return NextResponse.json({ error: 'storeId و category مطلوبان' }, { status: 400 });
    }
    if (!(await verifyOwnershipByStore(storeId, session.user.email))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const templateId = await getOrCreateTemplateId(storeId);

    // TODO: replace image base64 with storage upload (Supabase/S3) and store URL
    const upserted = await prisma.templateCategoryIcon.upsert({
      where: { templateId_category: { templateId, category } },
      create: {
        templateId,
        category,
        icon,
        image,
      },
      update: {},
    });

    return NextResponse.json(upserted, { status: 201 });
  } catch (error) {
    console.error('[POST /api/template/category-icons]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as {
      storeId: string;
      id: string;
      icon?: string;
      image?: string | null;
      category?: string;
    };
    const { storeId, id, icon, image, category } = body;

    if (!storeId || !id) return NextResponse.json({ error: 'storeId و id مطلوبان' }, { status: 400 });
    if (!(await verifyOwnershipByStore(storeId, session.user.email)))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // TODO: replace image base64 with storage upload (Supabase/S3) and store URL
    const updated = await prisma.templateCategoryIcon.update({
      where: { id },
      data: {
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image }),
        ...(category !== undefined && { category }),
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/template/category-icons]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}
