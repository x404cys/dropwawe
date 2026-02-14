import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const firstStore = await prisma.storeUser.findFirst({
      where: { userId },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        storeId: true,
      },
    });

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [{ userId }, { storeId: firstStore?.storeId }],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
