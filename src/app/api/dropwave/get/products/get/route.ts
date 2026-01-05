import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';
import { authOperation } from '@/app/lib/authOperation';

export async function GET() {
  try {
    const session = await getServerSession(authOperation);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const products = await prisma.product.findMany({
      where: { supplierId: 'cmk13dh7a000dkn7r9g9cqvpi' },
      include: {
        images: true,
        colors: true,
        sizes: true,
        pricingDetails: true,
        subInfo: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('  check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
