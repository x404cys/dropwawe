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
            <h1 className="text-lg font-semibold text-gray-900">Users</h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {filteredCount}
              {filteredCount !== totalUsers && ` / ${totalUsers}`}
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, role or store..."
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="pointer-events-auto absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
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
