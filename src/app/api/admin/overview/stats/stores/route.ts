import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOperation);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }
    if (session.user.role !== 'A') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const stores = await prisma.store.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalStores = await prisma.store.count();
    const totalStoreActived = await prisma.store.count({
      where: {
        active: true,
      },
    });
    const [todayCount, weekCount, monthCount] = await Promise.all([
      prisma.store.count({
        where: {
          createdAt: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date()),
          },
        },
      }),
      prisma.store.count({
        where: {
          createdAt: {
            gte: startOfWeek(new Date(), { weekStartsOn: 6 }),
            lte: endOfWeek(new Date(), { weekStartsOn: 6 }),
          },
        },
      }),
      prisma.store.count({
        where: {
          createdAt: {
            gte: startOfMonth(new Date()),
            lte: endOfMonth(new Date()),
          },
        },
      }),
    ]);

    return NextResponse.json({
      todayCount,
      weekCount,
      monthCount,
      totalStoreActived,
      totalStores,
      stores,
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
