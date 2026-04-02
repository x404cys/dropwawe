// THEME: tech-futuristic - SearchBar

'use client';

import { X } from 'lucide-react';
import { type CSSProperties } from 'react';
import type { SearchBarProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';

export default function TechFuturisticSearchBar({
  value,
  onChange,
  colors,
  fonts,
}: SearchBarProps) {
  const { t } = useLanguage();
  const accentVars = { ['--tech-accent' as string]: colors.accent } as CSSProperties;

  return (
    <div className="w-full" style={accentVars}>
      {/* DESIGN: The search bar reads like a command prompt instead of a retail input. */}
      <div className="flex items-center gap-3 border border-white/[0.08] bg-[#0f0f0f] px-4 py-3 transition-all duration-150 ease-out focus-within:border-[var(--tech-accent)]">
        <span
          className="font-mono text-sm"
          style={{ color: colors.accent, fontFamily: fonts.body }}
        >
          &gt;
        </span>
        <input
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={t.store.searchPlaceholder.toUpperCase()}
          className="flex-1 bg-transparent font-mono text-sm text-[#f2f2f2] outline-none placeholder:text-white/25"
          style={{ fontFamily: fonts.body }}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="flex h-6 w-6 items-center justify-center text-white/40 transition-all duration-150 ease-out hover:text-[var(--tech-accent)]"
            aria-label={t.store.clearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
