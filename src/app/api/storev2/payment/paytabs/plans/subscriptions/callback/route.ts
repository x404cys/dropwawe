import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  let data: Record<string, string> = {};

  if (contentType.includes('application/json')) {
    data = await req.json();
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    params.forEach((v, k) => (data[k] = v));
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
  }
  // if (data.cartId) return NextResponse.json(data.cartId);
  if (!data.cartId) return NextResponse.json('cartId not found ');
  const payment = await prisma.payment.findUnique({
    where: { cartId: data.cartId },
  });

  if (!payment) {
    return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
  }

  if (data.respStatus === 'A') {
    await prisma.$transaction([
      prisma.userSubscription.update({
        where: { userId: payment.userId },
        data: { isActive: true },
      }),

      prisma.payment.update({
        where: { cartId: data.cartId },
        data: {
          tranRef: data.tranRef,
          respCode: data.respCode,
          respMessage: data.respMessage,
          customerEmail: data.customerEmail,
          signature: data.signature,
          token: data.token,
          status: 'SUCCESS',
        },
      }),
    ]);
  } else {
    await prisma.payment.update({
      where: { cartId: data.cartId },
      data: {
        tranRef: data.tranRef,
        respCode: data.respCode,
        respMessage: data.respMessage,
        status: 'FAILED',
      },
    });
  }

  const returnUrl =
    `https://dashboard.matager.store/Dashboard/payment-result` +
    `?tranRef=${encodeURIComponent(data.tranRef || '')}` +
    `&respStatus=${encodeURIComponent(data.respStatus || '')}` +
    `&respMessage=${encodeURIComponent(data.respMessage || '')}` +
    `&cartId=${encodeURIComponent(data.cartId || '')}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}
