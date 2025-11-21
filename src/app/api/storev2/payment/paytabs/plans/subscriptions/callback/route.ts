import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import crypto from 'crypto';

const SECRET_KEY = process.env.PAYTABS_SECRET_KEY!;

function verifySignature(data: Record<string, any>, signature: string) {
  const sortedKeys = Object.keys(data).sort();
  const sortedData: Record<string, any> = {};

  for (const key of sortedKeys) {
    sortedData[key] = data[key];
  }

  const calculated = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(JSON.stringify(sortedData))
    .digest('hex');

  return calculated === signature;
}

async function handlePaymentCallback(data: any) {
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

  // ======== 1) التحقق من التوقيع الأمني ========
  const isValidSignature = verifySignature(
    {
      cartId,
      userId,
      planId,
      tranRef,
      respStatus,
      respMessage,
      customerEmail,
      token,
    },
    signature
  );

  if (!isValidSignature) {
    console.log('❌ Invalid signature — potential fraud attempt');
    return { success: false, reason: 'Invalid signature' };
  }

  // ======== 2) حفظ الدفع في جدول Payment ========
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

  // ======== 3) إذا الدفع فاشل لا نسوي اشتراك ========
  if (respStatus !== 'A') {
    return { success: false, reason: 'Payment failed' };
  }

  // ======== 4) جلب تفاصيل خطة الاشتراك ========
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    return { success: false, reason: 'Invalid planId' };
  }

  // ======== 5) تعطيل الاشتراكات السابقة للمستخدم ========
  await prisma.userSubscription.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false, canceledAt: new Date() },
  });

  // ======== 6) إنشاء اشتراك جديد ========
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

export async function POST(req: Request) {
  const body = await req.json();

  const result = await handlePaymentCallback(body);

  const redirectUrl =
    `${new URL(req.url).origin}/storev2/payment-result` +
    `?status=${result.success ? 'success' : 'failed'}`;

  return NextResponse.redirect(redirectUrl, { status: 303 });
}

export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams.entries());

  const result = await handlePaymentCallback(params);

  const redirectUrl =
    `${new URL(req.url).origin}/storev2/payment-result` +
    `?status=${result.success ? 'success' : 'failed'}`;

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
