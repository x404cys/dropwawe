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
    const totalSales = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: 'CONFIRMED',
      },
    });
    const todayRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: 'CONFIRMED',
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const monthlyRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: 'CONFIRMED',
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    return NextResponse.json({ totalSales, todayRevenue, monthlyRevenue });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
