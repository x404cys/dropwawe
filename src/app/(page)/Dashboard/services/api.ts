/**
 * Dashboard API services
 * Shared fetcher functions and API call helpers to eliminate duplication
 */
import axios from 'axios';

export const fetcherJson = (url: string) => fetch(url).then(res => res.json());

export const fetcherAxios = (url: string) =>
  axios.get(url, { timeout: 10000 }).then(res => res.data);

export async function markNotificationAsRead(id: string): Promise<void> {
  await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markNotificationAsReadAll(): Promise<void> {
  await fetch(`/api/notifications/read`, { method: 'PATCH' });
}
