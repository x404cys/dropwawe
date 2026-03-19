import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { prisma } from '@/app/lib/db';
export async function PATCH(request: Request) {
  const session = await getServerSession(authOperation);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const notification = await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
