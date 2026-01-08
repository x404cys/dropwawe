import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET(req: Request) {
  const session = await getServerSession(authOperation);
  const userId = session?.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  if (session.user.role !== 'SUPPLIER') {
    return NextResponse.json({ error: 'unauthraze' }, { status: 400 });
  }
  const supplier = await prisma.supplier.findUnique({
    where: {
      userId: userId,
    },
  });
  try {
    const totalSum = await prisma.orderFromTrader.aggregate({
      where: {
        supplierId: supplier?.id,
        status: 'CONFIRMED',
      },
      _sum: {
        total: true,
      },
    });

    const allOrders = await prisma.orderFromTrader.findMany({
      where: {
        supplierId: supplier?.id,
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
    const orderFromTraderPayment = await prisma.orderFromTrader.findMany({
      select: {
        paymentOrder: {
          select: {
            amount: true,
          },
        },
      },
    });
    const dailyMap: Record<string, number> = {};
    const weeklyMap: Record<string, number> = {};
    const monthlyMap: Record<string, number> = {};

    const getWeekKey = (date: Date) => {
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((+date - +startOfYear) / (1000 * 60 * 60 * 24));
      const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      return `${date.getFullYear()}-W${week}`;
    };

    allOrders.forEach(order => {
      const dayKey = order.createdAt.toISOString().split('T')[0];
      const monthKey = `${order.createdAt.getFullYear()}-${String(
        order.createdAt.getMonth() + 1
      ).padStart(2, '0')}`;
      const weekKey = getWeekKey(order.createdAt);

      dailyMap[dayKey] = (dailyMap[dayKey] || 0) + order.total;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + order.total;
      weeklyMap[weekKey] = (weeklyMap[weekKey] || 0) + order.total;
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
      daily,
      weekly,
      monthly,
      orderFromTraderPayment,
    });
  } catch (error) {
    return NextResponse.json({ error: 'err to get profit' }, { status: 500 });
  }
}
