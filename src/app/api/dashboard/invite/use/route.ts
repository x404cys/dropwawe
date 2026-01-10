import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { inviteCode, userId } = await req.json();

    if (!inviteCode || !userId)
      return NextResponse.json({ success: false, error: 'Invite code and userId required' });

    const invite = await prisma.invite.findUnique({
      where: { code: inviteCode },
    });

    if (!invite) return NextResponse.json({ success: false, error: 'Invalid invite code' });
    if (invite.used) return NextResponse.json({ success: false, error: 'Invite already used' });
    if (invite.expiresAt && new Date() > invite.expiresAt)
      return NextResponse.json({ success: false, error: 'Invite expired' });

    await prisma.storeUser.create({
      data: {
        storeId: invite.storeId,
        userId,
        role: 'MEMBER',
        isOwner: false,
      },
    });

    await prisma.invite.update({
      where: { code: inviteCode },
      data: { used: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Server error' });
  }
}
