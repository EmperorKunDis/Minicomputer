import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Lang, LANG_LABELS, LANG_NAMES } from '../lib/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('minipc-lang') as Lang) || 'cs';
    } catch {
      return 'cs';
    }
  });

  const setLang = (newLang: Lang) => {
    try {
      localStorage.setItem('minipc-lang', newLang);
    } catch {}
    setLangState(newLang);
  };

  const t = (key: string): string => {
    return getNestedValue(translations[lang] as unknown as Record<string, unknown>, key);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useT must be used within LanguageProvider');
  return context.t;
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return { lang: context.lang, setLang: context.setLang, LANG_LABELS, LANG_NAMES };
}
