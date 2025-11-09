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

    console.log('  Received Payment Data:', { payment_token, amount, cart_id, description });

    return NextResponse.json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('  Error in payment route:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
