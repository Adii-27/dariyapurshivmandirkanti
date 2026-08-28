import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import type { Language, TranslationDictionary } from "./types";
import { en } from "./en";
import { hi } from "./hi";

export const LANGUAGE_STORAGE_KEY = "temple-language";

const translations: Record<Language, TranslationDictionary> = {
  en,
  hi,
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
      }
    } catch {
      // Storage unavailable or blocked; default to "en"
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Local storage blocked
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language] ?? en,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export type { Language, TranslationDictionary };
