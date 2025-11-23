import { getValidToken } from '@/app/(page)/Dashboard/_utils/merchant';
import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

interface DeliveryOrder {
  client_name: string;
  client_mobile: string;
  city_id: string;
  region_id: string;
  location: string;
  type_name: string;
  items_number: number;
  price: number;
  package_size: string;
  merchant_notes?: string;
  replacement?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { username, order }: { username: string; order: DeliveryOrder } = await req.json();

    const token = await getValidToken(username);

    const formData = new URLSearchParams({
      client_name: order.client_name,
      client_mobile: order.client_mobile,
      city_id: order.city_id,
      region_id: order.region_id,
      location: order.location,
      type_name: order.type_name,
      items_number: order.items_number.toString(),
      price: order.price.toString(),
      package_size: order.package_size,
      replacement: (order.replacement ?? 0).toString(),
    });

    if (order.merchant_notes) formData.append('merchant_notes', order.merchant_notes);

    const res = await fetch(`https://api.alwaseet-iq.net/v1/merchant/create-order?token=${token}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: false, msg: error }, { status: 500 });
  }
}
