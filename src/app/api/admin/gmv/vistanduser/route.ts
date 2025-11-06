import { authOperation } from '@/app/lib/authOperation';
import { addWeeks, startOfWeek, format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOperation);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    if (session.user.role !== 'A') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const now = new Date();
    const numberOfWeeks = 6;

    const weeklyVisitors: number[] = [];
    const weeklyNewUsers: number[] = [];
    const weeklyDates: string[] = [];

    for (let i = numberOfWeeks - 1; i >= 0; i--) {
      const weekStart = startOfWeek(addWeeks(now, -i), { weekStartsOn: 1 });
      const weekEnd = addWeeks(weekStart, 1);

      weeklyDates.push(format(weekStart, 'yyyy-MM-dd'));

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

      const newUsersCount = await prisma.user.count({
        where: {
          createdAt: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
      });
      weeklyNewUsers.push(newUsersCount);
    }

    function calculateWeeklyConversion(visitors: number[], newUsers: number[]) {
      return visitors.map((v, i) =>
        v === 0 ? 0 : parseFloat(((newUsers[i] / v) * 100).toFixed(2))
      );
    }

    const weeklyConversionRates = calculateWeeklyConversion(weeklyVisitors, weeklyNewUsers);

    return NextResponse.json({
      stats: {
        weeklyVisitors,
        weeklyNewUsers,
        weeklyConversionRates,
        weeklyDates,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
