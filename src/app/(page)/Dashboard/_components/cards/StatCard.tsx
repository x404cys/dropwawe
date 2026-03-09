import type { ReactNode } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number; // بدل desc
  href?: string;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  href,
  color = 'text-muted-foreground',
}: StatCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      dir="rtl"
      className="bg-card border-border rounded-xl border p-3.5 transition-all hover:shadow-sm"
    >
      <div className="mb-3 flex min-h-6 items-center justify-between md:mb-1.5 md:min-h-0">
        <div
          className={`md:bg-primary/15 md:text-primary flex items-center justify-center md:h-9 md:w-9 md:rounded-lg md:p-2 [&>svg]:h-5 [&>svg]:w-5 md:[&>svg]:h-6 md:[&>svg]:w-6 ${color}`}
        >
          {icon}
        </div>
        {change !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-[11px] font-bold ${
              change >= 0 ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="flex flex-col items-start md:block">
        <span className="text-foreground block text-[20px] font-bold md:text-lg">
          {typeof value === 'number' ? value : value}
        </span>
        <span className="text-muted-foreground mt-1 block text-start text-[12px] md:mt-0.5 md:text-[10px]">
          {title}
        </span>
      </div>
    </motion.div>
  );

  if (href) return <Link href={href}>{card}</Link>;
  return card;
}
