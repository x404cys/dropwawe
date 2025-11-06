import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ storeName: string }> }) {
  try {
    const { storeName } = await context.params;

    if (!storeName) {
      return NextResponse.json({ error: 'Store name is required' }, { status: 400 });
    }

    const count = await prisma.visitor.count({
      where: { storeName },
    });

    if (count === 0) {
      return NextResponse.json({ error: `Store "${storeName}" not found` }, { status: 404 });
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error('[VISIT_COUNT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
