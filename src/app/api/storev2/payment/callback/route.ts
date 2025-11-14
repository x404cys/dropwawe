import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    console.log('PAYTABS CALLBACK:', data);

    return NextResponse.json({ status: 'ok' });
  } catch (e) {
    return NextResponse.json({ error: true }, { status: 400 });
  }
}
