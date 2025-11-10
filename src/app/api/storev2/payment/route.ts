import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, amount, cart_id, description } = body;

    const payload = {
      profile_id: 169218,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: cart_id || `order-${Date.now()}`,
      cart_description: description || 'طلب جديد',
      cart_currency: 'IQD',
      cart_amount: amount,
      callback: 'https://yourdomain.com/api/storev2/payment/callback',
      return: 'https://yourdomain.com/storev2/success',
      customer_details: {
        name,
        email: 'customer@email.com',
        phone,
        street1: address || 'Baghdad',
        city: 'Baghdad',
        country: 'IQ',
        ip: '127.0.0.1',
      },
    };

    const response = await fetch('https://secure-iraq.paytabs.com/payment/request', {
      method: 'POST',
      headers: {
        Authorization: 'SRJ9DJHRHK-JM2BWN9BZ2-ZHN9G2WRHJ',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.redirect_url) {
      return NextResponse.json({ success: true, redirect_url: data.redirect_url });
    }

    return NextResponse.json({
      success: false,
      message: data.message || 'Payment request failed',
      data,
    });
  } catch (error) {
    console.error('Payment request error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
