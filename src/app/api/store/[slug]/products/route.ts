import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ slug?: string }> }) {
  const params = await context.params;
  const slug = params?.slug;

  if (!slug) {
    return NextResponse.json({ error: 'Store slug is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { storeSlug: slug },
      include: {
        Product: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                storeName: true,
                storeSlug: true,
                shippingPrice: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({
      store: {
        id: user.id,
        name: user.name,
        slug: user.storeSlug,
        storeName: user.storeName,
        shippingPrice: user.shippingPrice,
      },
      products: user.Product,
    });
  } catch (error) {
    console.error('[STORE_PRODUCTS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
