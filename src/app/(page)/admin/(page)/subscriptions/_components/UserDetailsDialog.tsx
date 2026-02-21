'use client';

import { User } from '@/types/users/UserForDashboard';

export default function UserDetailsDialog({
  user,
  open,
  onClose,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-4">
          {user.image && <img src={user.image} className="h-14 w-14 rounded-full object-cover" />}

          <div>
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold">سجل الاشتراكات</h3>

          {user.subscriptionHistory?.length === 0 && (
            <p className="text-xs text-gray-500">لا يوجد سجل اشتراكات</p>
          )}

          <div className="max-h-60 space-y-2 overflow-y-auto">
            {user.subscriptionHistory?.map(history => {
              const isExpired = history.status === 'EXPIRED';

              return (
                <div key={history.id} className="rounded-lg border bg-gray-50 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{history?.plan?.name}</p>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${
                        isExpired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {history?.status}
                    </span>
                  </div>

                  <div className="mt-1 text-gray-600">
                    السعر: {history?.price?.toLocaleString()} IQD
                  </div>

                  <div className="mt-1 text-gray-500">
                    <td className="p-3">
                      {new Date(history.startDate).toLocaleString('ar', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="p-3">
                      {new Date(history.endDate).toLocaleString('ar', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={onClose} className="mt-6 w-full rounded-lg bg-black py-2 text-white">
          اغلاق
        </button>
      </div>
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-100 p-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{children}</p>
    </div>
  );
}
