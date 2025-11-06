import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        user: {
          include: {
            Product: true,
            Store: true,
          },
        },
      },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers with products:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
