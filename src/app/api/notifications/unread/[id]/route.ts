import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const unreadNotifications = await prisma.notification.findMany({
      where: {
        userId: params.id,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(unreadNotifications);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch unread notifications' }, { status: 500 });
  }
}
