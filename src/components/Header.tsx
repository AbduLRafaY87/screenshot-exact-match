import { Link } from "@tanstack/react-router";
import { ShieldCheck, LifeBuoy, MousePointerClick } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header({ onHelp }: { onHelp: () => void }) {
  const { t, lang, setLang } = useT();
  return (
    <header className="sticky top-0 z-40 bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 rounded-lg text-2xl font-bold" aria-label={t("home")}>
          <span className="grid size-11 place-items-center rounded-xl bg-primary"><MousePointerClick aria-hidden /></span>
          {t("appName")}
        </Link>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-base font-bold text-success-foreground">
          <ShieldCheck aria-hidden className="size-5" /> {t("safeBadge")}
        </span>
        <div className="ms-auto flex items-center gap-2">
          <div role="group" aria-label="Language" className="flex rounded-full border-2 border-ink-foreground p-1">
            {(["en", "ur"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={cn(
                  "min-h-12 rounded-full px-4 text-lg font-bold transition",
                  lang === l ? "bg-ink-foreground text-ink" : "text-ink-foreground",
                )}
              >
                {l === "en" ? "English" : "اردو"}
              </button>
            ))}
          </div>
          <button onClick={onHelp} className="tap inline-flex items-center gap-2 rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            <LifeBuoy aria-hidden /> <span className="hidden md:inline">{t("needGuidance")}</span>
            <span className="md:hidden sr-only">{t("needGuidance")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
