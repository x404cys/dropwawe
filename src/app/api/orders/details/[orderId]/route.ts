import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET(req: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const session = await getServerSession(authOperation);

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: session?.user.id },
      include: { items: { include: { product: true } }  },
    });

    if (order) return NextResponse.json(order);

    if (session?.user.role === 'SUPPLIER') {
      const traderOrder = await prisma.orderFromTrader.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });

      return NextResponse.json(traderOrder);
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
