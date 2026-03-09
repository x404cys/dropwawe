import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const storeId = req.headers.get('x-store-id');
    if (!storeId) return NextResponse.json({ error: 'Store ID missing' }, { status: 400 });

    const balance = await prisma.balance.findUnique({ where: { storeId } });
    if (!balance || balance.available <= 0)
      return NextResponse.json({ error: 'No available balance to withdraw' }, { status: 400 });

    const withdrawAmount = balance.available;

    const withdrawal = await prisma.withdrawal.create({
      data: {
        storeId,
        amount: withdrawAmount,
        status: 'PENDING',
      },
    });

    await prisma.balance.update({
      where: { storeId },
      data: {
        available: 0,
        pending: balance.pending + withdrawAmount,
      },
    });

    await prisma.ledger.create({
      data: {
        storeId,
        type: 'WITHDRAW_REQUEST',
        amount: withdrawAmount,
        note: 'طلب سحب مستحقات',
      },
    });

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error) {
    console.error('Failed to request withdraw:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
