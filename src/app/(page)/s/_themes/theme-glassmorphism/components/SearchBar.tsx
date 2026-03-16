// THEME: glassmorphism — SearchBar

'use client';

import { Search } from 'lucide-react';
import type { SearchBarProps } from '../../../_lib/types';

export default function GlassmorphismSearchBar({ value, onChange, fonts }: SearchBarProps) {
  return (
    <div id="store-search" className="relative">
      {/* DESIGN: Search is another translucent control inside the glass system, so it matches cards and navbar instead of standing out as a solid input. */}
      <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="ابحث عن منتج..."
        className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-2.5 ps-11 pe-4 text-sm text-white/80 transition-all duration-150 ease-in-out outline-none placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.08]"
        style={{ fontFamily: fonts.body }}
      />
    </div>
  );
}
