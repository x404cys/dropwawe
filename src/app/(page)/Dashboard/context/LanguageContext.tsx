'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ar } from '@/translations/ar';
import { ku } from '@/translations/ku';
import { en } from '@/translations/en';

export type Lang = 'ar' | 'ku' | 'en';

const translations = { ar, ku, en } as const;

const LANG_LABELS: Record<Lang, string> = {
  ar: 'العربية',
  ku: 'کوردی',
  en: 'English',
};

/** Text direction — ar and ku are RTL; en is LTR */
const LANG_DIR: Record<Lang, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  ku: 'rtl',
  en: 'ltr',
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof ar;
  langLabel: string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  t: ar,
  langLabel: 'العربية',
  dir: 'rtl',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar');

  // Read persisted language from localStorage on mount (client-only)
  useEffect(() => {
    const saved = localStorage.getItem('app-lang') as Lang | null;
    if (saved && saved in translations) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('app-lang', l);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang],
        langLabel: LANG_LABELS[lang],
        dir: LANG_DIR[lang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
