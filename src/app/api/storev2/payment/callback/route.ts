import { NextResponse } from 'next/server';

// ✅ لمعالجة طلبات PayTabs POST callback
export async function POST(req: Request) {
  try {
    const body = await req.formData().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, message: 'Invalid callback data' },
        { status: 400 }
      );
    }

    const data = Object.fromEntries(body.entries());
    const { tranRef, cartId, respStatus, respMessage } = data;

    console.log('🔔 PayTabs Callback:', data);

    // يمكنك هنا حفظ النتيجة في قاعدة بياناتك أو تحديث حالة الطلب
    if (respStatus === 'A') {
      console.log(`✅ Payment success for cart ${cartId} (tranRef: ${tranRef})`);
    } else {
      console.log(`❌ Payment failed for cart ${cartId}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  console.log(' Callback Received:', params);

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://accseshop.matager.store'}/storev2/payment-result?${url.searchParams.toString()}`
  );
}
