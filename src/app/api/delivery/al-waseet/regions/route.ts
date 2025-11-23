import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cityId = req.nextUrl.searchParams.get('city_id');

  try {
    const res = await fetch(`https://api.alwaseet-iq.net/v1/merchant/regions?city_id=${cityId}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
