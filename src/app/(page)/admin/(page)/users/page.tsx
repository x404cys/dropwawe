'use client';
import useSWR from 'swr';
import { User, UsersResponse } from '@/types/users/UserForDashboard';
import { UserTableComponents } from './_components/UserTableComponents';

export type UserDialogState = {
  isOpen: boolean;
  type: 'details' | 'renew' | 'whatsapp' | 'delete' | null;
  user: User | null;
};
export default function Page() {
  const fetcher = (url: string) => fetch(url).then(res => res.json());

  const { data, error } = useSWR<UsersResponse>('/api/admin/overview/stats/users', fetcher);

  const handleDelete = (user: User) => {};

  const handleRenew = (user: User, plan: string, months: number) => {};

  const handleContact = (user: User, message: string) => {};

  return (
    <main className="min-h-screen bg-gray-50">
      <UserTableComponents
        users={data?.users ?? []}
        onDelete={handleDelete}
        onRenew={handleRenew}
        onContact={handleContact}
      />
    </main>
  );
}
