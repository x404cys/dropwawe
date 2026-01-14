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
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(fakeNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  const navItems = [
    { label: 'الرئيسية', path: '/Test-Mode/Dashboard' },
    { label: 'المنتجات', path: '/Test-Mode/Dashboard/ProductManagment' },
    { label: 'اضافة منتج', path: '/Test-Mode/Dashboard/ProductManagment/add-product' },
    {
      label: 'الطلبات',
      path:
        fakeUser.role === 'SUPPLIER'
          ? '/Test-Mode/Dashboard/OrderTrackingPage/SupplierOrderTrackingPage'
          : '/Test-Mode/Dashboard/OrderTrackingPage',
    },
    { label: 'الموردين', path: '/Test-Mode/Dashboard/supplier' },
    { label: 'المخزن', path: '/Test-Mode/Dashboard/products-dropwave' },
    { label: 'الاعدادات', path: '/Test-Mode/Dashboard/setting/store' },
  ];

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
      dir="rtl"
      ref={dropdownRef}
      className="z-50 mb-2 hidden w-full items-center justify-between border-b bg-white px-6 py-3 md:flex"
    >
      <div className="flex items-center gap-8">
        <Link href="/">
          <div className="flex cursor-pointer items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Dropwave</h1>
            <Image src="/logo-drop.png" alt="Dropwave" width={25} height={25} />
          </div>
        </Link>

        <nav className="hidden gap-6 text-gray-700 lg:flex">
          {navItems.map((item, idx) => (
            <Link key={idx} href={item.path} className="hover:text-gray-400">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications(!openNotifications);
              setOpenUserMenu(false);
            }}
            className="relative rounded-lg border bg-gray-100 p-2 hover:bg-gray-200"
          >
            <MdOutlineNotificationsNone className="text-xl text-gray-800" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadNotifications.length}
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
                      href={`/Dashboard/orderDetails/${n.orderId}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <li className="flex gap-3 px-4 py-2 hover:bg-gray-50">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            !n.isRead ? 'bg-green-400 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {n.type ?? 'إ'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm">{n.message}</span>
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
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setOpenUserMenu(!openUserMenu);
              setOpenNotifications(false);
            }}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100"
          >
            <div className="hidden flex-col text-end sm:flex">
              <span className="text-xs font-medium">{fakeUser.name.split(' ')[0]}</span>
              <span className="text-xs text-gray-600">{fakeUser.email}</span>
            </div>
            <Image
              src={fakeUser.image}
              alt={fakeUser.name}
              width={38}
              height={38}
              className="rounded-xl"
            />
          </button>

          {openUserMenu && (
            <div className="absolute left-0 z-50 mt-2 w-48 rounded-lg border bg-white shadow-lg">
              <ul className="flex flex-col p-2 text-sm">
                <li>
                  <button className="w-full rounded px-4 py-2 text-right hover:bg-gray-100">
                    الملف الشخصي
                  </button>
                </li>
                <hr className="my-1" />
                <li>
                  <button className="w-full rounded px-4 py-2 text-right text-red-600 hover:bg-gray-100">
                    تسجيل الخروج
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
