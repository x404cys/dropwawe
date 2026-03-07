import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET(req: Request) {
  const session = await getServerSession(authOperation);

  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const lastProducts = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  return NextResponse.json(lastProducts);
}
