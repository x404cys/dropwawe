import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOperation);

  if (!session || session.user.role !== 'A')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.profitWithdrawal.update({
    where: { id: params.id },
    data: { status: 'REJECTED' },
  });

  return NextResponse.json({ success: true });
}
