import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { authOperation } from '@/app/lib/authOperation';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const storeSlug = formData.get('storeSlug') as string | null;
    const storeName = formData.get('storeName') as string | null;
    const description = formData.get('description') as string | null;
    const shippingPriceStr = formData.get('shippingPrice') as string | null;
    const shippingPrice = shippingPriceStr ? parseFloat(shippingPriceStr) : null;
    const phone = formData.get('phone') as string | null;
    const facebook = formData.get('facebookLink') as string | null;
    const instagram = formData.get('instaLink') as string | null;
    const telegram = formData.get('telegram') as string | null;

    if (storeSlug) {
      const existing = await prisma.user.findUnique({
        where: { storeSlug },
      });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: 'Store slug already taken' }, { status: 409 });
      }
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (storeSlug) updateData.storeSlug = storeSlug;
    if (storeName) updateData.storeName = storeName;
    if (description) updateData.description = description;
    if (shippingPrice !== null) updateData.shippingPrice = shippingPrice;
    if (phone) updateData.phone = phone;
    if (facebook) updateData.facebookLink = facebook;
    if (instagram) updateData.instaLink = instagram;
    if (telegram) updateData.telegram = telegram;

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ message: 'تم تحديث بيانات المتجر بنجاح ' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
