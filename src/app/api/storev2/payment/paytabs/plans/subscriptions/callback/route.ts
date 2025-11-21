import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

async function handlePayment(
  cartId: string,
  tranRef: string,
  respStatus: string,
  respMessage: string,
  customerEmail: string,
  signature: string,
  token: string
) {
  const paymentOrder = await prisma.paymentOrder.findUnique({
    where: { cartId },
    include: { order: { include: { items: true } } },
  });

  if (!paymentOrder || !paymentOrder.order) return null;

  const order = paymentOrder.order;

  let paymentRecord = await prisma.payment.findUnique({ where: { cartId } });

  if (paymentRecord) {
    paymentRecord = await prisma.payment.update({
      where: { cartId },
      data: {
        tranRef,
        respCode: respStatus,
        respMessage,
        customerEmail,
        signature,
        token,
        status: respStatus === 'A' ? 'Success' : 'Failed',
      },
    });
  } else {
    paymentRecord = await prisma.payment.create({
      data: {
        cartId,
        tranRef,
        respCode: respStatus,
        respMessage,
        customerEmail,
        signature,
        token,
        amount: order.total || 0,
        status: respStatus === 'A' ? 'Success' : 'Failed',
      },
    });
  }

  if (respStatus === 'A') {
    await Promise.all(
      order.items
        .filter(item => !!item.productId)
        .map(item =>
          prisma.product.update({
            where: { id: item.productId! },
            data: { quantity: { decrement: item.quantity } },
          })
        )
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'DELIVERED' },
    });
  } else {
    await prisma.payment.delete({ where: { cartId } });
  }

  return paymentRecord;
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;

  const cartId = params.get('cartId') ?? '';
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const customerEmail = params.get('customerEmail') ?? '';
  const signature = params.get('signature') ?? '';
  const token = params.get('token') ?? '';

  await handlePayment(cartId, tranRef, respStatus, respMessage, customerEmail, signature, token);

  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${encodeURIComponent(
    tranRef
  )}&respStatus=${encodeURIComponent(respStatus)}&respMessage=${encodeURIComponent(
    respMessage
  )}&cartId=${encodeURIComponent(cartId)}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);

  const cartId = params.get('cartId') ?? '';
  const tranRef = params.get('tranRef') ?? '';
  const respStatus = params.get('respStatus') ?? '';
  const respMessage = params.get('respMessage') ?? '';
  const customerEmail = params.get('customerEmail') ?? '';
  const signature = params.get('signature') ?? '';
  const token = params.get('token') ?? '';

  await handlePayment(cartId, tranRef, respStatus, respMessage, customerEmail, signature, token);

  const returnUrl = `${new URL(req.url).origin}/storev2/payment-result?tranRef=${encodeURIComponent(
    tranRef
  )}&respStatus=${encodeURIComponent(respStatus)}&respMessage=${encodeURIComponent(
    respMessage
  )}&cartId=${encodeURIComponent(cartId)}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}
