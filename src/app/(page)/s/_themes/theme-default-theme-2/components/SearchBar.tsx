'use client';

import { Search, X } from 'lucide-react';

import type { SearchBarProps } from '../../../_lib/types';

export default function DefaultThemeSearchBar({ value, onChange, fonts }: SearchBarProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-4 py-3.5"
      style={{
        backgroundColor: 'var(--store-surface)',
        borderColor: 'var(--store-border)',
      }}
    >
      <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--store-text-faint)' }} />
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="ابحث عن منتج أو فئة"
        className="min-w-0 flex-1 bg-transparent text-sm font-normal outline-none placeholder:text-[color:var(--store-text-faint)]"
        style={{ color: 'var(--store-text)', fontFamily: fonts.body }}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200"
          style={{ color: 'var(--store-text-faint)' }}
          aria-label="مسح البحث"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
