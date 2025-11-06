import { NextResponse } from 'next/server';

const PAYTABS_PROFILE_ID = process.env.PAYTABS_PROFILE_ID!;
const PAYTABS_SERVER_KEY = process.env.PAYTABS_SERVER_KEY!;
const PAYTABS_API_URL = 'https://secure-iraq.paytabs.com/payment/request';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, amount, email, cart_id, description } = body;

    if (!token || !amount) {
      return NextResponse.json({ success: false, message: 'البيانات ناقصة.' }, { status: 400 });
    }

    const payload = {
      profile_id: PAYTABS_PROFILE_ID,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id,
      cart_currency: 'IQD',
      cart_amount: Number(amount),
      cart_description: description || 'طلب جديد من المتجر',
      token,
      customer_details: {
        name: 'عميل المتجر',
        email,
        phone: '0000000000',
        street1: 'Baghdad',
        city: 'Baghdad',
        country: 'IQ',
      },
      return: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      callback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
    };

    const res = await fetch(PAYTABS_API_URL, {
      method: 'POST',
      headers: {
        Authorization: PAYTABS_SERVER_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        message: 'فشل إرسال الطلب إلى PayTabs',
        details: data,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء طلب الدفع بنجاح',
      data,
    });
  } catch (error: any) {
    console.error('PayTabs Error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم', error: error.message },
      { status: 500 }
    );
  }
}
