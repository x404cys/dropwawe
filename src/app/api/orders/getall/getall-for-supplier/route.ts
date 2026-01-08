import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOperation);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'SUPPLIER') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const userId = session.user.id;

    const supplier = await prisma.supplier.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    const totalSum = await prisma.orderFromTrader.aggregate({
      where: {
        supplierId: supplier.id,
        status: 'CONFIRMED',
      },
      _sum: {
        total: true,
      },
    });

    const confirmedOrders = await prisma.orderFromTrader.findMany({
      where: {
        supplierId: supplier.id,
        status: 'CONFIRMED',
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const supplierPayments = await prisma.order.findMany({
      where: { userId },
      select: { paymentOrder: true },
    });

    const traderPayments = await prisma.orderFromTrader.findMany({
      where: { traderId: userId },
      select: { paymentOrder: true },
    });

    const dailyMap: Record<string, number> = {};
    const weeklyMap: Record<string, number> = {};
    const monthlyMap: Record<string, number> = {};

    const getWeekKey = (date: Date) => {
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((+date - +startOfYear) / 86400000);
      const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      return `${date.getFullYear()}-W${week}`;
    };

    confirmedOrders.forEach(order => {
      const dayKey = order.createdAt.toISOString().split('T')[0];
      const monthKey = `${order.createdAt.getFullYear()}-${String(
        order.createdAt.getMonth() + 1
      ).padStart(2, '0')}`;
      const weekKey = getWeekKey(order.createdAt);

      dailyMap[dayKey] = (dailyMap[dayKey] || 0) + order.total;
      weeklyMap[weekKey] = (weeklyMap[weekKey] || 0) + order.total;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + order.total;
    });

    const daily = Object.entries(dailyMap).map(([day, profit]) => ({
      day,
      profit,
    }));

    const weekly = Object.entries(weeklyMap).map(([week, profit]) => ({
      week,
      profit,
    }));

    const monthly = Object.entries(monthlyMap).map(([month, profit]) => ({
      month,
      profit,
    }));

    return NextResponse.json({
      totalProfit: totalSum._sum.total ?? 0,
      charts: {
        daily,
        weekly,
        monthly,
      },
      payments: {
        supplierPayments,
        traderPayments,
      },
    });
  } catch (error) {
    console.error('GET SUPPLIER PROFIT ERROR:', error);
    return NextResponse.json({ error: 'Failed to get profit data' }, { status: 500 });
  }
}
