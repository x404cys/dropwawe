'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  name?: string | null;
  image?: string | null;
  role?: string | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'صباح الخير';
  if (hour < 18) return 'مساء الخير';
  return 'مساء الخير';
}

const roleColors: Record<string, { bg: string; text: string }> = {
  GUEST: { bg: 'bg-gray-100', text: 'text-gray-800' },
  SUPPLIER: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  DROPSHIPPER: { bg: 'bg-green-100', text: 'text-green-800' },
  TRADER: { bg: 'bg-blue-100', text: 'text-blue-800' },
  DEFAULT: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

export default function GreetingUser({ user: initialUser }: { user: User }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>({
    name: initialUser.name || 'ضيف',
    image: initialUser.image || null,
    role: initialUser.role || 'GUEST',
  });

  useEffect(() => {
    if (session?.user?.id) {
      axios
        .get(`/api/users/checkRole?userId=${session.user.id}`)
        .then((res) => {
          setUser((prev) => ({
            ...prev,
            role: res.data.checkRole || 'GUEST',
          }));
        });
    }
  }, [session?.user?.id]);

  const role = user.role?.toUpperCase() || 'GUEST';
  const colors = roleColors[role] || roleColors.DEFAULT;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm w-full max-w-md sm:max-w-full sm:gap-6">
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full bg-gray-200 border">
        {user.image ? (
          <Image
            src={user.image}
            alt="صورة المستخدم"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xl font-bold text-gray-400">
            {user.name?.charAt(0).toUpperCase() || '؟'}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {getGreeting()}، <span className="text-blue-600">{user.name}</span>
        </h2>
        <span
          className={`mt-1 inline-block w-fit rounded px-2 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {role}
        </span>
        <p className="text-sm text-gray-500 mt-1">نتمنى لك يوماً جميلاً 👋</p>
      </div>
    </div>
  );
}
