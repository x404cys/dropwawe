'use client';

import Image from 'next/image';
import { MessageCircle, Zap, Trash2 } from 'lucide-react';
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
  const isActive = user.UserSubscription?.isActive;
  const statusColor = isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  const ringColor = isActive ? 'ring-green-500' : 'ring-red-500';
  const storeCount = user.stores?.length || 0;

  return (
    <tr
      dir="rtl"
      onClick={() => onViewDetails(user)}
      className="group cursor-pointer border-b border-gray-100 transition-colors duration-100 hover:bg-slate-50"
    >
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 shrink-0">
            <Image
              alt={user.name || 'User'}
              src={user.image || '/placeholder.svg'}
              fill
              className={`rounded-full object-cover ring-2 ring-offset-1 ${ringColor}`}
            />
          </div>

          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-gray-900">{user.name || 'Unknown'}</p>
            <p className="truncate text-[11px] text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="text-xs">
        {' '}
        {user.createdAt
          ? new Date(user.createdAt).toLocaleString('en', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-'}{' '}
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
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-blue-600">
            {user.UserSubscription?.plan?.name || 'No Plan'}
          </span>
          <span
            className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
          >
            {isActive ? 'نشط' : 'غير نشط'}{' '}
          </span>
        </div>
      </td>
      <td className="px-4 py-2 text-left">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={e => {
              e.stopPropagation();
              onRenewSubscription(user);
            }}
            className="rounded-md p-1.5 text-gray-400 transition-colors group-hover:inline-flex hover:bg-blue-50 hover:text-blue-600"
            title="تفعيل باقة"
          >
            <Zap className="h-4 w-4" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              onContact(user);
            }}
            className="rounded-md p-1.5 text-gray-400 transition-colors group-hover:inline-flex hover:bg-green-50 hover:text-green-600"
            title="رسالة"
          >
            <MessageCircle className="h-4 w-4" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(user);
            }}
            className="rounded-md p-1.5 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const UserRow = memo(UserRowComponent);
