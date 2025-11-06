import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { searchParams } = new URL(req.url);
  const { slug } = await context.params;
  const category = searchParams.get('category');

  if (!slug || !category) {
    return NextResponse.json({ products: [] });
  }

  try {
    const whereClause =
      category === 'الكل'
        ? { user: { storeSlug: slug } }
        : { user: { storeSlug: slug }, category: category };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ products: [] });
  }
}
