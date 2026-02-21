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
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        stores: {
          include: {
            store: true,
          },
        },
        UserSubscription: {
          include: {
            plan: true,
          },
        },
      },
    });
    const totalUsers = await prisma.user.count();
    const totalUsersHaveStores = await prisma.user.count({
      where: {
        stores: {
          some: {},
        },
      },
    });

    return NextResponse.json({ users, totalUsers, totalUsersHaveStores });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
