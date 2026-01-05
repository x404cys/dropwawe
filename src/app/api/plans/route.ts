import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const subscription = await prisma.subscriptionPlan.findMany();

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
