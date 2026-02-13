'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { toast } from './_hooks/use-toast';
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

  const handleDelete = (user: User) => {
    toast({ title: `User ${user.name} has been deleted` });
  };

  const handleRenew = (user: User, plan: string, months: number) => {
    toast({ title: `${user.name}'s subscription renewed to ${plan} for ${months} months` });
  };

  const handleContact = (user: User, message: string) => {
    toast({ title: `Message sent to ${user.name} via WhatsApp` });
  };

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
