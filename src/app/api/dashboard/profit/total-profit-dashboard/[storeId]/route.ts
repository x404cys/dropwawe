import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(request: Request, context: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await context.params;

  if (!storeId) {
    return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
  }

  try {
    const result = await prisma.order.aggregate({
      where: {
        storeId: storeId,
        status: 'CONFIRMED',
      },
      _sum: {
        total: true,
      },
    });

    return NextResponse.json({
      totalAmount: result._sum.total ?? 0,
    });
  } catch (error) {
    console.error('Error calculating total amount:', error);

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
