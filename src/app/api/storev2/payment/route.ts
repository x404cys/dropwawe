import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, amount, cart_id, description } = body;

    if (!amount || !cart_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (amount, cart_id)' },
        { status: 400 }
      );
    }

    const PAYTABS_PROFILE_ID = process.env.PAYTABS_PROFILE_ID!;
    const PAYTABS_SERVER_KEY = process.env.PAYTABS_SECRET_KEY!;
    const RETURN_URL = process.env.PAYTABS_RETURN_URL || 'https://yourdomain.com/storev2/success';
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

    const paymentRequest = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id,
      cart_currency: 'IQD',
      cart_amount: amount,
      cart_description: description || `طلب من ${name}`,
      customer_details: {
        name: name || 'عميل',
        email: 'no-reply@example.com',
        phone: phone || '',
        street1: address || '',
        city: 'Baghdad',
        country: 'IQ',
      },
      return: RETURN_URL,
      callback: `${SITE_URL}/api/storev2/payment/callback`,
    };

    const response = await fetch('https://secure-iraq.paytabs.com/payment/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAYTABS_SERVER_KEY}`,
      },
      body: JSON.stringify(paymentRequest),
    });

    const data = await response.json();

    if (!response.ok || !data.redirect_url) {
      return NextResponse.json(
        { success: false, message: data.message || 'Payment request failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      redirect_url: data.redirect_url,
    });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
