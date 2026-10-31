import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dict, type Key } from "./translations";

export type Lang = "en" | "ur";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string; dir: "ltr" | "rtl" };
const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("cw-lang");
    if (saved === "ur" || saved === "en") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("cw-lang", l);
  };
  const t = (k: Key) => dict[lang][k] ?? dict.en[k];
  return (
    <LangContext.Provider value={{ lang, setLang, t, dir: lang === "ur" ? "rtl" : "ltr" }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  const c = useContext(LangContext);
  if (!c) throw new Error("useT outside LanguageProvider");
  return c;
}

export function speak(text: string, lang: Lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "ur" ? "ur-PK" : "en-US";
  u.rate = 0.85;
  const v = window.speechSynthesis.getVoices().find((x) => x.lang.startsWith(lang === "ur" ? "ur" : "en"));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
  return true;
}
