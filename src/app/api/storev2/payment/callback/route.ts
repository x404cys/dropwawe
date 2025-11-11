import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    console.log('PayTabs IPN Data:', data);

    return NextResponse.json({ success: true, received: data }, { status: 200 });
  } catch (err) {
    console.error('IPN Error:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
