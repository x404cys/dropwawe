import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  const session = await getServerSession(authOperation);

  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (session.user.role !== 'A') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const withdrawals = await prisma.profitWithdrawal.findMany({
      include: {
        trader: {
          include: {
            stores: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(withdrawals);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
