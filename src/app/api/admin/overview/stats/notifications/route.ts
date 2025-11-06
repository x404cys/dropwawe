import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET() {
  try {
    const session = await getServerSession(authOperation);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }
    if (session.user.role !== 'A') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    const totalNotifications = await prisma.notification.count();
    const notifications = await prisma.notification.findMany();

    return NextResponse.json({ totalNotifications, notifications });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
