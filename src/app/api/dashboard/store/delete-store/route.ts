import { NextRequest, NextResponse } from 'next/server';
import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOperation);

  const { storeId } = await req.json();
  if (!session?.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const checkOwner = await prisma.storeUser.findFirst({
    where: {
      storeId: storeId,
      userId: session.user.id,
      isOwner: true,
    },
  });

  if (!checkOwner) {
    return NextResponse.json(
      { error: 'Forbidden: You are not the owner of this store' },
      { status: 403 }
    );
  }
  try {
    await prisma.store.delete({
      where: {
        id: storeId,
      },
    });
    return NextResponse.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json({ error: 'Failed to delete store' }, { status: 500 });
  }
}
