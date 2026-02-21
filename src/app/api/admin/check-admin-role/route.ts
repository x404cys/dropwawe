import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOperation } from '@/app/lib/authOperation';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOperation);

    if (!session) {
      return NextResponse.redirect(new URL('https://www.matager.store', req.url));
    }

    if (session.user.role !== 'A') {
      return NextResponse.redirect(new URL('https://www.matager.store', req.url));
    }
  } catch (err) {
    console.error('API Error:', err);

    return NextResponse.redirect(new URL('/error', req.url));
  }
}