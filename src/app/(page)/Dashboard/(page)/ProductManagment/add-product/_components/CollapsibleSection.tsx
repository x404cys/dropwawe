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
    <div className="rounded-lg border-t border-gray-400 mx-4 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between border-gray-200 bg-gray-50 px-4 py-2 text-right transition hover:bg-gray-100"
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
