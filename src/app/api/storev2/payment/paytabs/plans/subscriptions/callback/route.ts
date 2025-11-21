import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import crypto from 'crypto';

const SECRET_KEY = 'SRJ9DJHRHK-JM2BWN9BZ2-ZHN9G2WRHJ';

interface PayTabsCallbackData {
  cartId: string;
  userId: string;
  planId: string;
  tranRef: string;
  respStatus: string;
  respMessage: string;
  customerEmail?: string;
  signature: string;
  token?: string;
}

interface VerificationData {
  cartId: string;
  userId: string;
  planId: string;
  tranRef: string;
  respStatus: string;
  respMessage: string;
  customerEmail?: string;
  token?: string;
}

interface CallbackResult {
  success: boolean;
  reason?: string;
}

// ---------- Verify Signature ----------
function verifySignature(data: VerificationData, signature: string): boolean {
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

// ---------- Main Handler ----------
async function handlePaymentCallback(data: PayTabsCallbackData): Promise<CallbackResult> {
  const {
    cartId,
    userId,
    planId,
    tranRef,
    respStatus,
    respMessage,
    customerEmail,
    signature,
    token,
  } = data;

  const checkData: VerificationData = {
    cartId,
    userId,
    planId,
    tranRef,
    respStatus,
    respMessage,
    customerEmail,
    token,
  };

  const isValidSignature = verifySignature(checkData, signature);

  if (!isValidSignature) {
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

  if (respStatus !== 'A') {
    return { success: false, reason: 'Payment failed' };
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    return { success: false, reason: 'Invalid planId' };
  }

  await prisma.userSubscription.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false, canceledAt: new Date() },
  });

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.durationDays);

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

// ---------- POST ----------
export async function POST(req: Request) {
  const body = (await req.json()) as PayTabsCallbackData;

  const result = await handlePaymentCallback(body);

  const redirectUrl =
    `${new URL(req.url).origin}/storev2/payment-result` +
    `?status=${result.success ? 'success' : 'failed'}`;

  return NextResponse.redirect(redirectUrl, { status: 303 });
}

// ---------- GET ----------
export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams.entries());

  const data: PayTabsCallbackData = {
    cartId: params.cartId,
    userId: params.userId,
    planId: params.planId,
    tranRef: params.tranRef,
    respStatus: params.respStatus,
    respMessage: params.respMessage,
    customerEmail: params.customerEmail,
    signature: params.signature,
    token: params.token,
  };

  const result = await handlePaymentCallback(data);

  const redirectUrl =
    `${new URL(req.url).origin}/storev2/payment-result` +
    `?status=${result.success ? 'success' : 'failed'}`;

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
