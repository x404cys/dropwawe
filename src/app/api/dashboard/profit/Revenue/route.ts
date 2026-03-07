import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const storeId = url.searchParams.get('storeId');

  if (!storeId) {
    return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
  }

  try {
    // إجمالي الأرباح
    const totalSum = await prisma.order.aggregate({
      where: {
        storeId,
        status: 'CONFIRMED',
      },
      _sum: { total: true },
    });

    // إجمالي المدفوعات
    const orderPayment = await prisma.paymentOrder.aggregate({
      _sum: { amount: true },
      where: { status: 'Success', order: { storeId } },
    });

    // الأسبوع الحالي + الأسبوع الماضي
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 6); // السبت
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const lastWeekStart = new Date(startOfWeek);
    lastWeekStart.setDate(startOfWeek.getDate() - 7);

    const lastWeekEnd = new Date(startOfWeek);

    const currentWeek = await prisma.order.aggregate({
      where: {
        storeId,
        status: 'CONFIRMED',
        createdAt: { gte: startOfWeek, lt: endOfWeek },
      },
      _sum: { total: true },
    });

    const lastWeek = await prisma.order.aggregate({
      where: {
        storeId,
        status: 'CONFIRMED',
        createdAt: { gte: lastWeekStart, lt: lastWeekEnd },
      },
      _sum: { total: true },
    });

    const currentWeekProfit = currentWeek._sum.total ?? 0;
    const lastWeekProfit = lastWeek._sum.total ?? 0;

    let changePercent = 0;
    if (lastWeekProfit > 0) {
      changePercent = ((currentWeekProfit - lastWeekProfit) / lastWeekProfit) * 100;
    }

    // الأرباح الأسبوعية لكل يوم
    const weeklyRaw = await prisma.$queryRaw<{ day: number; profit: number }[]>`
      SELECT EXTRACT(DOW FROM "createdAt") as day,
             SUM(total) as profit
      FROM "Order"
      WHERE "storeId" = ${storeId} AND status = 'CONFIRMED'
      GROUP BY day
    `;

    const dayMap: Record<number, string> = {
      6: 'Saturday',
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
    };

    const orderedDays = [
      'Saturday',
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ];

    const weeklyMap: Record<string, number> = {
      Saturday: 0,
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
    };

    weeklyRaw.forEach(row => {
      const dayName = dayMap[row.day];
      weeklyMap[dayName] = Number(row.profit);
    });

    const weekly = orderedDays.map(day => ({ day, profit: weeklyMap[day] }));

    return NextResponse.json({
      totalProfit: totalSum._sum.total ?? 0,
      weekly,
      orderPayment: orderPayment._sum.amount ?? 0,
      currentWeekProfit,
      lastWeekProfit,
      changePercent,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'err to get profit' }, { status: 500 });
  }
}
