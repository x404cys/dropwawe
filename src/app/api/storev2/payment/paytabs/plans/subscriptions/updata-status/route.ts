import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { subscriptionPaymentService } from '@/server/services/subscription-payment.service';

interface PatchBody {
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

    const updatedSubscription = await subscriptionPaymentService.updateSubscriptionStatus(
      cartId,
      session.user.id
    );

    return NextResponse.json({ success: true, subscription: updatedSubscription });
  } catch (error: any) {
    if (error.message.includes('Payment not found for cartId')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message === 'Subscription not found for user' || error.message === 'Plan not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Unexpected PATCH error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
