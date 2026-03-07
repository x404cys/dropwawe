'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface SettingsPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  onBack?: () => void;
}

export default function SettingsPageHeader({
  title,
  subtitle,
  action,
  onBack,
}: SettingsPageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-card border-border sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={handleBack}
          className="hover:bg-muted rounded-lg p-1.5 transition-colors flex-shrink-0"
          aria-label="رجوع"
        >
          <ArrowRight className="text-muted-foreground h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-foreground text-base font-bold truncate">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground text-[11px] truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0 mr-2">{action}</div>}
    </div>
  );
}
