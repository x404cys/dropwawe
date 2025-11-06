import { MdOutlineNotificationsNone } from 'react-icons/md';
import Logo from '../utils/Logo';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import UserActions from '@/app/Dashboard/_components/UserActions';

export default function HeaderSectionsMobile() {
  return (
    <div className="py-3">
      <nav
        dir="rtl"
        className="border-accent sticky top-0 z-50 flex flex-col justify-between gap-4 rounded-xl border bg-white px-2 py-3"
      >
        <div className="flex w-full items-center justify-between md:w-auto">
          <Logo />
          <div className="flex items-center gap-1">
            <UserActions />
          </div>
        </div>
      </nav>
    </div>
  );
}
