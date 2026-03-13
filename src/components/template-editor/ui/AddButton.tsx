'use client';
// src/components/template-editor/ui/AddButton.tsx
// Dashed "add" button — reused in every list section.

import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export default function AddButton({ onClick, label = 'إضافة' }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all text-xs font-medium"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
