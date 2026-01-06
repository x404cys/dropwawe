import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET(req: Request, context: { params: Promise<{ cartId: string }> }) {
  const session = await getServerSession(authOperation);
  const { cartId } = await context.params;

  const payment = await prisma.payment.findUnique({
    where: { cartId: cartId },
  });
  if (!payment) return NextResponse.json({ message: 'Payment not found' }, { status: 404 });

  const userSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId: session?.user.id,
    },
    include: {
      plan: true,
    },
  });
  if (!userSubscription)
    return NextResponse.json({ message: 'userSubscription not found' }, { status: 404 });
  return NextResponse.json({ payment, userSubscription });
}