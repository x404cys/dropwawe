import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: Request) {
  try {
    const storeId = req.headers.get('x-store-id');
    if (!storeId) return NextResponse.json({ error: 'Store ID missing' }, { status: 400 });

    const ledger = await prisma.ledger.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(ledger, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch store ledger:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
