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

export const LANGUAGE_STORAGE_KEY = "temple-language";

export interface LanguageOption {
  code: Language;
  label: string;
  shortLabel: string;
  nativeName: string;
  langAttr: string;
  fontClass?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", shortLabel: "English", nativeName: "English", langAttr: "en" },
  { code: "hi", label: "Hindi", shortLabel: "Hindi", nativeName: "Hindi", langAttr: "hi" },
  { code: "mr", label: "Marathi", shortLabel: "Marathi", nativeName: "Marathi", langAttr: "mr" },
  { code: "gu", label: "Gujarati", shortLabel: "Gujarati", nativeName: "Gujarati", langAttr: "gu" },
  { code: "kn", label: "Kannada", shortLabel: "Kannada", nativeName: "Kannada", langAttr: "kn" },
  { code: "te", label: "Telugu", shortLabel: "Telugu", nativeName: "Telugu", langAttr: "te" },
  { code: "ta", label: "Tamil", shortLabel: "Tamil", nativeName: "Tamil", langAttr: "ta" },
];

const translationCache: Partial<Record<Language, TranslationDictionary>> = {
  en,
};

const translationLoaders: Record<Language, () => Promise<TranslationDictionary>> = {
  en: async () => en,
  hi: () => import("./hi").then((m) => m.hi),
  mr: () => import("./mr").then((m) => m.mr),
  gu: () => import("./gu").then((m) => m.gu),
  kn: () => import("./kn").then((m) => m.kn),
  te: () => import("./te").then((m) => m.te),
  ta: () => import("./ta").then((m) => m.ta),
};

export async function prefetchLanguage(lang: Language): Promise<TranslationDictionary> {
  if (translationCache[lang]) return translationCache[lang]!;
  try {
    const dict = await translationLoaders[lang]();
    translationCache[lang] = dict;
    return dict;
  } catch (error) {
    console.error(`Failed to prefetch language: ${lang}`, error);
    return translationCache.en ?? en;
  }
}

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
  const [loadedDict, setLoadedDict] = useState<TranslationDictionary>(en);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        setLanguageState(saved);
        if (typeof document !== "undefined") {
          document.documentElement.lang = saved;
        }
        if (translationCache[saved]) {
          setLoadedDict(translationCache[saved]!);
        } else {
          translationLoaders[saved]()
            .then((dict) => {
              translationCache[saved] = dict;
              setLoadedDict(dict);
            })
            .catch((err) => {
              console.error(`Failed to load saved language dictionary for ${saved}:`, err);
            });
        }
      }
    } catch {
      // Storage unavailable or blocked; default to "en"
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Local storage blocked
    }
    if (translationCache[lang]) {
      setLoadedDict(translationCache[lang]!);
    } else {
      translationLoaders[lang]()
        .then((dict) => {
          translationCache[lang] = dict;
          setLoadedDict(dict);
        })
        .catch((err) => {
          console.error(`Failed to load language dictionary for ${lang}:`, err);
        });
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: loadedDict ?? translationCache[language] ?? en,
    }),
    [language, loadedDict],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export type { Language, TranslationDictionary };
