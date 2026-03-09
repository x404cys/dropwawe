import { NextResponse } from 'next/server';
import { subscriptionPaymentService } from '@/server/services/subscription-payment.service';

export async function POST(req: Request) {
  try {
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

    if (!data.cartId) return NextResponse.json('cartId not found ');

    await subscriptionPaymentService.handleSubscriptionCallback({
      cartId: data.cartId,
      tranRef: data.tranRef || '',
      respStatus: data.respStatus || '',
      respMessage: data.respMessage || '',
      customerEmail: data.customerEmail || '',
      signature: data.signature || '',
      token: data.token || '',
    });

    const returnUrl =
      `https://dashboard.matager.store/Dashboard/payment-result` +
      `?tranRef=${encodeURIComponent(data.tranRef || '')}` +
      `&respStatus=${encodeURIComponent(data.respStatus || '')}` +
      `&respMessage=${encodeURIComponent(data.respMessage || '')}` +
      `&cartId=${encodeURIComponent(data.cartId || '')}`;

    return NextResponse.redirect(returnUrl, { status: 303 });
  } catch (error: any) {
    if (error.message === 'Payment record not found') {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }
    console.error('PayTabs Subscription Callback Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
