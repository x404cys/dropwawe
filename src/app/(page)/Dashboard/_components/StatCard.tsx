import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  desc: string;
  href?: string;
  variant?: 'blue' | 'gray' | 'black';
}

export default function StatCard({
  title,
  value,
  icon,
  desc,
  href,
  variant = 'blue',
}: StatCardProps) {
  const isPositive = desc.includes('+');

  const variants = {
    blue: {
      container: 'bg-blue-50 text-blue-900',
      iconBg: 'bg-blue-100 text-blue-700',
      descPos: 'text-green-600',
      descNeg: 'text-green-600',
    },
    gray: {
      container: 'bg-white text-gray-950',
      iconBg: 'bg-gray-100 text-gray-950',
      descPos: 'text-green-600',
      descNeg: 'text-green-600',
    },
    black: {
      container: 'bg-black text-white',
      iconBg: 'bg-white/10 text-white',
      descPos: 'text-green-300',
      descNeg: 'text-green-400',
    },
  };

  const styles = variants[variant] ?? variants.blue;

  return (
    <Link href={href || ''} className="block">
      <div
        className={cn(
          'rounded-lg border p-3 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm',
          styles.container
        )}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">{title}</span>
          <div
            className={cn('flex h-6 w-6 items-center justify-center rounded-full', styles.iconBg)}
          >
            <div className="text-[10px]">{icon}</div>
          </div>
        </div>

        <div className="mt-1 text-lg font-bold">{value}</div>

        <p
          className={cn(
            'mt-1 text-[10px] font-medium',
            isPositive ? styles.descPos : styles.descNeg
          )}
        >
          {desc}
        </p>
      </div>
    </Link>
  );
}
