import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { subscriptionPaymentService } from '@/server/services/subscription-payment.service';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ planType: string }> }
) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { planType } = await context.params;
    if (!planType) {
      return NextResponse.json({ message: 'Plan type is required' }, { status: 402 });
    }

    const redirect_url = await subscriptionPaymentService.createUpgradePayment(
      session.user.id,
      session.user.email,
      planType
    );

    return NextResponse.json(
      {
        success: true,
        redirect_url,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Plan not found') {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }
    if (error.message === 'Payment failed') {
      return NextResponse.json({ success: false, message: 'Payment failed' }, { status: 400 });
    }
    console.error('Subscription Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
