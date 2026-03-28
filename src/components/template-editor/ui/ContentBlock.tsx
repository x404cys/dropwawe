'use client';

import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
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
  const { t } = useLanguage();

  return (
    <div
      className={`bg-card overflow-hidden rounded-2xl border transition-all ${
        enabled ? 'border-border' : 'border-border/40 opacity-60'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl">
          {icon}
        </div>

        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={!noContent && enabled ? onOpenToggle : undefined}
        >
          <p className="text-foreground text-[13px] font-semibold">{title}</p>
          {count !== undefined && (
            <p className="text-muted-foreground text-[10px]">
              {t.templateEditor.ui.itemsCount.replace('{count}', String(count))}
            </p>
          )}
        </div>

        {!noContent && enabled && (
          <button onClick={onOpenToggle} className="text-muted-foreground p-1">
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}

        <Switch checked={enabled} onCheckedChange={onToggle} className="flex-shrink-0" />
      </div>

      {open && enabled && children && (
        <div className="border-border/50 bg-muted/10 border-t p-3">{children}</div>
      )}
    </div>
  );
}
