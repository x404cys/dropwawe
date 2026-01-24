import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';
import { authOperation } from '@/app/lib/authOperation';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOperation);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { theme } = await req.json();

    if (!['NORMAL', 'MODERN'].includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme value' }, { status: 400 });
    }
    await prisma.store.updateMany({
      where: {
        users: {
          some: {
            userId: session.user.id,
          },
        },
      },
      data: { theme },
    });

    return NextResponse.json({
      message: 'Theme updated successfully',
      theme,
    });
  } catch (error) {
    console.error('UPDATE THEME ERROR:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
