"use client";

import { languages, type Lang } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

const labels: Record<Lang, string> = { fr: "FR", nl: "NL", en: "EN" };

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="language-switcher" aria-label="Choix de langue">
      {languages.map((item) => (
        <button key={item} type="button" className={lang === item ? "is-active" : ""} onClick={() => setLang(item)} aria-pressed={lang === item}>{labels[item]}</button>
      ))}
    </div>
  );
}
