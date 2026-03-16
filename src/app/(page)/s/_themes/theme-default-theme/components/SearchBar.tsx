// THEME: default-theme - SearchBar

'use client';

import { Search, X } from 'lucide-react';
import type { SearchBarProps } from '../../../_lib/types';

export default function DefaultThemeSearchBar({ value, onChange, fonts }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 ease-in-out focus-within:border-gray-300 focus-within:bg-gray-50">
      {/* DESIGN: The search field copies the original storefront control proportions and centered utility feel. */}
      <Search className="h-4 w-4 text-gray-400" />
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="ابحث عن منتج..."
        className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        style={{ fontFamily: fonts.body }}
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
  );
}
