// THEME: clean-marketplace - SearchBar

'use client';

import { Search, X } from 'lucide-react';
import type { SearchBarProps } from '../../../_lib/types';

export default function CleanMarketplaceSearchBar({ value, onChange, fonts }: SearchBarProps) {
  return (
    <div className="w-full">
      {/* DESIGN: Marketplace search needs to feel instant and familiar, so the field is soft, rounded, and Arabic-first. */}
      <div className="flex flex-row-reverse items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition-all duration-200 ease-in-out focus-within:border-gray-400 focus-within:bg-white">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          style={{ fontFamily: fonts.heading }}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-gray-400 transition-colors duration-200 ease-in-out hover:text-gray-700"
            aria-label="مسح البحث"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
