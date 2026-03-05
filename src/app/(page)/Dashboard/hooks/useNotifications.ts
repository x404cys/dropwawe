'use client';

/**
 * useNotifications hook
 * Extracted from UserActions, NavBarDesktop, and SideBarDashbard
 * which all had identical notification fetch + markAsRead logic
 */
import useSWR from 'swr';
import { fetcherJson, markNotificationAsRead } from '../services/api';
import type { Notification } from '../types';

export function useNotifications(userId?: string) {
  const { data: notifications, mutate } = useSWR<Notification[]>(
    userId ? `/api/notifications?userId=${userId}` : null,
    fetcherJson
  );

  const { data: unreadNotifications } = useSWR<Notification[]>(
    userId ? `/api/notifications/unread/${userId}` : null,
    fetcherJson
  );

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      mutate(
        current => current?.map(n => (n.id === id ? { ...n, isRead: true } : n)) || [],
        false
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return {
    notifications: notifications ?? [],
    unreadNotifications: unreadNotifications ?? [],
    unreadCount: unreadNotifications?.length ?? 0,
    markAsRead,
  };
}
