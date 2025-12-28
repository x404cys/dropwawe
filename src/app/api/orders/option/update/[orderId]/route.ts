import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOperation } from '@/app/lib/authOperation';

export async function PATCH(req: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const session = await getServerSession(authOperation);

    if (!orderId || !session) {
      return NextResponse.json({ error: 'Order ID and session required' }, { status: 400 });
    }

    if (session.user.role === 'SUPPLIER') {
      await prisma.orderFromTrader.findUnique({
        where: { id: orderId },
      });
      const updated = await prisma.orderFromTrader.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      await prisma.order.update({
        where: { id: updated.orderId! },
        data: { status: 'CONFIRMED' },
      });
      return NextResponse.json(updated);
      // if (existingTraderOrder && existingTraderOrder.supplierId === session.user.id) {
      // }
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
    }

    const supplierItems = await Promise.all(
      order.items.map(async item => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId! },
          include: {
            pricingDetails: true,
          },
        });
        return { item, product };
      })
    );

    const itemsFromSupplier = supplierItems.filter(p => p.product?.isFromSupplier);

    if (!itemsFromSupplier.length) {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });
      return NextResponse.json(updatedOrder);
    }

    const supplierMap: Record<string, typeof itemsFromSupplier> = {};
    for (const pair of itemsFromSupplier) {
      const supplierId = pair.product!.supplierId!;
      if (!supplierMap[supplierId]) supplierMap[supplierId] = [];
      supplierMap[supplierId].push(pair);
    }

    const ordersFromTrader = [];

    for (const [supplierId, items] of Object.entries(supplierMap)) {
      const total = items.reduce((sum, p) => sum + p.item.price * p.item.quantity, 0);
      const traderOrder = await prisma.orderFromTrader.create({
        data: {
          traderId: session.user.id,
          supplierId,
          orderId: order.id,
          status: 'PENDING',
          total,
          fullName: order.fullName,
          location: order.location,
          phone: order.phone,
          items: {
            create: items.map(p => ({
              productId: p.item.productId,
              quantity: p.item.quantity,
              price: p.item.price,
              wholesalePrice: p.product?.pricingDetails?.wholesalePrice,
              traderProfit: p.item.price - p.product?.pricingDetails?.wholesalePrice!,
              supplierProfit: p.product?.pricingDetails?.wholesalePrice! * p.item.quantity,
            })),
          },
        },
        include: { items: true },
      });
      ordersFromTrader.push(traderOrder);

      // await prisma.orderItem.deleteMany({ where: { id: { in: items.map(p => p.item.id) } } });
    }

    return NextResponse.json({ message: 'Supplier items moved successfully', ordersFromTrader });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
