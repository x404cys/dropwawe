import { authOperation } from '@/app/lib/authOperation';
import { addWeeks, startOfWeek, format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOperation);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    // if (session.user.role !== 'A') {
    //   return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    // }
    const subscription = await prisma.userSubscription.findMany({
      include: {
        user: {
          include: {
            Store: true,
          },
        },
      },
    });
    return NextResponse.json(subscription);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
