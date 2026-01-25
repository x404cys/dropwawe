import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ subLink: string }> }) {
  const { subLink } = await context.params;

  if (!subLink) {
    return NextResponse.json(
      {
        error: 'subLink not found ',
      },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.store.findUnique({
      where: { subLink: subLink },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'error get Data ' }, { status: 500 });
  }
}
