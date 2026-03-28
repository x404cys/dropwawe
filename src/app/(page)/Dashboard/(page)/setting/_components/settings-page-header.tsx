'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

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
  const { t, dir } = useLanguage();
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div
      dir={dir}
      className="bg-card border-border sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3"
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={handleBack}
          className="hover:bg-muted flex-shrink-0 rounded-lg p-1.5 transition-colors"
          aria-label={t.back}
        >
          <BackIcon className="text-muted-foreground h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-foreground truncate text-base font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground truncate text-[11px]">{subtitle}</p>}
        </div>
      </div>

      {action && <div className={`flex-shrink-0 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`}>{action}</div>}
    </div>
  );
}
