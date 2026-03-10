import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET(req: Request) {
  const session = await getServerSession(authOperation);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (session.user.role !== 'A') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get('storeId');

  if (!storeId) {
    return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
  }

  try {
    const storeUser = await prisma.storeUser.findFirst({
      where: {
        storeId: storeId,
      },
    });

    if (!storeUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ledgers = await prisma.ledger.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      include: {
        store: true,
        order: {
          select: {
            id: true,
            createdAt: true,
            total: true,
          },
        },
      },
    });

    const balance = await prisma.balance.findUnique({
      where: { storeId },
    });

    return NextResponse.json({
      balance: balance || { available: 0, pending: 0 },
      history: ledgers,
    });
  } catch (e) {
    console.error('Failed to fetch ledger history', e);
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 });
  }
}
