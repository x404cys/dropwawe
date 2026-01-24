import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
export async function GET(req: Request) {
  const session = await getServerSession(authOperation);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = await prisma.store.findFirst({
    where: {
      users: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });
  const users = await prisma.storeUser.findMany({
    where: {
      storeId: store?.id || '',
    },
    include: {
      user: true,
    },
  });

  return NextResponse.json(users);
}
