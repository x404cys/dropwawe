'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ar } from '../_translations/ar';
import { en } from '../_translations/en';
import { ku } from '../_translations/ku';

export type StorefrontLang = 'ar' | 'ku' | 'en';

const translations = { ar, ku, en } as const;

const LANG_LABELS: Record<StorefrontLang, string> = {
  ar: 'العربية',
  ku: 'کوردی',
  en: 'English',
};

const LANG_DIR: Record<StorefrontLang, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  ku: 'rtl',
  en: 'ltr',
};

const LANG_LOCALE: Record<StorefrontLang, string> = {
  ar: 'ar-IQ',
  ku: 'ar-IQ',
  en: 'en-US',
};

const STORAGE_KEY = 'storefront-lang';

export const STORE_LANG_OPTIONS = [
  { value: 'ar', label: LANG_LABELS.ar },
  { value: 'ku', label: LANG_LABELS.ku },
  { value: 'en', label: LANG_LABELS.en },
] as const;

type TranslationType = typeof ar | typeof ku | typeof en;

interface LanguageContextType {
  lang: StorefrontLang;
  setLang: (lang: StorefrontLang) => void;
  t: TranslationType;
  langLabel: string;
  dir: 'rtl' | 'ltr';
  locale: string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  t: ar,
  langLabel: LANG_LABELS.ar,
  dir: 'rtl',
  locale: LANG_LOCALE.ar,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<StorefrontLang>('ar');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as StorefrontLang | null;
    if (saved && saved in translations) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: StorefrontLang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: translations[lang],
      langLabel: LANG_LABELS[lang],
      dir: LANG_DIR[lang],
      locale: LANG_LOCALE[lang],
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
