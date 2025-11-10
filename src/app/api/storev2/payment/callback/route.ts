import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const { tranRef, cartId, respStatus, respMessage } = data;

    console.log('  PayTabs Callback Received:', data);

    if (respStatus === 'A') {
      console.log(`  Payment SUCCESS for cart ${cartId} - TranRef: ${tranRef}`);
    } else {
      console.log(`  Payment FAILED for cart ${cartId} - Reason: ${respMessage}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true });
}
