import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function POST() {
  const session = await getServerSession(authOperation);
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

//   if (session.user.role !== 'DROPSHIPPER') {
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }

  try {
    const profitSum = await prisma.orderFromTraderItem.aggregate({
      where: {
        order: {
          traderId: userId,
          status: 'CONFIRMED',
        },
      },
      _sum: {
        traderProfit: true,
      },
    });

    const totalProfit = profitSum._sum.traderProfit ?? 0;

    let traderProfit = await prisma.traderProfit.findUnique({
      where: { traderId: userId },
    });

    if (!traderProfit) {
      traderProfit = await prisma.traderProfit.create({
        data: {
          traderId: userId,
          amount: totalProfit,
          remaining: totalProfit,
        },
      });

      return NextResponse.json({
        totalProfit,
        remaining: totalProfit,
        withdrawn: 0,
      });
    }

    const newProfit = totalProfit - traderProfit.amount;

    if (newProfit > 0) {
      traderProfit = await prisma.traderProfit.update({
        where: { traderId: userId },
        data: {
          amount: totalProfit,
          remaining: traderProfit.remaining + newProfit,
        },
      });
    }

    return NextResponse.json({
      totalProfit: traderProfit.amount,
      remaining: traderProfit.remaining,
      withdrawn: traderProfit.amount - traderProfit.remaining,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to calculate profits' }, { status: 500 });
  }
}
