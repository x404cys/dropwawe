import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: Request) {
  try {
    const storeId = req.headers.get('x-store-id');
    if (!storeId) return NextResponse.json({ error: 'Store ID missing' }, { status: 400 });

    const balance = await prisma.balance.findUnique({
      where: { storeId },
    });

    return NextResponse.json(balance || { available: 0, pending: 0 }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch store balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}