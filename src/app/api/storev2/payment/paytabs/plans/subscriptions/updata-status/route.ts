import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOperation);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tranRef, respCode, respMessage, cartId } = await req.json();

  if (!cartId) {
    return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
  }

  const checkPayment = await prisma.payment.findUnique({
    where: { cartId },
  });

  if (!checkPayment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  const subscription = await prisma.userSubscription.findFirst({
    where: { userId: session.user.id },
  });

  if (!subscription) {
    console.log('errrrrrrrror ');
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }

  const updated = await prisma.userSubscription.update({
    where: { id: subscription.id },
    data: {
      isActive: true,
    },
  });

  return NextResponse.json({ success: true, subscription: updated });
}