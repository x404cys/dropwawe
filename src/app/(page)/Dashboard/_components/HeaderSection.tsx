'use client';

import Image from 'next/image';
import Logo from '@/components/utils/Logo';
import UserActions from './UserActions';

export default function HeaderSections({ roles }: { roles?: string }) {
  const roleColors: Record<string, { bg: string; text: string }> = {
    GUEST: { bg: 'bg-gray-100', text: 'text-gray-800' },
    SUPPLIER: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    DROPSHIPPER: { bg: 'bg-green-100', text: 'text-green-800' },
    TRADER: { bg: 'bg-green-100', text: 'text-green-800' },
    DEFAULT: { bg: 'bg-gray-100', text: 'text-gray-800' },
  };

  const role = roles?.toUpperCase() || 'GUEST';
  const colors = roleColors[role] || roleColors.DEFAULT;

  return (
    <div className="py-3">
      <nav
        dir="rtl"
        className="sticky top-0 z-50 flex flex-col justify-between gap-4 rounded-xl bg-white px-2 py-3"
      >
        <div className="flex w-full items-center justify-between md:w-auto">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block rounded px-2 text-xs font-medium ${colors.bg} ${colors.text}`}
            >
              {role}
            </span>
            <UserActions />
          </div>
        </div>
      </nav>
    </div>
  );
}
