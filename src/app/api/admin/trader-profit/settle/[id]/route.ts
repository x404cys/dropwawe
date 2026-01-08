import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOperation);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'A') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const { id } = await context.params;
    const traderProfit = await prisma.traderProfit.findUnique({
      where: { id: id },
    });

    if (!traderProfit || !traderProfit.withdraw) {
      return NextResponse.json({ error: 'Invalid withdrawal request' }, { status: 400 });
    }

    await prisma.traderProfit.update({
      where: { id: id },
      data: {
        withdraw: false,
        remaining: 0,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SETTLE ERROR:', error?.message, error);
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
