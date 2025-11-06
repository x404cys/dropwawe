import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const totalSum = await prisma.order.aggregate({
      where: {
        userId,
        status: 'CONFIRMED',
      },
      _sum: {
        total: true,
      },
    });

    return NextResponse.json({ profit: totalSum._sum.total ?? 0 });
  } catch (error) {
    console.error('خطأ في جلب الأرباح:', error);
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 });
  }
}
