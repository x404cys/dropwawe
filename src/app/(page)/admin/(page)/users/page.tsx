'use client';
import useSWR from 'swr';
import UserListComponents from '@/app/(page)/admin/_components/UserList';
import { UsersResponse } from '@/types/users/User';
import Loader from '@/components/Loader';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UsersPage() {
  const { data, error } = useSWR<UsersResponse>('/api/admin/overview/stats/users', fetcher);

  if (error) return <p>Error loading users</p>;
  if (!data) return <Loader />;

  return <UserListComponents users={data.users} />;
}
