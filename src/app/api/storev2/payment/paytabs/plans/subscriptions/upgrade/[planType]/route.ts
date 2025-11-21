import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ planType: string }> }
) {
  try {
    const session = await getServerSession(authOperation);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { planType } = await context.params;

    if (!planType) {
      return NextResponse.json({ error: 'Plan does not selected' }, { status: 401 });
    }

    const allowedTypes = ['NORMAL', 'MODREN', 'PENDINGPROFESSIONAL'];

    if (!allowedTypes.includes(planType)) {
      return NextResponse.json({ message: 'Invalid plan type' }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.findFirst({
      where: { type: planType },
    });
    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    const existing = await prisma.userSubscription.findFirst({
      where: {
        userId: session.user.id,
        planId: plan.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'User already subscribed to this plan' },
        { status: 401 }
      );
    } else {
      const uuid = crypto.randomUUID();

      const PAYTABS_SERVER_KEY = 'SRJ9DJHRHK-JM2BWN9BZ2-ZHN9G2WRHJ';
      const PAYTABS_PROFILE_ID = 169218;

      const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://accseshop.matager.store';

      const CALLBACK_URL = `${SITE_URL}/api/storev2/payment/paytabs/plans/subscriptions/callback`;

      const payload = {
        profile_id: PAYTABS_PROFILE_ID,
        tran_type: 'sale',
        tran_class: 'ecom',
        cart_id: `${session.user.id}-${uuid}`,
        cart_description: `دفع خطة (${planType}) للمستخدم ${session.user.email}`,
        cart_currency: 'IQD',
        cart_amount: plan.price,
        callback: CALLBACK_URL,
        return: CALLBACK_URL,
        customer_details: {
          email: session.user.email,
          city: 'Baghdad',
          country: 'IQ',
        },
      };

      const response = await fetch('https://secure-iraq.paytabs.com/payment/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: PAYTABS_SERVER_KEY,
        },
        body: JSON.stringify(payload),
      });

      const paytabsResponse = await response.json();

      if (!response.ok || !paytabsResponse.redirect_url) {
        return NextResponse.json(
          {
            success: false,
            message: paytabsResponse.message || 'Failed to create payment',
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          redirect_url: paytabsResponse.redirect_url,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Upgrade Subscription Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
