import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json(
      {
        error: 'userId not found ',
      },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.store.findFirst({
      where: { userId: userId },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'error get Data ' }, { status: 500 });
  }
}
