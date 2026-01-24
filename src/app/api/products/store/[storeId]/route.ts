import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await context.params;

  if (!storeId) {
    return NextResponse.json({ error: 'ID is null' }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: { storeId: storeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
