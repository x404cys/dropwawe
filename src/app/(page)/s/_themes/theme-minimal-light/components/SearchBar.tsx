// THEME: minimal-light — SearchBar

'use client';

import { Search, X } from 'lucide-react';
import type { SearchBarProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';

export default function MinimalLightSearchBar({ value, onChange, colors, fonts }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto mb-8 max-w-xl">
      <div className="flex items-center gap-3 border border-stone-200 bg-white px-4 py-3">
        <Search className="h-4 w-4 text-stone-500" />
        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={t.store.searchPlaceholder}
          className="flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
          style={{ fontFamily: fonts.body }}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-stone-500 transition-colors duration-200 hover:text-stone-900"
            style={{ color: colors.accent }}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
