import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await context.params;

  if (!storeSlug) {
    return NextResponse.json(
      {
        error: 'Store Slug not found ',
      },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.user.findMany({
      where: { storeSlug: storeSlug },
      select: {
        storeName: true,
        storeSlug: true,
        id: true,
        
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'error get Data ' }, { status: 500 });
  }
}
