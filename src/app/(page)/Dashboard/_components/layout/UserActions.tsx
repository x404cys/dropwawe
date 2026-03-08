'use client';
import { useLanguage } from '../../context/LanguageContext';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { Sun, Moon, ExternalLink } from 'lucide-react';
import SignOutGoogle from '@/app/_components/Login/SignOutGoogle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../context/ThemeContext';
import { useStoreProvider } from '../../hooks';

export default function UserActions() {
  const { t, lang } = useLanguage();
  const { data: session } = useSession();
  const { currentStore } = useStoreProvider();
  const router = useRouter();
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
      className="border-border bg-card z-50 flex w-full items-center justify-between border-b px-4 py-3 transition-colors duration-200 md:hidden"
    >
      <div className="relative">
        <button
          onClick={() => {
            setOpenUserMenu(!openUserMenu);
            setOpenNotifications(false);
          }}
          className="hover:bg-muted flex items-center gap-2 rounded-full p-1 transition"
        >
          {session.user.image ? (
            <Image
              src={session.user.image as string}
              alt={session.user.name as string}
              width={34}
              height={34}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
              {session.user.name?.charAt(0) ?? 'U'}
            </div>
          )}
          <div className="flex flex-col text-start">
            <span className="text-foreground text-xs leading-none font-semibold">
              {session.user.name?.split(' ')[0]}
            </span>
            <span className="text-muted-foreground text-[10px]">
              {session.user.email?.split('@')[0]}
            </span>
          </div>
        </button>

        {openUserMenu && (
          <div className="border-border bg-card absolute left-0 z-50 mt-2 w-44 rounded-xl border shadow-lg">
            <ul className="text-foreground flex flex-col p-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    router.push('/Dashboard/setting/profile');
                    setOpenUserMenu(false);
                  }}
                  className="hover:bg-muted w-full rounded-lg px-3 py-2 text-right text-xs transition"
                >
                  {' '}
                  {t.nav.profile}{' '}
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

      <div className="flex items-center gap-2">
        <button
          onClick={() => window.open(`https://${currentStore?.subLink}.matager.store`, '_blank')}
          className="bg-primary/10 border-primary/20 hover:bg-primary/15 flex h-8 items-center gap-1.5 rounded-full border px-3 transition-colors"
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

          {openNotifications && (
            <div className="border-border bg-card absolute right-0 z-50 mt-2 w-72 rounded-xl border shadow-lg">
              <div className="border-border text-foreground border-b px-4 py-2 text-sm font-semibold">
                {' '}
                {t.profile.notificationSettings}{' '}
              </div>
              {!notifications || notifications.length === 0 ? (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  {t.orders.noOrders || 'لا توجد إشعارات'}
                </div>
              ) : (
                <ul className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <Link
                      key={n.id}
                      href={`/Dashboard/orderDetails/${n.orderId}`}
                      onClick={() => {
                        markAsRead(n.id);
                        setOpenNotifications(false);
                      }}
                      className="hover:bg-muted block transition"
                    >
                      <li className="flex items-center gap-3 px-4 py-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${!n.isRead ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}
                        >
                          {n.type ?? 'إ'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-foreground text-xs font-medium">{n.message}</span>
                          <time className="text-muted-foreground text-[10px]">
                            {new Date(n.createdAt).toLocaleDateString(
                              lang === 'ar' ? 'ar-EG' : lang === 'ku' ? 'ar-IQ' : 'en-US',
                              { month: 'short', day: 'numeric' }
                            )}
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
