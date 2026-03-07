'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaRegWindowRestore } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';

type StepId = 'basic' | 'shipping' | 'social';

interface NavigationButtonsProps {
  activeSection: StepId;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function NavigationButtons({
  activeSection,
  loading,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationButtonsProps) {
  const { t } = useLanguage();
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <>
      <div className="mt-6 flex justify-between">
        <button
          className={`cursor-pointer rounded-lg ${activeSection === 'basic' ? 'bg-card text-white' : 'block'} bg-muted px-6 py-2 text-black transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50`}
          onClick={onPrevious}
          disabled={activeSection === 'basic'}
        >
          السابق
        </button>

        {activeSection !== 'social' && (
          <button
            className="hover:bg-card rounded-lg bg-sky-600 px-6 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onNext}
          >
            التالي
          </button>
        )}

        {activeSection === 'social' && (
          <div className="flex w-full justify-end gap-2">
            <div className="justify-end">
              <button
                disabled={loading}
                onClick={() => setOpenConfirm(true)}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-2 py-2 text-white"
              >
                <FaRegWindowRestore className="h-4 w-4" />
                {loading ? 'جارٍ الانشاء...' : 'انشاء المتجر'}
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>هل أنت متأكد من إنشاء المتجر؟</DialogTitle>
            <p className="text-muted-foreground text-sm">
              بعد الانشاء، يمكنك تعديل الإعدادات لاحقاً من لوحة التحكم.
            </p>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenConfirm(false)} className="px-6">
              {' '}
              {t.cancel}{' '}
            </Button>
            <Button
              disabled={loading}
              onClick={() => {
                setOpenConfirm(false);
                onSubmit();
              }}
              className="cursor-pointer bg-sky-600 px-6"
            >
              تأكيد الإنشاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
