import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { inviteCode } = await req.json();

    if (!inviteCode) return NextResponse.json({ success: false, error: 'Invite code required' });

    const invite = await prisma.invite.findUnique({
      where: { code: inviteCode },
    });

    if (!invite) return NextResponse.json({ success: false, error: 'Invalid invite code' });

    if (invite.used) return NextResponse.json({ success: false, error: 'Invite already used' });

    if (invite.expiresAt && new Date() > invite.expiresAt)
      return NextResponse.json({ success: false, error: 'Invite expired' });

    return NextResponse.json({
      success: true,
      storeId: invite.storeId,
      ownerId: invite.ownerId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Server error' });
  }
}
