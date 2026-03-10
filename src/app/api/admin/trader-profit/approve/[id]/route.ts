import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOperation);
    if (!session || session.user.role !== 'A') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.$transaction(async tx => {
      const withdrawal = await tx.withdrawal.findUnique({
        where: { id },
      });

      if (!withdrawal || withdrawal.status !== 'PENDING') {
        throw new Error('INVALID');
      }

      await tx.withdrawal.update({
        where: { id },
        data: {
          status: 'APPROVED',
        },
      });

      const balance = await tx.balance.findUnique({
        where: { storeId: withdrawal.storeId },
      });

      if (balance) {
        await tx.balance.update({
          where: { storeId: withdrawal.storeId },
          data: {
            pending: {
              decrement: withdrawal.amount,
            },
          },
        });
      }

      await tx.ledger.create({
        data: {
          storeId: withdrawal.storeId,
          type: 'WITHDRAW_APPROVED',
          amount: withdrawal.amount,
          balanceAfter: balance ? balance.available : 0,
          note: withdrawal.method ? `تم التسديد عبر ${withdrawal.method}` : 'تم التسديد',
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('APPROVE WITHDRAWAL ERROR', e);
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}
