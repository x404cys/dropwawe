import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payment_token, amount, cart_id, description } = body;

    if (!payment_token) {
      return NextResponse.json(
        { success: false, message: 'Missing payment token' },
        { status: 400 }
      );
    }

    const paymentData = {
      profile_id: process.env.PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id,
      cart_currency: 'IQD',
      cart_amount: amount,
      payment_token,
      description,
      customer_details: {
        name: 'اسم العميل',
        email: 'email@example.com',
        phone: '078xxxxxxxx',
      },
      callback: 'https://accseshop.matager.store/',
    };

    const response = await fetch('https://secure-iraq.paytabs.com/payment/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYTABS_SECRET_KEY}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json(
        { success: false, message: data.message || 'Payment failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Payment processed successfully', data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
