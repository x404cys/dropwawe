import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOperation } from '@/app/lib/authOperation';
import type { Prisma } from '@prisma/client';

export async function PATCH(req: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const session = await getServerSession(authOperation);

    if (!orderId || !session) {
      return NextResponse.json(
        { error: 'Order ID and user session are required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
    }

    const supplierItems = order.items.filter(item => item.product?.supplierId);

    if (supplierItems.length === 0) {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });
      return NextResponse.json(updatedOrder);
    }

    const createdOrders: Prisma.OrderFromTraderGetPayload<{ include: { items: true } }>[] = [];
    const supplierMap: Record<string, typeof supplierItems> = {};

    for (const item of supplierItems) {
      const supplierId = item.product!.supplierId!;
      if (!supplierMap[supplierId]) supplierMap[supplierId] = [];
      supplierMap[supplierId].push(item);
    }

    for (const [supplierId, items] of Object.entries(supplierMap)) {
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const traderOrder = await prisma.orderFromTrader.create({
        data: {
          traderId: session.user.id,
          supplierId,
          status: 'PENDING',
          total,
          fullName: order.fullName,
          location: order.location,
          phone: order.phone,
          items: {
            create: items.map(i => ({
              quantity: i.quantity,
              price: i.price,
              color: i.color,
              size: i.size,
              productId: i.productId!,
            })),
          },
        },
        include: { items: true },
      });

      createdOrders.push(traderOrder);

      await prisma.orderItem.deleteMany({
        where: { id: { in: items.map(i => i.id) } },
      });
    }

    return NextResponse.json({
      message: 'Supplier products moved to OrderFromTrader successfully',
      ordersFromTrader: createdOrders,
    });
  } catch (error) {
    console.error('Error processing order:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
