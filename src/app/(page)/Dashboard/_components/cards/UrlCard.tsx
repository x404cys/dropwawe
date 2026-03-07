'use client';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiCopy } from 'react-icons/fi';
import { Link as LinkIcon, Store, ChevronRight, Package } from 'lucide-react';

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
    MODERN: 'الكلاسيكي', /* Keep existing fallback labels */
    CLASSIC: 'العصري',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir='rtl' 
      className="w-full rounded-2xl md:shadow border border-border bg-card p-5 border-primary/10 transition-all duration-300 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center" dir="rtl">
        <h3 className="text-base font-bold text-foreground">
          {t.home?.storeInfo || 'Store Info'}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {/* Link Row */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 min-w-0 bg-muted/50 rounded-xl px-3 py-2 border border-border/50">
            <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground truncate font-medium" dir="ltr">
              {storeUrl}
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-xl border border-border/50 bg-card hover:bg-muted text-muted-foreground transition-colors"
          >
            <FiCopy className="h-4 w-4" />
          </button>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-border/50 my-1"></div>

        {/* Store Name Row */}
        <div className="flex items-center justify-between" dir="ltr">
          <div className="flex items-center gap-3">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">{storeName}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Theme Row */}
        <div className="flex items-center justify-between mt-2" dir="ltr">
          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {THEME_LABELS[theme] ?? theme ?? 'Classic'}
            </span>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 text-[11px] font-bold tracking-wide rounded-full flex items-center justify-center">
            {t.home?.active || 'Active'}
          </div>
        </div>
      </div>

      {/* Buttons */}
      {/* <div className="grid grid-cols-2 gap-3 mt-2" dir="ltr">
        <button
          onClick={() => window.open(storeUrl, '_blank')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl py-2.5 transition-colors"
        >
          {t.home?.openStore || 'Open Store'}
        </button>
        <button
          onClick={() => router.push('/Dashboard/setting/store')}
          className="bg-card hover:bg-muted text-foreground border border-border text-sm font-semibold rounded-xl py-2.5 transition-colors"
        >
          {t.edit || 'Edit Store'}
        </button>
      </div> */}
    </motion.div>
  );
}
