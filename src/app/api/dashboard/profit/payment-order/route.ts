import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET() {
  const session = await getServerSession(authOperation);
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = await prisma.storeUser.findFirst({
    where: { userId: session.user.id },
    select: {
      storeId: true,
    },
  });
  try {
    const orderPayment = await prisma.paymentOrder.findMany({
      where: {
        status: 'Success',
        order: {
          OR: [{ userId: userId }, { storeId: store?.storeId }],
        },
      },
      include: {
        order: {
          include: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return NextResponse.json(orderPayment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch profits' }, { status: 500 });
  }
}
