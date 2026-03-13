import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SettingsSectionCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function SettingsSectionCard({
  children,
  className,
  noPadding = false,
}: SettingsSectionCardProps) {
  return (
    <div
      className={cn('bg-card overflow-hidden rounded-xl shadow-sm', !noPadding && 'p-4', className)}
    >
      {children}
    </div>
  );
}
