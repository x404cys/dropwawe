import { NextResponse } from 'next/server';
import { orderPaymentService } from '@/server/services/order-payment.service';

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

    await orderPaymentService.handlePaymentCallback({
      cartId,
      tranRef,
      respStatus,
      respMessage,
      customerEmail,
      signature,
      token,
    });

    const returnUrl =
      `https://www.matager.store/storev2/payment-result` +
      `?tranRef=${encodeURIComponent(tranRef)}` +
      `&respStatus=${encodeURIComponent(respStatus)}` +
      `&respMessage=${encodeURIComponent(respMessage)}` +
      `&cartId=${encodeURIComponent(cartId)}`;

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

    await orderPaymentService.handlePaymentCallback({
      cartId,
      tranRef: data.tranRef ?? '',
      respStatus: data.respStatus ?? '',
      respMessage: data.respMessage ?? '',
      customerEmail: data.customerEmail ?? '',
      signature: data.signature ?? '',
      token: data.token ?? '',
    });

    const returnUrl =
      `https://www.matager.store/s/payment-result` +
      `?tranRef=${encodeURIComponent(data.tranRef ?? '')}` +
      `&respStatus=${encodeURIComponent(data.respStatus ?? '')}` +
      `&respMessage=${encodeURIComponent(data.respMessage ?? '')}` +
      `&cartId=${encodeURIComponent(cartId)}`;

    return NextResponse.redirect(returnUrl, { status: 303 });
  } catch (error) {
    console.error('PayTabs POST callback error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
