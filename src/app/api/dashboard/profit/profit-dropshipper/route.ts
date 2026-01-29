import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET() {
  const session = await getServerSession(authOperation);
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'DROPSHIPPER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const store = await prisma.storeUser.findFirst({
    where: { userId: session.user.id },
    select: {
      storeId: true,
    },
  });
  try {
    const traderProfit = await prisma.traderProfit.findUnique({
      where: { traderId: userId },
    });

    const items = await prisma.orderFromTraderItem.findMany({
      where: {
        order: {
          traderId: userId,
          status: 'CONFIRMED',
        },
      },
      select: {
        traderProfit: true,
        order: {
          select: {
            createdAt: true,
          },
        },
      },
      orderBy: {
        order: {
          createdAt: 'asc',
        },
      },
    });
    const totalProfit = items.reduce((acc, item) => acc + (item.traderProfit ?? 0), 0);

    const dailyMap: Record<string, number> = {};
    const weeklyMap: Record<string, number> = {};
    const monthlyMap: Record<string, number> = {};

    const getWeekKey = (date: Date) => {
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((+date - +startOfYear) / 86400000);
      const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      return `${date.getFullYear()}-W${week}`;
    };

    items.forEach(item => {
      if (!item.traderProfit) return;

      const date = item.order.createdAt;
      const dayKey = date.toISOString().split('T')[0];
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const weekKey = getWeekKey(date);

      dailyMap[dayKey] = (dailyMap[dayKey] || 0) + item.traderProfit;
      weeklyMap[weekKey] = (weeklyMap[weekKey] || 0) + item.traderProfit;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + item.traderProfit;
    });

    return NextResponse.json({
      totalProfit: totalProfit ?? 0,
      remaining: traderProfit?.remaining ?? 0,
      withdrawn: traderProfit ? traderProfit.amount - traderProfit.remaining : 0,

      daily: Object.entries(dailyMap).map(([day, profit]) => ({
        day,
        profit,
      })),
      weekly: Object.entries(weeklyMap).map(([week, profit]) => ({
        week,
        profit,
      })),
      monthly: Object.entries(monthlyMap).map(([month, profit]) => ({
        month,
        profit,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch profits' }, { status: 500 });
  }
}
