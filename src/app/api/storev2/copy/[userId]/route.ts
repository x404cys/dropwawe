import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const store = await prisma.$transaction(async tx => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: {
          Product: true,
          orders: { include: { items: true } },
          Notification: true,
        },
      });

      if (!user) throw new Error('User not found');

      const newStore = await tx.store.create({
        data: {
          name: user.storeName ?? user.name,
          subLink: user.storeSlug,
          shippingPrice: user.shippingPrice,
          shippingType: user.shippingType,
          hasReturnPolicy: user.hasReturnPolicy,
          facebookLink: user.facebookLink,
          instaLink: user.instaLink,
          telegram: user.telegram,
          phone: user.phone,
          description: user.description,
          active: user.active ?? true,
          userId: user.id,
        },
      });

      if (user.Product.length > 0) {
        const productsData = user.Product.map(p => ({
          name: p.name,
          description: p.description,
          price: p.price,
          quantity: p.quantity,
          image: p.image,
          category: p.category,
          discount: p.discount,
          hasReturnPolicy: p.hasReturnPolicy,
          shippingPrice: p.shippingPrice,
          shippingType: p.shippingType,
          storeId: newStore.id,
          userId: user.id,
        }));
        await tx.product.createMany({ data: productsData });
      }

      if (user.Notification.length > 0) {
        const notifsData = user.Notification.map(n => ({
          userId: user.id,
          message: n.message,
          url: n.url,
          isRead: n.isRead,
          type: n.type,
        }));
        await tx.notification.createMany({ data: notifsData });
      }

      for (const order of user.orders) {
        const newOrder = await tx.order.create({
          data: {
            status: order.status,
            total: order.total,
            userId: user.id,
            storeId: newStore.id,
            email: order.email,
            fullName: order.fullName,
            location: order.location,
            phone: order.phone,
          },
        });

        if (order.items.length > 0) {
          const itemsData = order.items.map(item => ({
            quantity: item.quantity,
            price: item.price,
            orderId: newOrder.id,
            productId: item.productId,
          }));
          await tx.orderItem.createMany({ data: itemsData });
        }
      }

      return newStore;
    });

    return NextResponse.json(store, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err || 'Internal Server Error' }, { status: 500 });
  }
}
