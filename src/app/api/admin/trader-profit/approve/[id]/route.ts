import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await prisma.$transaction(async tx => {
      const withdrawal = await tx.profitWithdrawal.findUnique({
        where: { id },
      });

      if (!withdrawal || withdrawal.status !== 'PENDING') {
        throw new Error('INVALID');
      }

      await tx.profitWithdrawal.update({
        where: { id },
        data: {
          status: 'APPROVED',
        },
      });

      await tx.traderProfit.update({
        where: { traderId: withdrawal.traderId },
        data: {
          remaining: 0,
          withdraw: false,
        },
      });
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: 'Failed' }, { status: 400 });
  }
}
