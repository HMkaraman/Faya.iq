"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  dir: "ltr" | "rtl";
  toggleLanguage: () => void;
  t: (obj: { en: string; ar: string }) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  dir: "rtl",
  toggleLanguage: () => {},
  t: (obj) => obj.ar,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  const t = useCallback(
    (obj: { en: string; ar: string }) => obj[lang],
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
