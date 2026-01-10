import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOperation);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const storeUser = await prisma.storeUser.findFirst({
      where: { userId: session.user.id, isOwner: true },
      include: { store: true },
    });

    if (!storeUser || !storeUser.store) {
      return NextResponse.json({ error: 'Store not found for this user' }, { status: 400 });
    }

    const code = nanoid(8);

    const invite = await prisma.invite.create({
      data: {
        code,
        storeId: storeUser.store.id,
        ownerId: session.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true, invite }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}
