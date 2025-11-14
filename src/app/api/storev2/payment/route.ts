import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, amount, cart_id, description } = body;

    if (!amount || !cart_id)
      return NextResponse.json(
        { success: false, message: 'Missing amount/cart_id' },
        { status: 400 }
      );

    const PAYTABS_SERVER_KEY = 'SRJ9DJHRHK-JM2BWN9BZ2-ZHN9G2WRHJ';
    const PAYTABS_PROFILE_ID = 169218;

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const CALLBACK_URL = `${SITE_URL}/api/storev2/payment/callback`;
    const RETURN_URL = `${SITE_URL}/storev2/payment-result`;

    const payload = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: cart_id,
      cart_description: description || `طلب من ${name || 'عميل'}`,
      cart_currency: 'IQD',
      cart_amount: amount,
      callback: CALLBACK_URL,
      return: CALLBACK_URL,
      customer_details: {
        name: name || ' ',
        email: 'no-reply@example.com',
        phone: phone || '',
        street1: address || '',
        city: 'Baghdad',
        country: 'IQ',
      },
    };

    const response = await fetch('https://secure-iraq.paytabs.com/payment/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: PAYTABS_SERVER_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.redirect_url)
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create payment' },
        { status: 400 }
      );

    return NextResponse.json({ success: true, redirect_url: data.redirect_url });
  } catch (err) {
    console.error('Error creating payment:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
