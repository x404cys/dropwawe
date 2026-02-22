import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function POST() {
  const session = await getServerSession(authOperation);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await prisma.$transaction(async tx => {
      const store = await tx.storeUser.findFirst({
        where: { userId: session.user.id },
        select: {
          storeId: true,
        },
      });
      const orderPayment = await tx.paymentOrder.aggregate({
        _sum: { amount: true },
        where: {
          status: 'Success',
          order: {
            storeId: store?.storeId,
          },
        },
      });

      const totalProfit = orderPayment._sum.amount ?? 0;

      let traderProfit = await tx.traderProfit.findUnique({
        where: { traderId: userId },
      });

      if (!traderProfit) {
        traderProfit = await tx.traderProfit.create({
          data: {
            traderId: userId,
            amount: totalProfit,
            remaining: totalProfit,
          },
        });
      }

      const newProfit = totalProfit - traderProfit.amount;

      if (newProfit > 0) {
        traderProfit = await tx.traderProfit.update({
          where: { traderId: userId },
          data: {
            amount: totalProfit,
            remaining: traderProfit.remaining + newProfit,
          },
        });
      }

      if (traderProfit.remaining <= 0) {
        throw new Error('NO_BALANCE');
      }

      const pending = await tx.profitWithdrawal.findFirst({
        where: {
          traderId: userId,
          status: 'PENDING',
        },
      });

      if (pending) {
        throw new Error('PENDING_EXISTS');
      }

      const withdrawal = await tx.profitWithdrawal.create({
        data: {
          traderId: userId,
          amount: traderProfit.remaining,
          status: 'PENDING',
        },
      });

      return {
        withdrawal,
        traderProfit,
      };
    });

    return NextResponse.json({
      message: 'Withdrawal request created',
      totalProfit: result.traderProfit.amount,
      remaining: result.traderProfit.remaining,
      withdrawn: result.traderProfit.amount - result.traderProfit.remaining,
    });
  } catch (error: any) {
    if (error.message === 'NO_BALANCE') {
      return NextResponse.json({ error: 'رصيدك صفر' }, { status: 401 });
    }

    if (error.message === 'PENDING_EXISTS') {
      return NextResponse.json({ error: 'لديك طلب سحب قيد الانتظار' }, { status: 400 });
    }

    console.error(error);

    return NextResponse.json({ error: 'Withdraw failed' }, { status: 500 });
  }
}
