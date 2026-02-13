'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Mail, Phone, Calendar } from 'lucide-react';
import { User } from '@/types/users/UserForDashboard';

interface UserDetailsDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsDialog({ user, isOpen, onClose }: UserDetailsDialogProps) {
  if (!user) return null;

  const getSubscriptionStatus = (plan?: any) => {
    if (!plan) return { label: 'Inactive', color: 'bg-gray-100 text-gray-700' };
    if (plan.status === 'active') return { label: 'Active', color: 'bg-green-100 text-green-700' };
    if (plan.status === 'expired') return { label: 'Expired', color: 'bg-red-100 text-red-700' };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  const status = getSubscriptionStatus(user.subscriptionPlan);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>معلومات المستخدم</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4 border-b border-gray-200 pb-4">
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                alt={user.name || 'User avatar'}
                src={user.image || '/placeholder.svg'}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name || 'Unknown'}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              {user.phone && (
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Role */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Role</p>
              <p className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {user.role || 'User'}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                Subscription
              </p>
              <p
                className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${status.color}`}
              >
                {status.label}
              </p>
            </div>

            {/* Plan Name */}
            {user.subscriptionPlan?.name && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                  Plan
                </p>
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {user.subscriptionPlan.name}
                </p>
              </div>
            )}

            {/* Expiry Date */}
            {user.subscriptionPlan?.expiryDate && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                  Expires
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {new Date(user.subscriptionPlan.expiryDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Stores */}
          {user.stores && user.stores.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Stores ({user.stores.length})
              </p>
              <div className="space-y-2">
                {user.stores.map(store => (
                  <div
                    key={store.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    {store.store.image && (
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image
                          alt={store.store.name}
                          src={store.store.image}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{store.store.name}</p>
                      <p className="text-xs text-gray-500">{store.role}</p>
                    </div>
                    {store.isOwner && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        Owner
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-4">
            {user.createdAt && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                  Created
                </p>
                <p className="mt-2 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
            {user.lastLogin && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                  Last Login
                </p>
                <p className="mt-2 text-sm text-gray-900">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
