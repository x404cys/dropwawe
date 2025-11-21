import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import crypto from 'crypto';

const SECRET_KEY = 'SRJ9DJHRHK-JM2BWN9BZ2-ZHN9G2WRHJ';

interface PayTabsCallbackData {
  cartId: string;
  userId?: string;
  planId?: string;
  tranRef: string;
  respStatus: string;
  respMessage: string;
  customerEmail?: string;
  signature?: string;
  token?: string;
}

interface VerificationData {
  cartId: string;
  userId?: string;
  planId?: string;
  tranRef: string;
  respStatus: string;
  respMessage: string;
  customerEmail?: string;
  token?: string;
}

// ========== SIGNATURE CHECK ==========
function verifySignature(data: VerificationData, signature: string | undefined): boolean {
  if (!signature) return false;

  const sortedKeys = Object.keys(data).sort();
  const sortedData: Record<string, string | undefined> = {};

  for (const key of sortedKeys) {
    sortedData[key] = data[key as keyof VerificationData];
  }

  const calculated = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(JSON.stringify(sortedData))
    .digest('hex');

  return calculated === signature;
}

async function handlePaymentCallback(data: PayTabsCallbackData) {
  const {
    cartId,
    userId,
    planId,
    tranRef,
    respStatus,
    respMessage,
    customerEmail,
    token,
    signature,
  } = data;

  if (!cartId || !tranRef || !respStatus) {
    return { success: false, reason: 'Missing required fields' };
  }

  const verificationData: VerificationData = {
    cartId,
    userId,
    planId,
    tranRef,
    respStatus,
    respMessage,
    customerEmail,
    token,
  };

  if (signature && !verifySignature(verificationData, signature)) {
    return { success: false, reason: 'Invalid signature' };
  }

  let payment = await prisma.payment.findUnique({ where: { cartId } });

  if (payment) {
    payment = await prisma.payment.update({
      where: { cartId },
      data: {
        tranRef,
        status: respStatus === 'A' ? 'Success' : 'Failed',
        respCode: respStatus,
        respMessage,
        customerEmail,
        signature,
        token,
      },
    });
  } else {
    payment = await prisma.payment.create({
      data: {
        cartId,
        tranRef,
        amount: 0,
        status: respStatus === 'A' ? 'Success' : 'Failed',
        respCode: respStatus,
        respMessage,
        customerEmail,
        signature,
        token,
      },
    });
  }

  // ========== PAYMENT FAILED ==========
  if (respStatus !== 'A') {
    return { success: false, reason: 'Payment failed' };
  }

  // ========== NO PLAN OR USER? ==========
  if (!userId || !planId) {
    return { success: false, reason: 'UserId or PlanId missing' };
  }

  // ========== ACTIVATE SUBSCRIPTION ==========
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan) return { success: false, reason: 'Invalid Plan ID' };

  // deactivate old
  await prisma.userSubscription.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false, canceledAt: new Date() },
  });

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDays);

  // create new subscription
  await prisma.userSubscription.create({
    data: {
      userId,
      planId,
      startDate,
      endDate,
      isActive: true,
      limitProducts: plan.maxProducts ?? null,
    },
  });

  return { success: true };
}

export async function POST(req: Request) {
  try {
    const text = await req.text();

    let body: PayTabsCallbackData;
    try {
      body = JSON.parse(text);
    } catch {
      body = Object.fromEntries(new URLSearchParams(text)) as unknown as PayTabsCallbackData;
    }

    const result = await handlePaymentCallback(body);

    // لا تقم بالـ redirect للـ IPN
    return NextResponse.json({ success: result.success, reason: result.reason }, { status: 200 });
  } catch (err) {
    console.error('POST Callback Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams.entries());
    const data = params as unknown as PayTabsCallbackData;

    const result = await handlePaymentCallback(data);

    return NextResponse.json({ success: result.success, reason: result.reason }, { status: 200 });
  } catch (err) {
    console.error('GET Callback Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
