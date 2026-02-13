'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { User } from '@/types/users/UserForDashboard';

interface ConfirmDeleteDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: User) => void;
}

export function ConfirmDeleteDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const confirmationRequired = `delete ${user.email}`;
  const isConfirmed = confirmText.toLowerCase() === confirmationRequired.toLowerCase();

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onConfirm(user);
      setConfirmText('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-red-900">Delete User</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-900">
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete
              the user account and all associated data.
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              User to delete
            </p>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-semibold text-gray-900">{user.name || 'Unknown'}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Confirmation Input */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              To confirm, type{' '}
              <code className="rounded bg-gray-100 px-2 py-1 font-semibold text-red-600">
                {confirmationRequired}
              </code>
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder={confirmationRequired}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
