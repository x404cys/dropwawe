import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ subLink: string }> }) {
  const { subLink } = await context.params;

  if (!subLink) {
    return NextResponse.json({ error: 'subLink is required' }, { status: 400 });
  }

  try {
    // const storeWithOwner = await prisma.store.findFirst({
    //   where: { subLink },
    //   include: {
    //     users: {
    //       // where: { isOwner: true },
    //       select: { userId: true },
    //     },
    //   },
    // });
    // const ownerUserId = storeWithOwner?.users[0]?.userId;

    // const supplier = await prisma.supplier.findUnique({
    //   where: {
    //     userId: ownerUserId!,
    //   },
    // });
    // const products = await prisma.product.findMany({
    //   where: {
    //     OR: [{ storeId: storeWithOwner?.id }, { userId: ownerUserId }],
    //   },
    //   include: {
    //     pricingDetails: true,
    //   },
    // });

    const supplier = await prisma.supplier.findUnique({
      where: {
        id: subLink,
      },
    });

    const products = await prisma.product.findMany({
      where: {
        OR: [{ userId: supplier?.userId }],
      },
      include: {
        pricingDetails: true,
      },
    });

    return NextResponse.json({ products, supplier }, { status: 200 });
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ error: 'Error getting products' }, { status: 500 });
  }
}
