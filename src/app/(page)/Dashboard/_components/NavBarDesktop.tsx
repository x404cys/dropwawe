'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import SignOutGoogle from '@/app/_components/Login/SignOutGoogle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CiSettings } from 'react-icons/ci';
import { PiHeadset } from 'react-icons/pi';
import { getDashboardNavItems } from '../_config/dashboardNavItems';
import { useDashboardData } from '../context/useDashboardData';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/next-auth';

interface Notification {
  id: string;
  type?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  orderId: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function NavBarForDesktop() {
  const { data: session } = useSession();
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
      ref={dropdownRef}
      className="z-50 mb-2 hidden w-full items-center justify-between border-b bg-[#F8F8F8] px-6 py-3 md:flex"
    >
      <div className="flex items-center gap-6">
        <div dir="rtl" className="relative">
          <button
            onClick={() => {
              setOpenUserMenu(!openUserMenu);
              setOpenNotifications(false);
            }}
            className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100"
          >
            <div className="flex flex-col text-end">
              <span className="hidden text-xs font-medium text-gray-900 sm:block">
                {session.user.name?.split(' ')[0]}
              </span>
              <span className="hidden text-xs font-medium text-gray-900 sm:block">
                {session.user.email?.split(' ')[0]}
              </span>
            </div>
            <Image
              src={session.user.image as string}
              alt={session.user.name as string}
              width={38}
              height={38}
              className="rounded-xl object-cover"
            />
          </button>

          {openUserMenu && (
            <div className="absolute left-0 z-50 mt-2 w-48 rounded-lg border bg-white shadow-lg">
              <ul className="flex flex-col p-2 text-sm text-gray-700">
                <li>
                  <button className="w-full rounded px-4 py-2 text-right transition hover:bg-gray-100">
                    الملف الشخصي
                  </button>
                </li>
                <hr className="my-1 border-gray-200" />
                <li>
                  <SignOutGoogle />
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications(!openNotifications);
              setOpenUserMenu(false);
            }}
            className="relative cursor-pointer rounded-lg bg-[#04BAF6] p-2 text-center font-bold text-sky-900 backdrop-blur-lg transition-all duration-300 hover:scale-105"
          >
            <MdOutlineNotificationsNone className="text-xl text-white" />
            {unreadNotifications && unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute left-0 z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg">
              <div className="border-b px-4 py-2 font-semibold">الإشعارات</div>
              {!notifications || notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">لا توجد إشعارات</div>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <Link
                      key={n.id}
                      href={`/Dashboard/orderDetails/${n.orderId}`}
                      onClick={() => {
                        markAsRead(n.id)  
                        setOpenNotifications(false)
                      }}
                      className="block transition hover:bg-gray-50"
                    >
                      <li className="flex items-center gap-3 px-4 py-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            !n.isRead ? 'bg-green-400 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {n.type ?? 'إ'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{n.message}</span>
                          <time className="text-xs text-gray-400">
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
        </div>
      </div>
    </div>
  );
}
