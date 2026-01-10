import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ subLink: string }> }) {
  const { subLink } = await context.params;

  if (!subLink) {
    return NextResponse.json({ error: 'subLink is required' }, { status: 400 });
  }

  try {
    const store = await prisma.store.findFirst({
      where: { subLink },
      include: {
        users: {
          select: { userId: true },
        },
      },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [{ storeId: store.id }, { userId: store.users.find(u => u.userId)?.userId }],
        discount: {
          gt: 0,
        },
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ error: 'Error getting products' }, { status: 500 });
  }
}
