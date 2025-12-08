'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import SignOutGoogle from '@/app/_components/Login/SignOutGoogle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuPackagePlus } from 'react-icons/lu';
import { AiOutlineProduct } from 'react-icons/ai';
import { CiSettings } from 'react-icons/ci';
import { BiCloset, BiSupport } from 'react-icons/bi';
import { PiHeadset, PiShippingContainerLight } from 'react-icons/pi';
import { IoCloseOutline } from 'react-icons/io5';
import { LiaShippingFastSolid } from 'react-icons/lia';

interface Notification {
  id: string;
  type?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  orderId: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UserActions() {
  const { data: session } = useSession();
  const router = useRouter();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications, mutate } = useSWR<Notification[]>(
    session?.user?.id ? `/api/notifications?userId=${session.user.id}` : null,
    fetcher
  );

  const { data: unreadNotifications } = useSWR<Notification[]>(
    session?.user?.id ? `/api/notifications/unread/${session.user.id}` : null,
    fetcher
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false);
        setOpenNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      mutate(current => current?.map(n => (n.id === id ? { ...n, isRead: true } : n)) || [], false);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (!session?.user) return null;

  return (
    <div
      dir="ltr"
      className="mt-2 mb-2 flex items-center justify-between gap-4 bg-white py-2 md:hidden"
      ref={dropdownRef}
    >
      <div className="flex items-center justify-start gap-4">
        <div
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border bg-white"
          onClick={() => {
            setOpenNotifications(!openNotifications);
            setOpenUserMenu(false);
          }}
        >
          <MdOutlineNotificationsNone className="text-2xl text-gray-950" />
          {unreadNotifications && unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadNotifications.length}
            </span>
          )}
        </div>
      </div>
      <div></div>
      {openUserMenu && (
        <div
          dir="rtl"
          className="absolute top-15 right-3 z-50 w-56 rounded-xl bg-white shadow-lg ring-1 ring-gray-200 md:right-40"
        >
          <ul className="flex flex-col p-2 text-sm text-gray-700">
            <li>
              <div className="flex items-center justify-between">
                <button
                  className="px- flex w-full items-center gap-2 rounded-md py-2 hover:bg-gray-100"
                  onClick={() => router.push('/Dashboard/profile')}
                >
                  <Image
                    src={session.user.image as string}
                    alt="profile"
                    width={24}
                    height={24}
                    className="rounded-lg"
                  />
                  <span>الملف الشخصي</span>
                </button>
                <button onClick={() => setOpenUserMenu(false)} className="rounded border">
                  <IoCloseOutline size={25} />
                </button>
              </div>
            </li>

            <hr className="my-1 border-gray-200" />

            <li>
              <button
                className="flex w-full items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  router.push('/Dashboard/setting/store');
                  setOpenUserMenu(false);
                }}
              >
                <CiSettings className="text-xl text-gray-950" />
                <span>الإعدادات</span>
              </button>
            </li>
            <hr className="my-1 border-gray-200" />
            <li>
              <div
                onClick={() => {
                  router.push('/Dashboard/create-store/Supplier');
                  setOpenUserMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100"
              >
                <PiShippingContainerLight />
                <span>انظم كمورّد</span>
              </div>
            </li>
            <hr className="my-1 border-gray-200" />
            <li>
              <div
                onClick={() => {
                  router.push('/Dashboard/supplier');
                  setOpenUserMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100"
              >
                <LiaShippingFastSolid />
                <span>تصفح الموردين</span>
              </div>
            </li>
            <hr className="my-1 border-gray-200" />
            <li>
              <div
                className="flex w-full items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  router.push('/Dashboard/help');
                  setOpenUserMenu(false);
                }}
              >
                <PiHeadset className="text-gray-950" />
                <span>الدعم</span>
              </div>
            </li>
            <hr className="my-1 border-gray-200" />

            <li>
              <div className="flex w-full cursor-pointer items-center gap-2 rounded-md py-2 hover:bg-gray-100">
                <SignOutGoogle />
              </div>
            </li>
          </ul>
        </div>
      )}

      {openNotifications && (
        <div
          dir="rtl"
          className="absolute top-14 z-50 w-80 max-w-sm rounded-xl bg-white shadow-lg ring-1 ring-gray-300 md:left-40"
        >
          <div className="border-b px-6 py-3 text-lg font-semibold text-gray-800">الإشعارات</div>

          {!notifications || notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">لا توجد إشعارات</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {notifications.map(n => (
                <Link
                  key={n.id}
                  href={`/Dashboard/orderDetails/${n.orderId}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <li
                    className={`cursor-pointer border-b px-6 py-3 transition-colors duration-200 last:border-none ${
                      !n.isRead ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-100'
                    } flex items-start gap-4`}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        !n.isRead
                          ? 'bg-green-400 text-white shadow-md'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {n.type ? n.type : 'إ'}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p
                        className={`mb-1 text-sm leading-tight ${
                          !n.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {n.message}
                      </p>
                      <time
                        className="text-xs text-gray-400"
                        dateTime={new Date(n.createdAt).toISOString()}
                      >
                        {new Date(n.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        onClick={() => {
          setOpenUserMenu(!openUserMenu);
          setOpenNotifications(false);
        }}
        className="relative flex items-center gap-3 rounded-full py-1 transition hover:bg-gray-100"
        aria-label="User menu"
      >
        <div className="flex flex-col items-end text-right">
          <span className="text-sm font-semibold text-gray-900">
            {session.user.name?.split(' ')[0]}
          </span>
          <span className="text-xs text-gray-600">{session.user.email?.split(' ')[0]}</span>
        </div>

        <Image
          src={session.user.image as string}
          alt={session.user.name as string}
          width={40}
          height={40}
          className="rounded-2xl object-cover ring-1 ring-gray-300 transition"
        />
      </button>
    </div>
  );
}
