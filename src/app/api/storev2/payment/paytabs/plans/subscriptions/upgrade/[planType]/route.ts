import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import crypto from 'crypto';
import { planRoleMap } from '@/app/lib/planRoleMap';

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
    // const role = planRoleMap[planType];
    // if (role) {
    //   await prisma.user.update({
    //     where: { id: session.user.id },
    //     data: { role: role },
    //   });
    // }

    const plan = await prisma.subscriptionPlan.findFirst({
      where: { type: planType },
    });

    if (!plan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const currentSubscription = await prisma.userSubscription.findUnique({
      where: { userId: session.user.id },
    });

    if (currentSubscription) {
      await prisma.subscriptionHistory.create({
        data: {
          userId: session.user.id,
          planId: currentSubscription.planId,
          subscriptionId: currentSubscription.id,
          startDate: currentSubscription.startDate,
          endDate: currentSubscription.endDate,
          price: plan.price,
          status: 'EXPIRED',
        },
      });
    }

    const subscription = await prisma.userSubscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        planId: plan.id,
        startDate: now,
        endDate,
        isActive: false,
      },
      update: {
        planId: plan.id,
        startDate: now,
        endDate,
        isActive: false,
      },
    });

    await prisma.subscriptionHistory.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        subscriptionId: subscription.id,
        startDate: now,
        endDate,
        price: plan.price,
        status: 'PENDING',
      },
    });

    const cartId = `${session.user.id}-${crypto.randomUUID()}`;

    await prisma.payment.create({
      data: {
        cartId,
        userId: session.user.id,
        planId: plan.id,
        amount: plan.price,
        currency: 'IQD',
        status: 'PENDING',
        customerEmail: session.user.email,
      },
    });

    const PAYTABS_SERVER_KEY = 'S2J9R66GMT-JJ6GGGG62G-KKJ6KRBKDB';
    // const PAYTABS_SERVER_KEY = 'SRJ9DJHRHK-JM2BWN9BZ2-ZHN9G2WRHJ';
    // const PAYTABS_PROFILE_ID = 169218;
    const PAYTABS_PROFILE_ID = 144504;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dashboard.matager.store';

    const CALLBACK_URL = `${SITE_URL}/api/storev2/payment/paytabs/plans/subscriptions/callback`;

    const payload = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: `${cartId}`,
      cart_description: `دفع اشتراك (${planType}) للمستخدم ${session.user.email}`,
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
          message: paytabsResponse.message || 'Payment failed',
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
  } catch (error) {
    console.error('Subscription Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
