'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  orderId: string;
}

const fakeUser = {
  id: 'user_1',
  name: 'عبدالرحمن مناف',
  email: '0xabdulrahmanmanaf@gmail.com',
  image: '/IMG_6311.JPG',
  role: 'ADMIN',
};

const fakeNotifications: Notification[] = [
  {
    id: '1',
    type: 'ط',
    message: 'تم إنشاء طلب جديد',
    createdAt: new Date().toISOString(),
    isRead: false,
    orderId: '1001',
  },
  {
    id: '2',
    type: 'ش',
    message: 'تم شحن الطلب',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    orderId: '1000',
  },
];

export default function NavBarForDesktopFake() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(fakeNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div
      ref={dropdownRef}
      dir="ltr"
      className="z-50 mb-2 hidden w-full items-center justify-between border-b bg-[#F8F8F8] px-6 py-3 md:flex"
    >
      <div className="flex items-center gap-6">
        <div dir="rtl" className="relative">
          <button
            onClick={() => {
              setOpenUserMenu(v => !v);
              setOpenNotifications(false);
            }}
            className="flex items-center gap-3 rounded-full p-1 transition hover:bg-gray-100"
          >
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-xs font-semibold text-gray-900">{fakeUser.name}</span>
              <span className="text-[11px] text-gray-500">{fakeUser.email}</span>
            </div>
            <Image
              src={fakeUser.image}
              alt={fakeUser.name}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          </button>

          {openUserMenu && (
            <div className="absolute left-0 z-50 mt-2 w-48 rounded-lg border bg-white shadow-lg">
              <ul className="flex flex-col p-2 text-sm text-gray-700">
                <li>
                  <button className="w-full rounded px-4 py-2 text-right hover:bg-gray-100">
                    الملف الشخصي
                  </button>
                </li>
                <li>
                  <button className="w-full rounded px-4 py-2 text-right hover:bg-gray-100">
                    الإعدادات
                  </button>
                </li>
                <hr className="my-1 border-gray-200" />
                <li>
                  <button className="w-full rounded px-4 py-2 text-right text-red-600 hover:bg-red-50">
                    تسجيل الخروج
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications(v => !v);
              setOpenUserMenu(false);
            }}
            className="relative rounded-lg bg-[#04BAF6] p-2 transition hover:scale-105"
          >
            <MdOutlineNotificationsNone className="text-xl text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute left-0 z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg">
              <div className="border-b px-4 py-2 font-semibold">الإشعارات</div>

              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">لا توجد إشعارات</div>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <Link
                      key={n.id}
                      href={`/Test-Mode/Dashboard/orderDetails/${n.orderId}`}
                      onClick={() => markAsRead(n.id)}
                      className="block hover:bg-gray-50"
                    >
                      <li className="flex items-center gap-3 px-4 py-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            n.isRead ? 'bg-gray-300 text-gray-600' : 'bg-green-500 text-white'
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
