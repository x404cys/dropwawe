'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  totalUsers: number;
  filteredCount: number;
}

export function SearchBar({
  searchValue,
  onSearchChange,
  totalUsers,
  filteredCount,
}: SearchBarProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">المستخدمين</h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
              {filteredCount}
              {filteredCount !== totalUsers && ` / ${totalUsers}`}
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, role or store..."
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-xl border-gray-200 bg-gray-50 px-10 py-2.5 font-light text-gray-900 transition-all duration-150 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
