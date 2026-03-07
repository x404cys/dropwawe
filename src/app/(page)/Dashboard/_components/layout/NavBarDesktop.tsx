'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { Sun, Moon, ChevronDown, LogOut, User } from 'lucide-react';
import SignOutGoogle from '@/app/_components/Login/SignOutGoogle';
import Link from 'next/link';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: -4, scale: 0.96, transition: { duration: 0.1 } },
  };

  return (
    <div
      dir="ltr"
      ref={dropdownRef}
      className="z-50 hidden w-full items-center justify-between border-b border-border/60 bg-card px-5 py-2.5 md:flex transition-colors duration-200"
    >
      {/* Right side: actions */}
      <div className="flex items-center gap-2">

        {/* User avatar + dropdown */}
        <div dir="rtl" className="relative">
          <button
            onClick={() => { setOpenUserMenu(!openUserMenu); setOpenNotifications(false); }}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted"
          >
            <div className="hidden flex-col text-end sm:flex">
              <span className="text-xs font-semibold text-foreground leading-tight">
                {session.user.name?.split(' ')[0]}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight truncate max-w-[120px]">
                {session.user.email}
              </span>
            </div>
            <div className="relative">
              <Image
                src={session.user.image as string}
                alt={session.user.name as string}
                width={34}
                height={34}
                className="rounded-xl object-cover ring-2 ring-border"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${openUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {openUserMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute left-0 z-50 mt-1.5 w-52 rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/10 overflow-hidden"
              >
                {/* User info header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-muted/30">
                  <Image
                    src={session.user.image as string}
                    alt={session.user.name as string}
                    width={36}
                    height={36}
                    className="rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{session.user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                </div>

                <div className="p-2 space-y-0.5">
                  <button className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-right">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {t.nav.profile}
                  </button>
                  <div className="pt-1 border-t border-border/50 mt-1">
                    <SignOutGoogle />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setOpenNotifications(!openNotifications); setOpenUserMenu(false); }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MdOutlineNotificationsNone className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-card">
                {unreadCount > 9 ? '9+' : unreadCount}
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
                className="absolute left-0 z-50 mt-1.5 w-80 rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/10 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                  <span className="text-sm font-bold text-foreground">{t.profile.notificationSettings}</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                      {unreadCount} جديد
                    </span>
                  )}
                </div>

                {!notifications || notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <MdOutlineNotificationsNone className="text-3xl text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">لا توجد إشعارات</p>
                  </div>
                ) : (
                  <ul className="max-h-72 overflow-y-auto divide-y divide-border/50">
                    {notifications.map(n => (
                      <Link
                        key={n.id}
                        href={`/Dashboard/orderDetails/${n.orderId}`}
                        onClick={() => { markAsRead(n.id); setOpenNotifications(false); }}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                      >
                        <div
                          className={`flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                            !n.isRead
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {n.type ?? 'إ'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug truncate">{n.message}</p>
                          <time className="text-[11px] text-muted-foreground">
                            {new Date(n.createdAt).toLocaleDateString('ar-IQ', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </time>
                        </div>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                      </Link>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Left side: page breadcrumb placeholder */}
      <div />
    </div>
  );
}
