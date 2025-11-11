import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const data = Object.fromEntries(url.searchParams.entries());

    console.log('PayTabs Return Data:', data);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/storev2/payment-result?status=${data.respStatus}&cartId=${data.cartId}`
    );
  } catch (err) {
    console.error('Return URL Error:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
