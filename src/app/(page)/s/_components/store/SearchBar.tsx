// Purpose: Search bar - "use client" input with magnifying glass and clear button.

'use client';

import { Search, X } from 'lucide-react';
import { useLanguage } from '../../_context/LanguageContext';

interface SearchBarProps {
  value: string;
  onChange: (q: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.store.searchPlaceholder}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        {value && (
          <button onClick={() => onChange('')}>
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
