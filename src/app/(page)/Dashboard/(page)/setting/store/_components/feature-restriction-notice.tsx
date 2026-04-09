'use client';

import { Crown, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface FeatureRestrictionNoticeProps {
  title: string;
  description: string;
  hintLabel: string;
  ctaLabel: string;
}

export default function FeatureRestrictionNotice({
  title,
  description,
  hintLabel,
  ctaLabel,
}: FeatureRestrictionNoticeProps) {
  const router = useRouter();

  return (
    <div className="border-amber-500/20 bg-amber-500/8 flex flex-col gap-3 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="bg-amber-500/10 text-amber-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
          <Lock className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{title}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
              <Crown className="h-3 w-3" />
              {hintLabel}
            </span>
          </div>
          <p className="text-muted-foreground text-xs leading-6">{description}</p>
        </div>
      </div>

      <Button
        size="sm"
        onClick={() => router.push('/Dashboard/plans')}
        className="h-9 flex-shrink-0 gap-1.5 text-xs"
      >
        <Crown className="h-3.5 w-3.5" />
        {ctaLabel}
      </Button>
    </div>
  );
}
