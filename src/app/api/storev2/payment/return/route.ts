import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    console.log('PayTabs Return POST Data:', data);

    const { respStatus, cartId } = data;
    if (!respStatus || !cartId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/storev2/payment-result?status=${respStatus}&cartId=${cartId}`;
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('Return URL Error:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
