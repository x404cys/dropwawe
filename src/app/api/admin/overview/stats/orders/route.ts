import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET() {
  try {
    const session = await getServerSession(authOperation);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }
    if (session.user.role !== 'A') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const Orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
        store: true,
        user: true,
      },
    });
    const totalOrdersConfirmed = await prisma.order.count({
      where: {
        status: 'CONFIRMED',
      },
    });
    const totalOrdersPending = await prisma.order.count({
      where: {
        status: 'PENDING',
      },
    });
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    const totalSales = await prisma.order.aggregate({
      _sum: { total: true },
    });

    return NextResponse.json({
      totalOrdersConfirmed,
      totalOrdersPending,
      Orders,
      totalUsers,
      totalOrders,
      totalSales,
      totalStores,
      totalProducts,
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
