import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const coupons = await prisma.coupon.findMany();

  return NextResponse.json(coupons);
}
