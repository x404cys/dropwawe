'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';

interface OptionalSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function OptionalSection({ title, isOpen, onToggle, children }: OptionalSectionProps) {
  return (
    <div className="w-full">
      {!isOpen && (
        <div className="flex w-full justify-center">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-4/5 md:w-full md:mx-9 items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-sm font-light text-gray-600 transition hover:bg-gray-50"
          >
            <Plus className="h-3 w-3" />
            {title}
          </button>
        </div>
      )}

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 mt-6 w-full rounded-2xl p-5 duration-200">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{title}</h3>

            <button type="button" onClick={onToggle} className="text-gray-400 hover:text-black">
              <X className="h-4 w-4" />
            </button>
          </div>

          {children}
        </div>
      )}
    </div>
  );
}
