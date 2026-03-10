'use client';

import Image from 'next/image';
import { MessageCircle, Zap, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { User } from '@/types/users/UserForDashboard';

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
  const isActive = user.UserSubscription?.isActive;
  const statusColor = isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  const ringColor = isActive ? 'ring-green-500' : 'ring-red-500';
  const storeCount = user.stores?.length || 0;

  return (
    <div
      onClick={() => onViewDetails(user)}
      className="relative cursor-pointer rounded-2xl border bg-white p-5 shadow-md shadow-gray-100 transition hover:shadow-lg"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src={user.image || '/placeholder.svg'}
              alt="avatar"
              fill
              className={`rounded-full object-cover ring-2 ring-offset-1 ${ringColor}`}
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
          <p className="mb-1 text-xs text-gray-500 uppercase">Role</p>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
            {user.role || 'User'}
          </span>
        </div>

        <div>
          <p className="mb-1 text-xs text-gray-500 uppercase">تسجيل</p>
          <p className="text-xs text-gray-700">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleString('en', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {storeCount > 0 && (
          <div>
            <p className="mb-1 text-xs text-gray-500 uppercase">Stores</p>

            <div className="flex flex-wrap gap-1">
              {user.stores?.slice(0, 3).map(s => (
                <span
                  key={s.id}
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                >
                  {s.store.name}
                </span>
              ))}

              {storeCount > 3 && (
                <span className="text-[11px] text-gray-500">+{storeCount - 3}</span>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col items-start gap-1">
          <p className="mb-1 text-xs text-gray-500 uppercase">Subscription</p>
          <span className="text-[11px] text-blue-600">
            {user.UserSubscription?.plan?.name || 'No Plan'}
          </span>
          <span
            className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
          >
            {isActive ? 'نشط' : 'غير نشط'}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={e => {
            e.stopPropagation();
            onRenewSubscription(user);
          }}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-50 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
        >
          <Zap className="h-4 w-4" />
          تفعيل اشتراك
        </button>

        <button
          onClick={e => {
            e.stopPropagation();
            onContact(user);
          }}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-green-50 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
        >
          <MessageCircle className="h-4 w-4" />
          رسالة
        </button>

        
      </div>
    </div>
  );
};

export const UserCard = memo(UserCardComponent);
