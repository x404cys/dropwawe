import { prisma } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { userId, username, password } = await req.json();

    const hash = await bcrypt.hash(password, 10);

    const merchant = await prisma.merchant.create({
      data: { userId, username, password: hash },
    });

    return NextResponse.json({ status: true, merchant });
  } catch (error) {
    return NextResponse.json({ status: false, msg: error || 'Server Error' }, { status: 500 });
  }
}
