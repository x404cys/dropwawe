import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET() {
  const session = await getServerSession(authOperation);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const traderProfit = await prisma.traderProfit.findUnique({
      where: { traderId: userId },
    });

    const withdrawals = await prisma.profitWithdrawal.findMany({
      where: { traderId: userId },
      orderBy: { createdAt: 'desc' },
    });

    const pendingAmount = withdrawals
      .filter(w => w.status === 'PENDING')
      .reduce((sum, w) => sum + w.amount, 0);

    return NextResponse.json({
      totalProfit: traderProfit?.amount ?? 0,
      remaining: traderProfit?.remaining ?? 0,
      withdrawn: (traderProfit?.amount ?? 0) - (traderProfit?.remaining ?? 0),
      pendingAmount,
      withdrawals,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load statement' }, { status: 500 });
  }
}
