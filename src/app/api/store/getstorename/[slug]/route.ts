import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ slug?: string }> }) {
  const { slug } = await context.params;

  if (!slug) {
    return NextResponse.json({ error: 'Store slug is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { storeSlug: slug },
      select: { storeName: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({ storeName: user.storeName });
  } catch (error) {
    console.error('[STORE_NAME_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
