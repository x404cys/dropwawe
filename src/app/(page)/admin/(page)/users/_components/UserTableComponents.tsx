'use client';

import { useState, useMemo } from 'react';

import { SearchBar } from './SearchBar';
import { UserRow } from './UserRow';
import { UserCard } from './UserCard';
import { useDebounce } from '../_hooks/use-debounce';
import { UserDetailsDialog } from '../_dialogs/UserDetailsDialog';
import { RenewSubscriptionDialog } from '../_dialogs/RenewSubscriptionDialog';
import { WhatsAppContactDialog } from '../_dialogs/WhatsAppContactDialog';
import { ConfirmDeleteDialog } from '../_dialogs/ConfirmDeleteDialog';
import { User, UserDialogState } from '@/types/users/UserForDashboard';

interface UserTableComponentsProps {
  users: User[];
  onDelete?: (user: User) => void;
  onRenew?: (user: User, plan: string, months: number) => void;
  onContact?: (user: User, message: string) => void;
}

export function UserTableComponentsDashboard({
  users,
  onDelete,
  onRenew,
  onContact,
}: UserTableComponentsProps) {
  const [searchValue, setSearchValue] = useState('');
  const [dialogState, setDialogState] = useState<UserDialogState>({
    isOpen: false,
    type: null,
    user: null,
  });

  const debouncedSearch = useDebounce(searchValue, 300);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return users;

    const query = debouncedSearch.toLowerCase();
    return users.filter(
      user =>
        user.name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query) ||
        user.stores?.some(store => store.store.name.toLowerCase().includes(query))
    );
  }, [users, debouncedSearch]);

  const openDialog = (type: UserDialogState['type'], user: User) => {
    setDialogState({ isOpen: true, type, user });
  };

  const closeDialog = () => {
    setDialogState({ isOpen: false, type: null, user: null });
  };

  const handleDelete = (user: User) => {
    openDialog('delete', user);
  };

  const handleConfirmDelete = (user: User) => {
    onDelete?.(user);
    closeDialog();
  };

  const handleRenew = (user: User) => {
    openDialog('renew', user);
  };

  const handleConfirmRenew = (user: User, plan: string, months: number) => {
    onRenew?.(user, plan, months);
  };

  const handleContact = (user: User) => {
    openDialog('whatsapp', user);
  };

  const handleSendContact = (user: User, message: string) => {
    onContact?.(user, message);
  };

  const handleViewDetails = (user: User) => {
    openDialog('details', user);
  };

  if (users.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">No users found</h2>
          <p className="text-gray-600">Start by adding your first user</p>
        </div>
      </div>
    );
  }

  if (filteredUsers.length === 0 && debouncedSearch) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <SearchBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          totalUsers={users.length}
          filteredCount={filteredUsers.length}
        />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">No results found</h2>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        totalUsers={users.length}
        filteredCount={filteredUsers.length}
      />

      <div className="hidden text-right overflow-x-auto md:block">
        <div className="mx-auto max-w-7xl">
          <table className="w-full">
            <thead dir='rtl' className='text-right'>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  المستخدم
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  المتجر
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  onViewDetails={handleViewDetails}
                  onRenewSubscription={handleRenew}
                  onContact={handleContact}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 md:hidden">
        <div className="mx-auto max-w-lg space-y-3">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onViewDetails={handleViewDetails}
              onRenewSubscription={handleRenew}
              onContact={handleContact}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <UserDetailsDialog
        user={dialogState.type === 'details' ? dialogState.user : null}
        isOpen={dialogState.isOpen && dialogState.type === 'details'}
        onClose={closeDialog}
      />

      <RenewSubscriptionDialog
        user={dialogState.type === 'renew' ? dialogState.user : null}
        isOpen={dialogState.isOpen && dialogState.type === 'renew'}
        onClose={closeDialog}
        onConfirm={handleConfirmRenew}
      />

      <WhatsAppContactDialog
        user={dialogState.type === 'whatsapp' ? dialogState.user : null}
        isOpen={dialogState.isOpen && dialogState.type === 'whatsapp'}
        onClose={closeDialog}
        onSend={handleSendContact}
      />

      <ConfirmDeleteDialog
        user={dialogState.type === 'delete' ? dialogState.user : null}
        isOpen={dialogState.isOpen && dialogState.type === 'delete'}
        onClose={closeDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
