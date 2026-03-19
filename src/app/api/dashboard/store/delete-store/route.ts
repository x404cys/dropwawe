import { NextRequest, NextResponse } from 'next/server';
import { authOperation } from '@/app/lib/authOperation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/lib/db';

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOperation);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { storeId } = await req.json();

    if (!storeId) {
      return NextResponse.json({ error: 'storeId is required' }, { status: 400 });
    }

    const checkOwner = await prisma.storeUser.findFirst({
      where: {
        storeId,
        userId: session.user.id,
        isOwner: true,
      },
      select: {
        id: true,
      },
    });

    if (!checkOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You are not the owner of this store' },
        { status: 403 }
      );
    }

    await prisma.$transaction(async tx => {
      await tx.invite.deleteMany({
        where: { storeId },
      });

      await tx.storeUser.deleteMany({
        where: { storeId },
      });

      await tx.product.deleteMany({ where: { storeId } });
      await tx.order.deleteMany({ where: { storeId } });

      await tx.store.delete({
        where: { id: storeId },
      });
    });

    return NextResponse.json({ message: 'Store deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting store:', error);

    if (error?.code === 'P2003') {
      return NextResponse.json(
        {
          error: 'Cannot delete store because related records still exist',
          constraint: error?.meta?.field_name ?? error?.meta ?? null,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete store',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
