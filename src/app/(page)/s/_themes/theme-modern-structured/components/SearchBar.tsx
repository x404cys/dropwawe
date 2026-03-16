// THEME: modern-structured — SearchBar

'use client';

import { Search } from 'lucide-react';
import type { SearchBarProps } from '../../../_lib/types';

export default function ModernStructuredSearchBar({ value, onChange, fonts }: SearchBarProps) {
  return (
    <div id="store-search" className="relative">
      {/* DESIGN: Search stays compact and structured so it reads as a filter control, not a hero-sized input. */}
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="ابحث"
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 ps-9 pe-3 text-sm text-slate-700 transition-all duration-150 ease-in-out outline-none placeholder:text-slate-400 focus:border-gray-400"
        style={{ fontFamily: fonts.body }}
      />
    </div>
  );
}
