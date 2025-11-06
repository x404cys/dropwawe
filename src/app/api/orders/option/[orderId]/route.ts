import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOperation } from '@/app/lib/authOperation';

export async function DELETE(req: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;

    const session = await getServerSession(authOperation);

    if (!orderId || !session) {3
      return NextResponse.json(
        { error: 'Order ID and user session are required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
    }
    await prisma.orderItem.deleteMany({
      where: { orderId: orderId },
    });

    const deletedOrder = await prisma.order.delete({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(deletedOrder);
  } catch (error) {
    console.error('Error deleting order:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
