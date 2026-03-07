import type { ReactNode, ElementType } from 'react';
import { cn } from '@/lib/utils';

interface SettingsSectionHeadingProps {
  children: ReactNode;
  icon?: ElementType;
  className?: string;
}

export default function SettingsSectionHeading({
  children,
  icon: Icon,
  className,
}: SettingsSectionHeadingProps) {
  return (
    <h3
      className={cn(
        'text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase',
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3 flex-shrink-0" />}
      {children}
    </h3>
  );
}
