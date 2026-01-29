import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

interface PatchBody {
  tranRef?: string;
  respCode?: string;
  respMessage?: string;
  cartId: string;
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized: no session found' }, { status: 401 });
    }

    const body: PatchBody = await req.json().catch(() => ({}) as PatchBody);
    const { cartId } = body;

    if (!cartId) {
      return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
    }

    const checkPayment = await prisma.payment.findUnique({ where: { cartId } });
    if (!checkPayment) {
      return NextResponse.json(
        { error: `Payment not found for cartId: ${cartId}` },
        { status: 404 }
      );
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: session.user.id },
    });
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found for user' }, { status: 404 });
    }

    const updated = await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: { isActive: true },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error('Unexpected PATCH error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
