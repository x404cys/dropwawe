import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const totalSales = await prisma.order.aggregate({
      _sum: { total: true },
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const visitorsCount = await prisma.visitor.count();
    const notificationsCount = await prisma.notification.count();

    const productsByStore = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        subLink: true,
        _count: { select: { products: true } },
      },
    });

    const productsByCategory = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    return NextResponse.json({
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      ordersByStatus,
      totalSales: totalSales._sum.total ?? 0,
      topProducts,
      visitorsCount,
      notificationsCount,
      productsByStore,
      productsByCategory,
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
