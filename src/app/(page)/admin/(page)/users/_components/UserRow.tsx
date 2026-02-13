'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { memo } from 'react';
import { User } from '@/types/users/UserForDashboard';

interface UserRowProps {
  user: User;
  onViewDetails: (user: User) => void;
  onRenewSubscription: (user: User) => void;
  onContact: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserRowComponent = ({
  user,
  onViewDetails,
  onRenewSubscription,
  onContact,
  onDelete,
}: UserRowProps) => {
  const getSubscriptionStatus = (plan?: any) => {
    if (!plan) return { label: 'Inactive', color: 'bg-gray-100 text-gray-600' };
    if (plan.status === 'active') return { label: 'Active', color: 'bg-green-100 text-green-700' };
    if (plan.status === 'expired') return { label: 'Expired', color: 'bg-red-100 text-red-700' };

    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  const status = getSubscriptionStatus(user.subscriptionPlan);
  const storeCount = user.stores?.length || 0;

  return (
    <tr
      dir="rtl"
      onClick={() => onViewDetails(user)}
      className="group cursor-pointer border-b border-gray-100 transition hover:bg-gray-50"
    >
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 flex-shrink-0">
            <Image
              alt={user.name || 'User'}
              src={user.image || '/placeholder.svg'}
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-gray-900">{user.name || 'Unknown'}</p>
            <p className="truncate text-[11px] text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-2">
        <div className="flex flex-wrap gap-1">
          {storeCount > 0 ? (
            user.stores?.slice(0, 2).map(store => (
              <span
                key={store.id}
                className="rounded-full bg-blue-50 px-2 py-[2px] text-[11px] font-medium text-blue-700"
              >
                {store.store.name}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-gray-400 italic">لا يوجد متجر</span>
          )}

          {storeCount > 2 && <span className="text-[11px] text-gray-500">+{storeCount - 2}</span>}
        </div>
      </td>

      <td className="px-4 py-2">
        <span className="rounded-full bg-gray-100 px-2 py-[2px] text-[11px] font-medium text-gray-700">
          {user.role || 'User'}
        </span>
      </td>

      <td className="px-4 py-2">
        <span className={`rounded-full px-2 py-[2px] text-[11px] font-medium ${status.color}`}>
          {status.label}
        </span>
      </td>

      <td className="px-4 py-2 text-left">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={e => {
              e.stopPropagation();
              onRenewSubscription(user);
            }}
            className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 transition group-hover:inline-flex hover:bg-blue-100"
          >
            تفعيل باقة
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              onContact(user);
            }}
            className="rounded-md bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 transition group-hover:inline-flex hover:bg-green-100"
          >
            رسالة
          </button>

          
        </div>
      </td>
    </tr>
  );
};

export const UserRow = memo(UserRowComponent);
