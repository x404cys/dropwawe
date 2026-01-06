import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

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

  if (!paymentOrder || !paymentOrder.order) {
    return null;
  }

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
    await prisma.payment.delete({
      where: { cartId },
    });
  }

  return paymentRecord;
}

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  let data: Record<string, string> = {};

  if (contentType.includes('application/json')) {
    data = await req.json();
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    params.forEach((v, k) => (data[k] = v));
  } else if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    for (const [key, value] of form.entries()) {
      data[key] = typeof value === 'string' ? value : '';
    }
  } else {
    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
  }
  const userId = await prisma.payment.findUnique({
    where: {
      cartId: data.cartId,
    },
  });
  if (!userId) return NextResponse.json('userId not found');
  if (data.respStatus === 'A') {
    try {
      const plan = await prisma.userSubscription.update({
        where: {
          userId: userId.id,
        },
        data: {
          isActive: true,
        },
      });
      if (!plan) {
        throw new Error('Plan not found');
      }

      await prisma.payment.update({
        where: { cartId: data.cartId },
        data: {
          tranRef: data.tranRef,
          respCode: data.respCode,
          respMessage: data.respMessage,
          customerEmail: data.customerEmail,
          signature: data.signature,
          token: data.token,
          status: data.status,
          currency: data.currency,
        },
      });
    } catch (e) {
      return NextResponse.json(
        { error: `Failed to add payment/subscription: ${e}` },
        { status: 500 }
      );
    }
  }

  await handlePayment(
    data.cartId ?? '',
    data.tranRef ?? '',
    data.respStatus ?? '',
    data.respMessage ?? '',
    data.customerEmail ?? '',
    data.signature ?? '',
    data.token ?? ''
  );

  const returnUrl =
    `${new URL(req.url).origin}/Dashboard/payment-result` +
    `?tranRef=${encodeURIComponent(data.tranRef || '')}` +
    `&respStatus=${encodeURIComponent(data.respStatus || '')}` +
    `&respMessage=${encodeURIComponent(data.respMessage || '')}` +
    `&cartId=${encodeURIComponent(data.cartId || '')}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}
