'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  loading: boolean;
  onClick: () => void;
}

export function SubmitButton({ loading, onClick }: SubmitButtonProps) {
  const { t } = useLanguage();

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="mt-6 w-full gap-2 rounded-2xl bg-primary py-6 text-foreground transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <span className="font-semibold">{t.inventory?.adding || 'جاري الإضافة...'}</span>
        </>
      ) : (
        <>
          <PlusCircle className="h-5 w-5" />
          <span className="font-semibold">{t.inventory?.addProduct || 'إضافة المنتج'}</span>
        </>
      )}
    </Button>
  );
}
