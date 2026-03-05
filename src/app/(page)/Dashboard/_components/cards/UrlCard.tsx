'use client';
import { useLanguage } from '../../context/LanguageContext';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiCopy, FiEdit2, FiEye } from 'react-icons/fi';
import { Link, Store } from 'lucide-react';

interface UrlCardProps {
  storeUrl: string;
  copyToClipboard: () => void;
  theme: string;
  storeName: string;
}

export default function UrlCard({ storeUrl, copyToClipboard, storeName, theme }: UrlCardProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const THEME_LABELS: Record<string, string> = {
    MODERN: 'الكلاسيكي', /* Add fallback translation logic here if they ever add theme keys */
    CLASSIC: 'العصري',
  };

  const actions = [
    {
      icon: FiCopy,
      label: t.home?.copyLink || 'نسخ الرابط',
      onClick: copyToClipboard,
      color: 'text-primary bg-primary/10 hover:bg-primary/20',
    },
    {
      icon: FiEye,
      label: t.home?.viewStore || 'عرض المتجر',
      onClick: () => window.open(storeUrl, '_blank'),
      color: 'text-green-600 dark:text-green-400 bg-green-500/10 hover:bg-green-500/20',
    },
    {
      icon: FiEdit2,
      label: t.edit || 'تعديل',
      onClick: () => router.push('/Dashboard/setting/store'),
      color: 'text-muted-foreground bg-muted hover:bg-muted/80',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Header */}
      <div dir="rtl" className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Store className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">{storeName}</h3>
          <p className="text-[10px] text-muted-foreground">{THEME_LABELS[theme] ?? theme}</p>
        </div>
      </div>

      {/* URL row */}
      <div dir="rtl" className="flex items-center gap-2 mb-5 bg-muted rounded-xl px-3 py-2.5">
        <Link className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <span className="text-xs text-foreground truncate font-medium" dir="ltr">
          {storeUrl}
        </span>
      </div>

      {/* Action buttons */}
      <div dir="rtl" className="grid grid-cols-3 gap-2">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex flex-col items-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${action.color}`}
            >
              <Icon className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
