import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';
import { authOperation } from '@/app/lib/authOperation';

export async function POST(
  req: Request,
  context: { params: Promise<{ theme: 'NORMAL' | 'MODERN' }> }
) {
  try {
    const session = await getServerSession(authOperation);

    const { theme } = await context.params;

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const store = await prisma.store.update({
      where: { userId },
      data: {
        theme: theme,
      },
    });

    return NextResponse.json({
      message: 'Theme updated successfully',
      store,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}
