import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  console.log('Received userId:', userId);

  if (!userId) {
    return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        userId,
        NOT: { category: null },
      },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    const categoryNames = products.map(p => p.category);

    return NextResponse.json(categoryNames);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
