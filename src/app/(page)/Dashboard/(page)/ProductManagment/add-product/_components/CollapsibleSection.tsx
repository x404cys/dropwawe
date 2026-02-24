'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  subtitle,
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-gray-300">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between rounded-2xl border-gray-200 bg-gray-50 px-4 py-2 text-right transition"
      >
        <div>
          <h3 className="text-sm text-gray-500">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs font-light text-gray-500">{subtitle}</p>}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 p-6 duration-200">{children}</div>
      )}
    </div>
  );
}
