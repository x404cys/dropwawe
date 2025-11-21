import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

async function handleSubscriptionPayment(
  userId: string,
  tranRef: string,
  respStatus: string,
  respMessage: string,
  signature: string,
  token: string
) {
  const paymentRecord = await prisma.payment.create({
    data: {
      cartId: 'oopopqw-e-0-31023',
      amount: 123,
      tranRef,
      respCode: respStatus,
      respMessage,
      signature,
      token,
      status: respStatus === 'A' ? 'Success' : 'Failed',
    },
  });

  if (respStatus === 'A') {
    await prisma.userSubscription.updateMany({
      where: { userId },
      data: { isActive: true },
    });
  }

  return paymentRecord;
}

// -------------------------------------------------------
//                    GET Handler
// -------------------------------------------------------
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;

  const userId = params.get('cartId') ?? '';
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const signature = params.get('signature') ?? '';
  const token = params.get('token') ?? '';

  await handleSubscriptionPayment(userId, tranRef, respStatus, respMessage, signature, token);

  const returnUrl =
    `${new URL(req.url).origin}/storev2/subscription-result` +
    `?tranRef=${encodeURIComponent(tranRef)}` +
    `&respStatus=${encodeURIComponent(respStatus)}` +
    `&respMessage=${encodeURIComponent(respMessage)}` +
    `&userId=${encodeURIComponent(userId)}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}

// -------------------------------------------------------
//                    POST Handler
// -------------------------------------------------------
export async function POST(req: Request) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);

  const userId = params.get('cartId') ?? '';
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const signature = params.get('signature') ?? '';
  const token = params.get('token') ?? '';

  await handleSubscriptionPayment(userId, tranRef, respStatus, respMessage, signature, token);

  const returnUrl =
    `${new URL(req.url).origin}/storev2/subscription-result` +
    `?tranRef=${encodeURIComponent(tranRef)}` +
    `&respStatus=${encodeURIComponent(respStatus)}` +
    `&respMessage=${encodeURIComponent(respMessage)}` +
    `&userId=${encodeURIComponent(userId)}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}
