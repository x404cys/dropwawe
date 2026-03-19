'use client';

import { useLanguage } from '../../context/LanguageContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { Sun, Moon, ExternalLink, ChevronDown, Store } from 'lucide-react';
import SignOutGoogle from '@/app/_components/Login/SignOutGoogle';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../context/ThemeContext';
import { useStoreProvider } from '../../hooks';
import { AnimatePresence, motion } from 'framer-motion';

export default function UserActions() {
  const pathname = usePathname();
  const { t, lang } = useLanguage();
  const { data: session } = useSession();
  const { currentStore, stores, setCurrentStore } = useStoreProvider();
  const router = useRouter();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openStoreMenu, setOpenStoreMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const allowPath = ['/Dashboard', '/', '/Dashboard/ProductManagment/add-product'];

  const { notifications, unreadCount, markAsRead } = useNotifications(session?.user?.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false);
        setOpenNotifications(false);
        setOpenStoreMenu(false);
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
      dir="rtl"
      ref={dropdownRef}
      className={`border-border bg-card z-50 flex w-full items-center justify-between border-b px-2 py-3 md:hidden ${
        allowPath.includes(pathname) ? '' : 'hidden'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => {
              setOpenUserMenu(!openUserMenu);
              setOpenStoreMenu(false);
              setOpenNotifications(false);
            }}
            className="hover:bg-muted flex h-9 w-9 items-center justify-center rounded-lg transition"
          >
            {session.user.image ? (
              <Image
                src={session.user.image as string}
                alt={session.user.name as string}
                width={36}
                height={36}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                {session.user.name?.charAt(0) ?? 'U'}
              </div>
            )}
          </button>

          {openUserMenu && (
            <div className="border-border bg-card absolute right-0 z-50 mt-2 w-44 rounded-xl border shadow-lg">
              <ul className="flex flex-col p-2 text-sm">
                <li>
                  <button
                    onClick={() => {
                      router.push('/Dashboard/setting/profile');
                      setOpenUserMenu(false);
                    }}
                    className="hover:bg-muted w-full rounded-lg px-3 py-2 text-right text-xs"
                  >
                    {t.nav.profile}
                  </button>
                </li>

                <hr className="border-border my-1" />

                <li>
                  <SignOutGoogle />
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-foreground text-sm font-semibold">
            {session.user.name?.split(' ')[0]}
          </span>

          {stores.length > 0 && (
            <div className="relative">
              <button
                onClick={() => {
                  setOpenStoreMenu(!openStoreMenu);
                  setOpenUserMenu(false);
                  setOpenNotifications(false);
                }}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
              >
                <span className="max-w-[110px] truncate">{currentStore?.name || 'اختر متجر'}</span>

                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>

              {openStoreMenu && (
                <div className="border-border bg-card absolute right-0 z-50 mt-2 w-52 rounded-xl border shadow-lg">
                  <ul className="flex flex-col p-2 text-sm">
                    {stores.map(store => (
                      <li key={store.id}>
                        <button
                          onClick={() => {
                            setCurrentStore(store);
                            setOpenStoreMenu(false);
                          }}
                          className={`hover:bg-muted flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-sm ${
                            currentStore?.id === store.id ? 'bg-primary/10 text-primary' : ''
                          }`}
                        >
                          <Store className="h-4 w-4" />
                          <span className="truncate">{store.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => window.open(`https://${currentStore?.subLink}.matager.store`, '_blank')}
          className="border-primary/20 bg-primary/10 hover:bg-primary/15 flex h-8 items-center gap-1.5 rounded-full border px-3 transition-colors"
        >
          <ExternalLink className="text-primary h-3 w-3" />
          <span className="text-primary text-[11px] font-semibold">{t.home.openStore}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications(!openNotifications);
              setOpenUserMenu(false);
            }}
            className="relative rounded-lg border p-2 transition hover:scale-105"
          >
            <MdOutlineNotificationsNone className="text-lg" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {openNotifications && (
              <motion.div
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
                      {unreadCount} جديد
                    </span>
                  )}
                </div>

                {!notifications || notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10">
                    <MdOutlineNotificationsNone className="text-muted-foreground/40 text-3xl" />
                    <p className="text-muted-foreground text-sm">لا توجد إشعارات</p>
                  </div>
                ) : (
                  <ul className="divide-border/50 max-h-72 divide-y overflow-y-auto">
                    {notifications.map(n => (
                      <Link
                        key={n.id}
                        href={`/Dashboard/orderDetails/${n.orderId}`}
                        onClick={() => {
                          markAsRead(n.id);
                          setOpenNotifications(false);
                        }}
                        className="hover:bg-muted/50 flex items-center gap-3 px-4 py-3 transition-colors"
                      >
                        <div
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            !n.isRead
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {n.type ?? 'إ'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground max-w-[30ch] text-sm leading-snug font-medium break-words whitespace-pre-wrap">
                            {n.message}
                          </p>
                          <time className="text-muted-foreground text-[11px]">
                            {new Date(n.createdAt).toLocaleDateString('ar-IQ', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        {!n.isRead && (
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
                    عرض جميع الإشعارات
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
