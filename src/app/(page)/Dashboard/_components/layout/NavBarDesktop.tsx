'use client';
import { useLanguage } from '../../context/LanguageContext';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { Sun, Moon } from 'lucide-react';
import SignOutGoogle from '@/app/_components/Login/SignOutGoogle';
import Link from 'next/link';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../context/ThemeContext';

export default function NavBarForDesktop() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const { notifications, unreadCount, markAsRead } = useNotifications(session?.user?.id);

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

  if (!session?.user) return null;

  return (
    <div
      dir="ltr"
      ref={dropdownRef}
      className="z-50 mb-2 hidden w-full items-center justify-between border-b border-border bg-card px-6 py-3 md:flex transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        {/* User avatar dropdown */}
        <div dir="rtl" className="relative">
          <button
            onClick={() => { setOpenUserMenu(!openUserMenu); setOpenNotifications(false); }}
            className="flex items-center gap-2 rounded-full p-1 transition hover:bg-muted"
          >
            <div className="flex flex-col text-end">
              <span className="hidden text-xs font-medium text-foreground sm:block">
                {session.user.name?.split(' ')[0]}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
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
            <div className="absolute left-0 z-50 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg">
              <ul className="flex flex-col p-2 text-sm text-foreground">
                <li>
                  <button className="w-full rounded px-4 py-2 text-right transition hover:bg-muted"> {t.nav.profile} </button>
                </li>
                <hr className="my-1 border-border" />
                <li>
                  <SignOutGoogle />
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setOpenNotifications(!openNotifications); setOpenUserMenu(false); }}
            className="relative cursor-pointer rounded-lg bg-primary p-2 text-center transition-all duration-300 hover:scale-105"
          >
            <MdOutlineNotificationsNone className="text-xl text-primary-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute left-0 z-50 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg">
              <div className="border-b border-border px-4 py-2 font-semibold text-foreground">{t.profile.notificationSettings}</div>
              {!notifications || notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">لا توجد إشعارات</div>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <Link
                      key={n.id}
                      href={`/Dashboard/orderDetails/${n.orderId}`}
                      onClick={() => { markAsRead(n.id); setOpenNotifications(false); }}
                      className="block transition hover:bg-muted"
                    >
                      <li className="flex items-center gap-3 px-4 py-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          !n.isRead ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {n.type ?? 'إ'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{n.message}</span>
                          <time className="text-xs text-muted-foreground">
                            {new Date(n.createdAt).toLocaleDateString('ar-EG', {
                              year: 'numeric', month: 'long', day: 'numeric',
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

        {/* ☀️/🌙 Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع الداكن'}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}
