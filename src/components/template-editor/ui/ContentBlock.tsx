'use client';
// src/components/template-editor/ui/ContentBlock.tsx
// Collapsible card with enable/disable toggle — mirrors the original TemplateEditor ContentBlock.
// Used to wrap each optional section (services, works, testimonials, cta, about).

import { ChevronDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ContentBlockProps {
  title: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: () => void;
  open: boolean;
  onOpenToggle: () => void;
  count?: number;
  children?: React.ReactNode;
  noContent?: boolean;
}

export default function ContentBlock({
  title,
  icon,
  enabled,
  onToggle,
  open,
  onOpenToggle,
  count,
  children,
  noContent = false,
}: ContentBlockProps) {
  return (
    <div
      className={`bg-card border rounded-2xl overflow-hidden transition-all ${
        enabled ? 'border-border' : 'border-border/40 opacity-60'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={!noContent && enabled ? onOpenToggle : undefined}
        >
          <p className="text-[13px] font-semibold text-foreground">{title}</p>
          {count !== undefined && (
            <p className="text-[10px] text-muted-foreground">{count} عنصر</p>
          )}
        </div>
        {!noContent && enabled && (
          <button onClick={onOpenToggle} className="p-1 text-muted-foreground">
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
        )}
        <Switch checked={enabled} onCheckedChange={onToggle} className="flex-shrink-0" />
      </div>
      {open && enabled && children && (
        <div className="border-t border-border/50 p-3 bg-muted/10">{children}</div>
      )}
    </div>
  );
}
