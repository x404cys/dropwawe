'use client';

import { Search, X } from 'lucide-react';
import { ActiveColors } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';

interface SearchBarProps {
  value: string;
  onChange: (q: string) => void;
  colors: ActiveColors;
}

export default function SearchBar({ value, onChange, colors }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto mb-10 max-w-xl">
      <div
        // REDESIGN: replace the rounded search box with a restrained bordered search field.
        className="flex items-center gap-3 border border-white/10 px-4 py-4"
      >
        <Search className="h-4 w-4 opacity-50" style={{ color: colors.text }} />

        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={t.store.searchPlaceholder}
          className="flex-1 bg-transparent text-sm font-light outline-none placeholder:opacity-40"
          style={{ color: colors.text }}
        />

        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="opacity-50 transition-opacity duration-200 hover:opacity-100"
            style={{ color: colors.text }}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
