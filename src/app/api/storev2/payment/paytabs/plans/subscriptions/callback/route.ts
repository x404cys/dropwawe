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
    await prisma.payment.delete({
      where: { cartId },
    });
  }

  return paymentRecord;
}

// export async function GET(req: Request) {
//   const params = new URL(req.url).searchParams;

//   const cartId = params.get('cartId') ?? '';
//   const tranRef = params.get('tranRef') ?? '';
//   const respStatus = params.get('respStatus') ?? '';
//   const respMessage = params.get('respMessage') ?? '';
//   const customerEmail = params.get('customerEmail') ?? '';
//   const signature = params.get('signature') ?? '';
//   const token = params.get('token') ?? '';

//   await handlePayment(cartId, tranRef, respStatus, respMessage, customerEmail, signature, token);

//   const returnUrl =
//     `${new URL(req.url).origin}/storev2/payment-result` +
//     `?tranRef=${encodeURIComponent(tranRef)}` +
//     `&respStatus=${encodeURIComponent(respStatus)}` +
//     `&respMessage=${encodeURIComponent(respMessage)}` +
//     `&cartId=${encodeURIComponent(cartId)}`;

//   return NextResponse.redirect(returnUrl, { status: 303 });
// }

export async function POST(req: Request) {
  const session = await getServerSession(authOperation);
  if (!session?.user.id) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
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

  if (data.respStatus === 'A') {
    try {
      const plan = await prisma.subscriptionPlan.findFirst({
        where: { type: 'MODREN' },
      });
      if (!plan) {
        throw new Error('Plan not found');
      }

      await prisma.payment.create({
        data: {
          cartId: data.cartId ?? '',
          tranRef: data.tranRef ?? '',
          respCode: data.respStatus ?? '',
          respMessage: data.respMessage ?? '',
          customerEmail: data.customerEmail ?? '',
          signature: data.signature ?? '',
          token: data.token ?? '',
          amount: plan?.price,
          status: data.respStatus,
        },
      });

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationDays);
      await prisma.userSubscription.create({
        data: {
          userId: session?.user.id,
          planId: plan.id,
          startDate,
          endDate,
          isActive: true,
          limitProducts: plan.maxProducts ?? null,
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
    `${new URL(req.url).origin}/storev2/payment-result` +
    `?tranRef=${encodeURIComponent(data.tranRef || '')}` +
    `&respStatus=${encodeURIComponent(data.respStatus || '')}` +
    `&respMessage=${encodeURIComponent(data.respMessage || '')}` +
    `&cartId=${encodeURIComponent(data.cartId || '')}`;

  return NextResponse.redirect(returnUrl, { status: 303 });
}
