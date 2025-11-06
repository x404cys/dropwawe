import { authOperation } from '@/app/lib/authOperation';
import { UserRole } from '@/types/next-auth';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';

export async function requireSession(req: NextRequest) {
  const session = (await getServerSession(authOperation)) as Session | null;

  if (!session || !session.user) {
    return { authorized: false, message: 'Not e authenticated' };
  }
//
  return { authorized: true, session };
}

export async function requireRole(req: NextRequest, roles: UserRole[]) {
  const { authorized, session, message } = await requireSession(req);

  if (!authorized || !session) {
    return { authorized: false, message: message ?? 'Unknown error' };
  }

  const userRole = session.user.role;
  if (!roles.includes(userRole)) {
    return { authorized: false, message: 'Unauthorized: insufficient role' };
  }

  return { authorized: true, session };
}
