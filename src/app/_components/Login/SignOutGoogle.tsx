'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IoExitOutline } from 'react-icons/io5';

export default function SignOutGoogle() {
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = 'https://www.matager.store';
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex w-full cursor-pointer justify-center gap-2 rounded-lg border border-black py-2 text-sm font-bold"
    >
      <h1>الخروج</h1>
      <IoExitOutline size={22} />
    </button>
  );
}
