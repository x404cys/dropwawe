'use client';

import { signIn } from 'next-auth/react';

export default function SignInWithGoogle() {
  return (
    <button
      type="button"
      onClick={() => signIn('google')}
      className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-[color:var(--green)] cursor-pointer"
    >
      تسجيل
    </button>
  );
}
