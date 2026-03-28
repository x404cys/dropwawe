'use client';

import { Plus } from 'lucide-react';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export default function AddButton({ onClick, label }: AddButtonProps) {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary w-full rounded-xl border-2 border-dashed py-2 text-xs font-medium transition-all"
    >
      <span className="flex items-center justify-center gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        {label ?? t.add}
      </span>
    </button>
  );
}
