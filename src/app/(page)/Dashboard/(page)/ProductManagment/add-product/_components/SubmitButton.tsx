'use client';

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  loading: boolean;
  onClick: () => void;
}

export function SubmitButton({ loading, onClick }: SubmitButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="mt-6 w-full gap-2 rounded-2xl bg-sky-500 py-6 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <span className="font-semibold">جاري الإضافة...</span>
        </>
      ) : (
        <>
          <PlusCircle className="h-5 w-5" />
          <span className="font-semibold">إضافة المنتج</span>
        </>
      )}
    </Button>
  );
}
