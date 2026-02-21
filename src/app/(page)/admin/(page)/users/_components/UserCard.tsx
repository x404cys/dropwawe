'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { memo, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { SubscriptionPlan, User } from '@/types/users/UserForDashboard';

interface UserCardProps {
  user: User;
  onViewDetails: (user: User) => void;
  onRenewSubscription: (user: User) => void;
  onContact: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCardComponent = ({
  user,
  onViewDetails,
  onRenewSubscription,
  onContact,
  onDelete,
}: UserCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getSubscriptionStatus = (plan?: SubscriptionPlan) => {
    if (!plan) return { label: 'Inactive', color: 'bg-gray-100 text-gray-700' };

    if (plan.status === 'active') return { label: 'Active', color: 'bg-green-100 text-green-700' };

    if (plan.status === 'expired') return { label: 'Expired', color: 'bg-red-100 text-red-700' };

    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  const status = getSubscriptionStatus(user.subscriptionPlan);
  const storeCount = user.stores?.length || 0;

  return (
    <div
      onClick={() => onViewDetails(user)}
      className="relative rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src={user.image || '/placeholder.svg'}
              alt="avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name || 'Unknown'}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-500 uppercase">Role</p>
          <p className="truncate">{user.role || 'User'}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase">تسجيل</p>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
          >
            {user.createdAt
              ? new Date(user.createdAt).toLocaleString('en', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
            s{' '}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {storeCount > 0 && (
          <div className="mt-4">
            <p className="mb-1 text-xs text-gray-500 uppercase">Stores</p>

            <div className="flex flex-wrap gap-1">
              {user.stores?.slice(0, 3).map(s => (
                <span
                  key={s.id}
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                >
                  {s.store.name}
                </span>
              ))}

              {storeCount > 3 && <span className="text-xs text-gray-500">+{storeCount - 3}</span>}
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-col">
          <p className="mb-1 text-xs text-gray-500 uppercase">Subscription</p>
          <span className="text-xs text-blue-600">
            {user.UserSubscription?.plan?.name || 'No Plan'}
          </span>
          <span
            className={`text-xs ${user.UserSubscription?.isActive ? 'text-green-600' : 'text-red-600'}`}
          >
            {user.UserSubscription?.isActive ? 'نشط' : 'غير نشط'}{' '}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={e => {
            e.stopPropagation();
            onRenewSubscription(user);
          }}
          className="w-full rounded-lg bg-blue-50 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100"
        >
          تفعيل اشتراك
        </button>

        <button
          onClick={e => {
            e.stopPropagation();
            onContact(user);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 py-2 text-xs font-medium text-green-700 hover:bg-green-100"
        >
          رسالة <FaWhatsapp />
        </button>
      </div>
    </div>
  );
};

export const UserCard = memo(UserCardComponent);
