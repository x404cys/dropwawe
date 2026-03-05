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
}

export default function StatCard({ title, value, icon, change, href }: StatCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-card border-border rounded-xl border p-3.5 transition-all hover:shadow-sm"
    >
      {/* Top row */}
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-muted-foreground h-3.5 w-3.5">{icon}</div>

        {change !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-[10px] font-medium ${
              change >= 0 ? 'text-success' : 'text-destructive'
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="h-1 w-1" />
            ) : (
              <TrendingDown className="h-1 w-1" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      {/* Value */}
      <span className="text-foreground block text-lg font-bold">
        {typeof value === 'number' ? value.toLocaleString('ar-IQ') : value}
      </span>

      {/* Title */}
      <span className="text-muted-foreground text-[10px]">{title}</span>
    </motion.div>
  );

  if (href) return <Link href={href}>{card}</Link>;
  return card;
}
