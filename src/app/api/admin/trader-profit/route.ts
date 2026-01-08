import { authOperation } from '@/app/lib/authOperation';
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

    const traderProfit = await prisma.traderProfit.findMany({
      include: {
        trader: {
          include: {
            Store: true,
            UserSubscription: {
              include: {
                plan: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(traderProfit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
