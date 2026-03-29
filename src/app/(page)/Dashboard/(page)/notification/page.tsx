'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, CheckCheck, Inbox, Clock3, CircleDot, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNotifications } from '../../hooks';
import type { Notification as AppNotification } from '../../types';

type FilterType = 'all' | 'unread' | 'read';

const LOCALE_MAP = {
  ar: 'ar-IQ',
  ku: 'ckb-IQ',
  en: 'en-US',
} as const;

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const { t, dir, lang } = useLanguage();
  const userId = session?.user?.id;
  const locale = LOCALE_MAP[lang];

  const { notifications, unreadCount, isLoading, error, markAsRead, markAllAsRead } =
    useNotifications(userId);

  const [filter, setFilter] = useState<FilterType>('all');

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notification => !notification.isRead);
      case 'read':
        return notifications.filter(notification => notification.isRead);
      default:
        return notifications;
    }
  }, [notifications, filter]);

  const groupedNotifications = useMemo(() => {
    const groups = {
      today: [] as AppNotification[],
      yesterday: [] as AppNotification[],
      older: [] as AppNotification[],
    };

    for (const notification of filteredNotifications) {
      const group = getNotificationGroup(notification.createdAt);
      groups[group].push(notification);
    }

    return groups;
  }, [filteredNotifications]);

  const todayCount = useMemo(() => {
    return notifications.filter(
      notification => getNotificationGroup(notification.createdAt) === 'today'
    ).length;
  }, [notifications]);

  const readCount = notifications.length - unreadCount;

  if (status === 'loading') {
    return <NotificationsPageSkeleton />;
  }

  return (
    <div dir={dir} className="bg-background min-h-screen px-2">
      <div className="mx-auto w-full max-w-6xl space-y-6 py-6 md:px-6">
        <section className="-sm overflow-hidden rounded-md border bg-gradient-to-br p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="bg-primary/12 text-primary -sm flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/40">
                <Bell className="h-7 w-7" />
              </div>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="me-2 h-4 w-4" />
                {t.notificationsPage.markAllAsRead}
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <StatsCard
              title={t.notificationsPage.totalNotifications}
              value={notifications.length}
              locale={locale}
              icon={<Bell className="h-5 w-5" />}
            />
            <StatsCard
              title={t.notificationsPage.unreadNotifications}
              value={unreadCount}
              locale={locale}
              highlight
              icon={<CircleDot className="h-5 w-5" />}
            />
            <StatsCard
              title={t.notificationsPage.todayNotifications}
              value={todayCount}
              locale={locale}
              icon={<Clock3 className="h-5 w-5" />}
            />
          </div>
        </section>

        <section className="bg-card -sm rounded-[24px] border p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <FilterTab
                label={`${t.notificationsPage.all} (${notifications.length.toLocaleString(locale)})`}
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              />
              <FilterTab
                label={`${t.notificationsPage.unread} (${unreadCount.toLocaleString(locale)})`}
                active={filter === 'unread'}
                onClick={() => setFilter('unread')}
              />
              <FilterTab
                label={`${t.notificationsPage.read} (${readCount.toLocaleString(locale)})`}
                active={filter === 'read'}
                onClick={() => setFilter('read')}
              />
            </div>

            <div className="text-muted-foreground px-2 text-sm">
              {filteredNotifications.length.toLocaleString(locale)}{' '}
              {t.notificationsPage.inThisFilter}
            </div>
          </div>
        </section>

        {isLoading ? (
          <NotificationsListSkeleton />
        ) : error ? (
          <div className="border-destructive/20 bg-destructive/5 text-destructive -sm rounded-[24px] border p-6 text-sm">
            {t.notificationsPage.loadError}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            title={t.notificationsPage.emptyTitle}
            description={t.notificationsPage.emptyDescription}
          />
        ) : (
          <div className="space-y-6">
            {groupedNotifications.today.length > 0 && (
              <NotificationSection
                title={t.notificationsPage.today}
                items={groupedNotifications.today}
                locale={locale}
                label={t.notificationsPage.notificationCountLabel}
                onMarkAsRead={markAsRead}
              />
            )}

            {groupedNotifications.yesterday.length > 0 && (
              <NotificationSection
                title={t.notificationsPage.yesterday}
                items={groupedNotifications.yesterday}
                locale={locale}
                label={t.notificationsPage.notificationCountLabel}
                onMarkAsRead={markAsRead}
              />
            )}

            {groupedNotifications.older.length > 0 && (
              <NotificationSection
                title={t.notificationsPage.older}
                items={groupedNotifications.older}
                locale={locale}
                label={t.notificationsPage.notificationCountLabel}
                onMarkAsRead={markAsRead}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  locale,
  highlight = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  locale: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-card -sm rounded-[22px] border p-4 transition-all',
        highlight && 'border-primary/20 bg-primary/[0.04]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value.toLocaleString(locale)}</p>
        </div>

        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            highlight ? 'bg-primary/12 text-primary' : 'bg-muted text-foreground'
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl px-4 py-2 text-sm font-medium transition-all',
        active ? 'bg-primary text-primary-foreground -sm' : 'text-muted-foreground hover:bg-muted'
      )}
    >
      {label}
    </button>
  );
}

function NotificationSection({
  title,
  items,
  locale,
  label,
  onMarkAsRead,
}: {
  title: string;
  items: AppNotification[];
  locale: string;
  label: string;
  onMarkAsRead: (id: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-2.5 w-2.5 rounded-full" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <span className="text-muted-foreground text-sm">
          {items.length.toLocaleString(locale)} {label}
        </span>
      </div>

      <div className="space-y-3">
        {items.map(notification => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            locale={locale}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </section>
  );
}

interface NotificationCardProps {
  notification: AppNotification;
  locale: string;
  onMarkAsRead: (id: string) => void;
}

function NotificationCard({ notification, locale, onMarkAsRead }: NotificationCardProps) {
  const { t, dir } = useLanguage();

  return (
    <div
      className={cn(
        'bg-card group -sm hover: -md rounded-[24px] border p-4 transition-all duration-200 hover:-translate-y-0.5 md:p-5',
        !notification.isRead && 'border-primary/20 bg-primary/[0.035]'
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative mt-1">
            <div
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-xl',
                notification.isRead
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary/12 text-primary'
              )}
            >
              <Bell className="h-5 w-5" />
            </div>

            {!notification.isRead && (
              <span className="bg-primary absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-foreground text-base font-semibold">
                {getNotificationTitle(notification, t.notificationsPage.newNotificationTitle)}
              </h3>

              {!notification.isRead && (
                <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[11px] font-semibold">
                  {t.orders.new}
                </span>
              )}
            </div>

            <p className="text-muted-foreground text-sm leading-7">
              {notification.message || t.notificationsPage.noNotificationText}
            </p>

            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <span>
                {formatRelativeDate(notification.createdAt, locale, t.notificationsPage.now)}
              </span>
              <span>|</span>
              <span>{formatAbsoluteDate(notification.createdAt, locale)}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end md:self-start">
          {!notification.isRead ? (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <CheckCheck className="me-2 h-4 w-4" />
              {t.notificationsPage.markAsRead}
            </Button>
          ) : (
            <div className="text-muted-foreground flex items-center gap-1 rounded-xl border px-3 py-2 text-xs">
              {t.notificationsPage.readStatus}
              <ChevronLeft className={`h-3.5 w-3.5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card -sm flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border p-8 text-center">
      <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <Inbox className="text-muted-foreground h-9 w-9" />
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-7">{description}</p>
    </div>
  );
}

function NotificationsPageSkeleton() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <div className="animate-pulse space-y-6">
          <div className="rounded-[28px] border p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-muted h-14 w-14 rounded-xl" />
                <div className="space-y-3">
                  <div className="bg-muted h-4 w-24 rounded" />
                  <div className="bg-muted h-7 w-40 rounded" />
                  <div className="bg-muted h-4 w-72 rounded" />
                </div>
              </div>
              <div className="bg-muted h-10 w-36 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-[22px] border p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="bg-muted h-4 w-24 rounded" />
                      <div className="bg-muted h-7 w-14 rounded" />
                    </div>
                    <div className="bg-muted h-11 w-11 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border p-3">
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-muted h-10 w-28 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="bg-muted h-6 w-24 rounded" />
            <div className="bg-muted h-4 w-16 rounded" />
          </div>

          {Array.from({ length: 3 }).map((__, index) => (
            <div key={index} className="bg-card -sm animate-pulse rounded-[24px] border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 items-start gap-4">
                  <div className="bg-muted h-11 w-11 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="bg-muted h-4 w-40 rounded" />
                    <div className="bg-muted h-4 w-[85%] rounded" />
                    <div className="bg-muted h-4 w-[60%] rounded" />
                    <div className="bg-muted h-3 w-32 rounded" />
                  </div>
                </div>
                <div className="bg-muted h-10 w-32 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function getNotificationTitle(notification: AppNotification, fallbackTitle: string) {
  if (
    'title' in notification &&
    typeof notification.title === 'string' &&
    notification.title.trim()
  ) {
    return notification.title;
  }

  return fallbackTitle;
}

function getNotificationGroup(dateValue: string | Date) {
  const inputDate = new Date(dateValue);
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  if (inputDate >= todayStart) return 'today';
  if (inputDate >= yesterdayStart && inputDate < todayStart) return 'yesterday';
  return 'older';
}

function formatRelativeDate(dateString: string | Date, locale: string, nowLabel: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diff < minute) return nowLabel;
  if (diff < hour) return formatter.format(-Math.floor(diff / minute), 'minute');
  if (diff < day) return formatter.format(-Math.floor(diff / hour), 'hour');
  if (diff < day * 7) return formatter.format(-Math.floor(diff / day), 'day');

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatAbsoluteDate(dateString: string | Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
}
