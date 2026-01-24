import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await context.params;

  if (!storeId) {
    return NextResponse.json(
      {
        error: 'storeId not found ',
      },
      { status: 400 }
    );
  }

  try {
    const Order = await prisma.order.findMany({
      where: { storeId: storeId },
    });

    return NextResponse.json(Order);
  } catch (error) {
    return NextResponse.json({ error: 'error get Data ' }, { status: 500 });
  }
}
