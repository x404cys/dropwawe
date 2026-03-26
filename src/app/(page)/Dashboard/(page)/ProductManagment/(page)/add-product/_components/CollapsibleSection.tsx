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
    <div className="text-muted-foreground hover:text-foreground w-full border-t mt-4   text-sm font-medium">
      <button
        type="button"
        onClick={onToggle}
        className="border-border  flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-2 text-right transition"
      >
        <div>
          <h3 className="text-muted-foreground text-sm">{title}</h3>
          {subtitle && (
            <p className="text-muted-foreground mt-0.5 text-xs font-light">{subtitle}</p>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="text-muted-foreground h-5 w-5" />
        ) : (
          <ChevronDown className="text-muted-foreground h-5 w-5" />
        )}
      </button>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 p-6 duration-200">{children}</div>
      )}
    </div>
  );
}
