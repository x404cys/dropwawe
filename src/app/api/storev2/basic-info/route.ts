import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { authOperation } from '@/app/lib/authOperation';
import { prisma } from '@/app/lib/db';

interface BasicInfoBody {
  storeId?: unknown;
  name?: unknown;
  description?: unknown;
  image?: unknown;
}

async function verifyOwnershipByStore(storeId: string, userEmail: string): Promise<boolean> {
  const storeUser = await prisma.storeUser.findFirst({
    where: {
      storeId,
      user: { email: userEmail },
    },
    select: { id: true },
  });
  return !!storeUser;
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as BasicInfoBody;
    const storeId = typeof body.storeId === 'string' ? body.storeId.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const image =
      body.image === null
        ? null
        : typeof body.image === 'string'
          ? body.image.trim()
          : undefined;

    if (!storeId) {
      return NextResponse.json({ error: 'storeId مطلوب' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'اسم المتجر مطلوب' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'وصف المتجر مطلوب' }, { status: 400 });
    }

    const owned = await verifyOwnershipByStore(storeId, session.user.email);
    if (!owned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { name, description, ...(image !== undefined ? { image } : {}) },
      select: { id: true, name: true, description: true },
    });

    return NextResponse.json(updatedStore, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'المتجر غير موجود' }, { status: 404 });
    }
    console.error('[PUT /api/storev2/basic-info]', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}
