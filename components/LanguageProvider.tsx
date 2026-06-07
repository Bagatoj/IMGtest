"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLang, normalizeLang, t, type Lang } from "@/lib/i18n";

type LanguageContextValue = { lang: Lang; setLang: (lang: Lang) => void; t: (key: string) => string; ready: boolean };
const LanguageContext = createContext<LanguageContextValue>({ lang: defaultLang, setLang: () => {}, t: (key) => t(defaultLang, key), ready: false });

function getInitialLang(): Lang {
  if (typeof document === "undefined") return defaultLang;
  const cookie = document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith("img_lang="));
  const cookieLang = cookie?.split("=")[1];
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("img_lang") : null;
  return normalizeLang(stored || cookieLang || navigator.language.slice(0, 2));
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(defaultLang);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = getInitialLang();
    setLangState(initial);
    setReady(true);
  }, []);

  const setLang = (next: Lang) => {
    const normalized = normalizeLang(next);
    setLangState(normalized);
    if (typeof document !== "undefined") {
      document.cookie = `img_lang=${normalized}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = normalized;
      localStorage.setItem("img_lang", normalized);
      window.dispatchEvent(new CustomEvent("img-language-changed", { detail: normalized }));
    }
  };

  useEffect(() => {
    if (!ready || typeof document === "undefined") return;
    document.documentElement.lang = lang;
  }, [lang, ready]);

  const value = useMemo(() => ({ lang, setLang, ready, t: (key: string) => t(lang, key) }), [lang, ready]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
