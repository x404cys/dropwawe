'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '../_context/LanguageContext';

interface StorefrontShellProps {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function StorefrontShell({ children, style, className }: StorefrontShellProps) {
  const { dir, lang } = useLanguage();

  return (
    <div dir={dir} lang={lang} style={style} className={className}>
      {children}
    </div>
  );
}
