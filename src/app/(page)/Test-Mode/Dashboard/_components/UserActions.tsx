'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { IoCloseOutline } from 'react-icons/io5';
import Link from 'next/link';

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
};

const fakeNotifications: Notification[] = [
  {
    id: '1',
    type: 'ط',
    message: 'تم إنشاء طلب جديد بنجاح',
    createdAt: new Date().toISOString(),
    isRead: false,
    orderId: '1001',
  },
  {
    id: '2',
    type: 'ش',
    message: 'تم شحن الطلب رقم #1000',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    orderId: '1000',
  },
  {
    id: '3',
    type: 'د',
    message: 'تم تسليم الطلب بنجاح',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isRead: false,
    orderId: '999',
  },
];

export default function UserActionsFake() {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(fakeNotifications);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.isRead);

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
      dir="ltr"
      className="mt-2 mb-2 flex items-center justify-between gap-4 bg-white py-2 md:hidden"
      ref={dropdownRef}
    >
      <div className="relative">
        <div
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border bg-white"
          onClick={() => {
            setOpenNotifications(!openNotifications);
            setOpenUserMenu(false);
          }}
        >
          <MdOutlineNotificationsNone className="text-2xl text-gray-950" />

          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadNotifications.length}
            </span>
          )}
        </div>
      </div>

      {openUserMenu && (
        <div
          dir="rtl"
          className="absolute top-14 right-3 z-50 w-56 rounded-xl bg-white shadow-lg ring-1 ring-gray-200"
        >
          <ul className="flex flex-col p-2 text-sm text-gray-700">
            <li className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2">
                <Image
                  src={fakeUser.image}
                  alt="profile"
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
                <span>{fakeUser.name}</span>
              </div>
              <button onClick={() => setOpenUserMenu(false)}>
                <IoCloseOutline size={22} />
              </button>
            </li>

            <hr />

            <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">الملف الشخصي</li>
            <li className="cursor-pointer px-4 py-2 text-red-600 hover:bg-gray-100">
              تسجيل الخروج
            </li>
          </ul>
        </div>
      )}

      {openNotifications && (
        <div
          dir="rtl"
          className="absolute top-14 z-50 w-80 rounded-xl bg-white shadow-lg ring-1 ring-gray-300"
        >
          <div className="border-b px-6 py-3 text-lg font-semibold">الإشعارات</div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">لا توجد إشعارات</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {notifications.map(n => (
                <Link key={n.id} href="#" onClick={() => markAsRead(n.id)}>
                  <li
                    className={`flex cursor-pointer gap-4 border-b px-6 py-3 ${
                      !n.isRead ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                        !n.isRead ? 'bg-green-400 text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {n.type}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-medium">{n.message}</p>
                      <time className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString('ar-EG')}
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
        className="flex items-center gap-3 rounded-full py-1 hover:bg-gray-100"
      >
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold">{fakeUser.name}</span>
          <span className="text-xs text-gray-500">{fakeUser.email}</span>
        </div>

        <Image
          src={fakeUser.image}
          alt={fakeUser.name}
          width={40}
          height={40}
          className="rounded-2xl ring-1 ring-gray-300"
        />
      </button>
    </div>
  );
}
