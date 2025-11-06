import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const count = await prisma.order.count({
    where: { userId, status: 'PENDING' },
  });

  return NextResponse.json({ count });
}
