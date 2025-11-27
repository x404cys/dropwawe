import { authOperation } from '@/app/lib/authOperation';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

interface MerchantLoginResponse {
  status: boolean;
  data?: { token: string };
  msg?: string;
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOperation);

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { status: false, msg: 'Username & password required' },
        { status: 400 }
      );
    }

    const form = new FormData();
    form.append('username', username);
    form.append('password', password);

    const externalRes = await fetch('https://api.alwaseet-iq.net/v1/merchant/login', {
      method: 'POST',
      body: form,
    });

    const rawText = await externalRes.text();

    let data: MerchantLoginResponse;

    try {
      data = JSON.parse(rawText);
    } catch (err) {
      return NextResponse.json({ status: false, msg: 'API Format Error' }, { status: 500 });
    }

    if (!data.status || !data.data?.token) {
      return NextResponse.json(
        { status: false, msg: data.msg || 'Invalid credentials' },
        { status: 400 }
      );
    }

    const token = data.data.token;

    const tokenExp = new Date();
    tokenExp.setHours(tokenExp.getHours() + 24);

    const existing = await prisma.merchant.findUnique({ where: { username } });

    if (existing) {
      await prisma.merchant.update({
        where: { id: existing.id },
        data: { username, password, token, tokenExp },
      });
    } else {
      await prisma.merchant.create({
        data: { username, password, token, tokenExp, userId: session?.user.id },
      });
    }

    return NextResponse.json({
      status: true,
      msg: 'تم تسجيل الدخول بنجاح',
      login: { token, tokenExp },
    });
  } catch (error) {
    return NextResponse.json({ status: false, msg: 'Server Error: ' + error }, { status: 500 });
  }
}
