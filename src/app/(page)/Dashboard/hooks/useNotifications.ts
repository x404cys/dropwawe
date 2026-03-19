'use client';

import useSWR from 'swr';
import { fetcherJson, markNotificationAsRead, markNotificationAsReadAll } from '../services/api';
import type { Notification } from '../types';

export function useNotifications(userId?: string) {
  const notificationsKey = userId ? `/api/notifications?userId=${userId}` : null;
  const unreadKey = userId ? `/api/notifications/unread/${userId}` : null;

  const {
    data: notifications,
    mutate: mutateNotifications,
    isLoading: isLoadingNotifications,
    error: notificationsError,
  } = useSWR<Notification[]>(notificationsKey, fetcherJson);

  const {
    data: unreadNotifications,
    mutate: mutateUnreadNotifications,
    isLoading: isLoadingUnread,
    error: unreadError,
  } = useSWR<Notification[]>(unreadKey, fetcherJson);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);

      await mutateNotifications(
        current => current?.map(n => (n.id === id ? { ...n, isRead: true } : n)) || [],
        false
      );

      await mutateUnreadNotifications(current => current?.filter(n => n.id !== id) || [], false);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  const markAllAsRead = async () => {
    try {
      await markNotificationAsReadAll();
      await mutateNotifications(
        current => current?.map(n => ({ ...n, isRead: true })) || [],
        false
      );
      await mutateUnreadNotifications([], false);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };  
  return {
    notifications: notifications ?? [],
    unreadNotifications: unreadNotifications ?? [],
    unreadCount: unreadNotifications?.length ?? 0,
    isLoading: isLoadingNotifications || isLoadingUnread,
    error: notificationsError || unreadError,
    markAsRead,
    markAllAsRead,
  };
}
