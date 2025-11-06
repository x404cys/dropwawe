import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await context.params;

  if (!storeId) {
    return NextResponse.json({ error: 'StoreId is required' }, { status: 400 });
  }

  let products;
  try {
    products = await prisma.order.findMany({
      where: { storeId },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Error getting orders' }, { status: 500 });
  }

  return NextResponse.json(products, { status: 200 });
}
