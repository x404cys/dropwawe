// THEME: default-theme - SearchBar

'use client';

import { Search, X } from 'lucide-react';
import type { SearchBarProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';

export default function DefaultThemeSearchBar({ value, onChange, fonts }: SearchBarProps) {
  const { t } = useLanguage();
  return (
    <div
      className="flex items-center gap-2 rounded-2xl border px-4 py-3 transition-all duration-200 ease-in-out"
      style={{
        backgroundColor: 'var(--store-surface)',
        borderColor: 'var(--store-border)',
      }}
    >
      {/* DESIGN: The search field copies the original storefront control proportions and centered utility feel. */}
      <Search className="h-4 w-4" style={{ color: 'var(--store-text-faint)' }} />
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={t.store.searchPlaceholder}
        className="flex-1 bg-transparent font-light outline-none"
        style={{
          color: 'var(--store-text)',
          fontFamily: fonts.body,
        }}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="transition-opacity duration-200 ease-in-out hover:opacity-75"
          style={{ color: 'var(--store-text-faint)' }}
          aria-label={t.store.clearSearch}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

