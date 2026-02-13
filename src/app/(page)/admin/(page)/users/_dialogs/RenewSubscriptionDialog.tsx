'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { User } from '@/types/users/UserForDashboard';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';

interface RenewSubscriptionDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: User, planName: string, months: number) => void;
}

const PLANS = [
  { id: 'ramadan-plan', name: 'باقة رمضان', monthlyPrice: 39000, months: 1 },
  { id: 'trader-basic', name: 'الاساسية للتجار', monthlyPrice: 39000, months: 1 },
  { id: 'trader-pro', name: 'الاحترافية للتجار', monthlyPrice: 69000, months: 1 },
  { id: 'drop-basics', name: 'الباقة الاساسية - للدروب شيبر', monthlyPrice: 39000, months: 1 },
  { id: 'drop-pro', name: 'الباقة الاحترافية - للدروبشيبر', monthlyPrice: 69000, months: 1 },
];

export function RenewSubscriptionDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
}: RenewSubscriptionDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1].id);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onConfirm(user, plan.name, plan.months);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>تفعيل اشتراك </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-right text-sm font-medium text-gray-950">
              يجب ان تكون متاكدر من قرارك فقرار الغاء الاشتراك يكون من قبل المبرمج{' '}
            </p>
            {user.subscriptionPlan?.expiryDate && (
              <p className="mt-1 text-xs text-gray-600">
                Expires: {new Date(user.subscriptionPlan.expiryDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <div>
            <p className="mb-3 text-right text-sm font-semibold text-gray-900">اختر الباقة</p>
            <div className="grid grid-cols-3 gap-3">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                    selectedPlan === p.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {selectedPlan === p.id && (
                    <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{p.months} month(s)</p>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    {formatIQD(p.monthlyPrice)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium text-gray-900">{plan.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">{plan.months} month(s)</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-blue-600">
                {formatIQD(plan.monthlyPrice)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            الغاء
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'تفعيل...' : 'تأكيد التفعيل  '}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
