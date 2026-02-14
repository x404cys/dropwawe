import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(request: Request, context: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await context.params;

  if (!storeId) {
    return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        storeId: storeId,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
