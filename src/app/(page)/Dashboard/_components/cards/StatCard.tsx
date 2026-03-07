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

export default function StatCard({ title, value, icon, change, href, color = 'text-muted-foreground' }: StatCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      dir="rtl"
      className="bg-card border border-border rounded-xl p-3.5 transition-all hover:shadow-sm"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className={`flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4 md:[&>svg]:h-6 md:[&>svg]:w-6 md:w-9 md:h-9 md:rounded-lg md:bg-primary/15 md:p-2 md:text-primary ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-[10px] font-medium ${
              change >= 0 ? 'text-success' : 'text-destructive'
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <span className="text-lg font-bold text-foreground block">
        {typeof value === 'number' ? value : value}
      </span>
      <span className="text-[10px] text-muted-foreground block mt-0.5">
        {title}
      </span>
    </motion.div>
  );

  if (href) return <Link href={href}>{card}</Link>;
  return card;
}
