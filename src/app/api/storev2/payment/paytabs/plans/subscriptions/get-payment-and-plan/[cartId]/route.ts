import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { subscriptionPaymentService } from '@/server/services/subscription-payment.service';

export async function GET(req: Request, context: { params: Promise<{ cartId: string }> }) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { cartId } = await context.params;

    const details = await subscriptionPaymentService.getPaymentAndPlanDetails(
      cartId,
      session.user.id
    );
    return NextResponse.json(details);
  } catch (error: any) {
    if (error.message === 'Payment not found') {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }
    if (error.message === 'userSubscription not found') {
      return NextResponse.json({ message: 'userSubscription not found' }, { status: 404 });
    }
    console.error('Error fetching subscription details:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
