import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(request: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const store = await prisma.storeUser.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    if (!store) {
      return NextResponse.json({ error: 'User has no store' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: {
        storeId: store.id,
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
