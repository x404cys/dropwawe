import { authOperation } from '@/app/lib/authOperation';
import NextAuth from 'next-auth';

const handler = NextAuth(authOperation);

export { handler as GET, handler as POST };
