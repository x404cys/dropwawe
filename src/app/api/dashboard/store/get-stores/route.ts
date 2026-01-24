import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
export async function GET(req: Request) {
  const session = await getServerSession(authOperation);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = await prisma.store.findMany({
    where: {
      users: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(store);
}
