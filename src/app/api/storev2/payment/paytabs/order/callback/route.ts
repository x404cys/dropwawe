import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

async function handlePayment(data: {
  cartId: string;
  tranRef: string;
  respStatus: string;
  respMessage: string;
  customerEmail?: string;
  signature?: string;
  token?: string;
}) {
  const { cartId, tranRef, respStatus, respMessage, customerEmail, signature, token } = data;

  if (!cartId) return null;

  const paymentOrder = await prisma.paymentOrder.findUnique({
    where: { cartId },
    include: {
      order: {
        include: { items: true },
      },
    },
  });
  const paymentOrderFromTrader = await prisma.orderFromTraderPayment.findUnique({
    where: { cartId },
    include: {
      order: {
        include: { items: true },
      },
    },
  });
  if (!paymentOrder || !paymentOrder.order) return null;

  if (paymentOrder.status === 'Success') {
    return paymentOrder;
  }

  await prisma.paymentOrder.update({
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

  await prisma.orderFromTraderPayment.update({
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

  if (respStatus === 'A') {
    await Promise.all(
      paymentOrder.order.items.map(item =>
        prisma.product.update({
          where: { id: item.productId! },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        })
      )
    );

    await prisma.order.update({
      where: { id: paymentOrder.order.id },
      data: {
        status: 'DELIVERED',
      },
    });
  }

  return paymentOrder;
}

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;

    const cartId = params.get('cartId') ?? params.get('cart_id') ?? '';

    const tranRef = params.get('tranRef') ?? '';
    const respStatus = params.get('respStatus') ?? '';
    const respMessage = params.get('respMessage') ?? '';
    const customerEmail = params.get('customerEmail') ?? '';
    const signature = params.get('signature') ?? '';
    const token = params.get('token') ?? '';

    await handlePayment({
      cartId,
      tranRef,
      respStatus,
      respMessage,
      customerEmail,
      signature,
      token,
    });

    const returnUrl = `https://www.dropwave.cloud/storev2/payment-result?tranRef=${tranRef}&respStatus=${respStatus}&respMessage=${encodeURIComponent(
      respMessage
    )}&cartId=${cartId}`;

    return NextResponse.redirect(returnUrl, { status: 303 });
  } catch (error) {
    console.error('PayTabs GET callback error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      data[key] = typeof value === 'string' ? value : '';
    }

    const cartId = data.cartId || data.cart_id || '';

    await handlePayment({
      cartId,
      tranRef: data.tranRef ?? '',
      respStatus: data.respStatus ?? '',
      respMessage: data.respMessage ?? '',
      customerEmail: data.customerEmail ?? '',
      signature: data.signature ?? '',
      token: data.token ?? '',
    });

    const returnUrl = `https://www.dropwave.cloud/storev2/payment-result?tranRef=${data.tranRef}&respStatus=${data.respStatus}&respMessage=${encodeURIComponent(
      data.respMessage
    )}&cartId=${cartId}`;

    return NextResponse.redirect(returnUrl, { status: 303 });
  } catch (error) {
    console.error('PayTabs POST callback error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
