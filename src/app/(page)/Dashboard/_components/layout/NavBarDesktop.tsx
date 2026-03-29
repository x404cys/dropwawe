'use client';

import SignOutGoogle from '@/app/_components/Login/SignOutGoogle';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Moon, Sun, User } from 'lucide-react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { useNotifications } from '../../hooks/useNotifications';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const LOCALE_MAP = {
  ar: 'ar-IQ',
  ku: 'ckb-IQ',
  en: 'en-US',
} as const;

export default function NavBarForDesktop() {
  const { t, lang, dir } = useLanguage();
  const { data: session } = useSession();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead } = useNotifications(session?.user?.id);

  const locale = LOCALE_MAP[lang];
  const textAlignClass = dir === 'rtl' ? 'text-right' : 'text-left';

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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: -4, scale: 0.96, transition: { duration: 0.1 } },
  };

  return (
    <div
      dir="ltr"
      ref={dropdownRef}
      className="border-border/60 bg-card z-50 hidden w-full items-center justify-between border-b px-5 py-2.5 transition-colors duration-200 md:flex"
    >
      <div className="flex items-center gap-2">
        <div dir={dir} className="relative">
          <button
            onClick={() => {
              setOpenUserMenu(!openUserMenu);
              setOpenNotifications(false);
            }}
            className="hover:bg-muted flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors"
          >
            <div className="hidden flex-col text-end sm:flex">
              <span className="text-foreground text-xs leading-tight font-semibold">
                {session.user.name?.split(' ')[0]}
              </span>
              <span className="text-muted-foreground max-w-[120px] truncate text-[10px] leading-tight">
                {session.user.email}
              </span>
            </div>
            <div className="relative">
              <Image
                src={session.user.image as string}
                alt={session.user.name as string}
                width={34}
                height={34}
                className="ring-border rounded-xl object-cover ring-2"
              />
              <span className="border-card absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 bg-emerald-500" />
            </div>
            <ChevronDown
              className={`text-muted-foreground h-3.5 w-3.5 transition-transform duration-200 ${
                openUserMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {openUserMenu && (
              <motion.div
                dir={dir}
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="border-border/60 bg-card absolute left-0 z-50 mt-1.5 w-52 overflow-hidden rounded-2xl border shadow-xl shadow-black/10"
              >
                <div className="border-border/50 bg-muted/30 flex items-center gap-3 border-b px-4 py-3">
                  <Image
                    src={session.user.image as string}
                    alt={session.user.name as string}
                    width={36}
                    height={36}
                    className="flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-bold">
                      {session.user.name}
                    </p>
                    <p className="text-muted-foreground truncate text-[11px]">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-0.5 p-2">
                  <button
                    className={`text-foreground hover:bg-muted flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${textAlignClass}`}
                  >
                    <User className="text-muted-foreground h-4 w-4" />
                    {t.nav.profile}
                  </button>
                  <div className="border-border/50 mt-1 border-t pt-1">
                    <SignOutGoogle />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications(!openNotifications);
              setOpenUserMenu(false);
            }}
            className="border-border/60 bg-background text-muted-foreground hover:bg-muted hover:text-foreground relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
          >
            <MdOutlineNotificationsNone className="text-lg" />
            {unreadCount > 0 && (
              <span className="border-card absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border bg-red-500 text-[9px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {openNotifications && (
              <motion.div
                dir={dir}
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="border-border/60 bg-card absolute left-0 z-50 mt-1.5 w-80 overflow-hidden rounded-2xl border shadow-xl shadow-black/10"
              >
                <div className="border-border/50 flex items-center justify-between border-b px-4 py-3">
                  <span className="text-foreground text-sm font-bold">
                    {t.profile.notificationSettings}
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                      {unreadCount} {t.orders.new}
                    </span>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10">
                    <MdOutlineNotificationsNone className="text-muted-foreground/40 text-3xl" />
                    <p className="text-muted-foreground text-sm">{t.profile.noNotifications}</p>
                  </div>
                ) : (
                  <ul className="divide-border/50 max-h-72 divide-y overflow-y-auto">
                    {notifications.map(notification => (
                      <Link
                        key={notification.id}
                        href={`/Dashboard/orderDetails/${notification.orderId}`}
                        onClick={() => {
                          markAsRead(notification.id);
                          setOpenNotifications(false);
                        }}
                        className="hover:bg-muted/50 flex items-center gap-3 px-4 py-3 transition-colors"
                      >
                        <div
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            !notification.isRead
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {notification.type ?? t.home.notifications.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground max-w-[30ch] text-sm leading-snug font-medium break-words whitespace-pre-wrap">
                            {notification.message}
                          </p>
                          <time className="text-muted-foreground text-[11px]">
                            {new Date(notification.createdAt).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        {!notification.isRead && (
                          <span className="bg-primary h-2 w-2 flex-shrink-0 rounded-full" />
                        )}
                      </Link>
                    ))}
                  </ul>
                )}

                <div className="border-border/50 mt-1 flex items-center justify-center border-t px-4 py-3">
                  <button
                    onClick={() => {
                      router.push('/Dashboard/notification');
                      setOpenNotifications(false);
                    }}
                    className="text-foreground bg-primary w-full cursor-pointer rounded-lg px-4 py-2 text-xs"
                  >
                    {t.profile.viewAllNotifications}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? t.profile.lightMode : t.profile.darkMode}
          className="border-border/60 bg-background text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      <div />
    </div>
  );
}
