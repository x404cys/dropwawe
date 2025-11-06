import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { startOfDay, startOfMonth, subMonths } from 'date-fns';
import { Product } from '@/types/Products';
import { startOfWeek, addWeeks } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOperation);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    if (session.user.role !== 'A') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const totalStores = await prisma.user.count({
      where: { storeSlug: { not: null } },
    });

    const storesToday = await prisma.user.count({
      where: {
        storeSlug: { not: null },
        createdAt: { gte: startOfDay(new Date()) },
      },
    });

    const storesThisMonth = await prisma.user.count({
      where: {
        storeSlug: { not: null },
        createdAt: { gte: startOfMonth(new Date()) },
      },
    });

    const storesLastMonth = await prisma.user.count({
      where: {
        storeSlug: { not: null },
        createdAt: {
          gte: startOfMonth(subMonths(new Date(), 1)),
          lt: startOfMonth(new Date()),
        },
      },
    });

    const growthPercentage =
      storesLastMonth === 0 ? 100 : ((storesThisMonth - storesLastMonth) / storesLastMonth) * 100;

    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const allOrder = await prisma.order.findMany();
    const totalVisitors = await prisma.visitor.count();
    const totalVisitorsLandingPage = await prisma.visitor.count({
      where: {
        storeName: 'sahl2025',
      },
    });
    const latestUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      // take: 5,
    });
    const stores = await prisma.user.findMany({
      where: { storeSlug: { not: null } },
      select: {
        id: true,
        name: true,
        storeSlug: true,
        phone: true,
        Product: { select: { id: true } },
        orders: { select: { id: true, total: true } },
        active: true,
      },
    });
    const result = await prisma.order.aggregate({
      _sum: { total: true },
    });

    const totalSales = result._sum.total ?? 0;

    const detailedStores = stores.map(store => ({
      id: store.id,
      name: store.name,
      storeSlug: store.storeSlug,
      phone: store.phone,
      totalProducts: store.Product.length,
      totalOrders: store.orders.length,
      totalProfit: store.orders.reduce((sum, o) => sum + (o.total || 0), 0),
      // totalVisitors: store.visitors.length,
      active: store.active,
    }));

    const allStoreSlugs = await prisma.user.findMany({
      select: { storeSlug: true },
      where: { storeSlug: { not: null } },
    });
    const allProductsRaw = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            storeName: true,
            storeSlug: true,
            shippingPrice: true,
          },
        },
      },
    });

    const allProducts: Product[] = allProductsRaw.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price ?? 0,
      quantity: p.quantity ?? 0,
      category: p.category ?? 'null',
      discount: p.discount ?? 0,
      image: p.image || undefined,
      description: p.description || undefined,
      // images: p.image || undefined,
      hasReturnPolicy: p.hasReturnPolicy || undefined,
      shippingType: p.shippingType || undefined,
      user: p.user
        ? {
            id: p.user.id,
            storeName: p.user.storeName || 'غير محدد',
            storeSlug: p.user.storeSlug || undefined,
            shippingPrice: p.user.shippingPrice ?? 0,
          }
        : undefined,
    }));
    const salesToday = await prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfDay(new Date()) } },
    });

    const salesThisWeek = await prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfWeek(new Date()) } },
    });

    const salesThisMonth = await prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfMonth(new Date()) } },
    });
    const salesLastMonth = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: {
          gte: startOfMonth(subMonths(new Date(), 1)),
          lt: startOfMonth(new Date()),
        },
      },
    });

    const salesGrowthPercentage =
      (salesLastMonth._sum.total ?? 0) === 0
        ? 100
        : ((salesThisMonth._sum.total ?? 0 - (salesLastMonth._sum.total ?? 0)) /
            (salesLastMonth._sum.total ?? 0)) *
          100;
    const numberOfWeeks = 6;
    const now = new Date();
    const weeklyVisitors: number[] = [];

    for (let i = numberOfWeeks - 1; i >= 0; i--) {
      const weekStart = startOfWeek(addWeeks(now, -i), { weekStartsOn: 1 });
      const weekEnd = addWeeks(weekStart, 1);

      const visitorsCount = await prisma.visitor.count({
        where: {
          storeName: 'sahl2025',
          createdAt: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
      });

      weeklyVisitors.push(visitorsCount);
    }
    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalVisitors,
        totalStores,
        storesToday,
        storesThisMonth,
        growthPercentage,
        totalSales,
        salesToday: salesToday._sum.total ?? 0,
        salesThisWeek: salesThisWeek._sum.total ?? 0,
        salesThisMonth: salesThisMonth._sum.total ?? 0,
        salesGrowthPercentage,
        totalVisitorsLandingPage,
        ordersByStatus,
        weeklyVisitors,
      },

      latest: {
        users: latestUsers,
        notifications: [],
      },
      allStoreSlugs: allStoreSlugs.map(u => u.storeSlug).filter(Boolean),
      allOrder,
      allProducts,
      stores: detailedStores,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
