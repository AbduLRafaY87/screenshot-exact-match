import { Menu, LifeBuoy, Pencil } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { Btn } from "./kit";

export function Header({ onHelp, onMenu }: { onHelp: () => void; onMenu: () => void }) {
  const { t, lang, setLang } = useT();
  const { editName } = useProfile();
  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 md:px-8">
        <Btn variant="soft" className="px-3 lg:hidden" onClick={onMenu} aria-label={t("openMenu")}><Menu aria-hidden /></Btn>
        <span className="hidden text-base font-bold text-muted-foreground xl:inline">{t("yourSpace")}</span>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <div role="group" aria-label={t("language")} className="flex rounded-lg border bg-background p-1">
            {(["en", "ur"] as const).map((l) => (
              <Btn key={l} variant="soft" onClick={() => setLang(l)} aria-pressed={lang === l} className={cn("min-h-11 rounded-md px-3 text-base shadow-none", lang === l ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground")}>{t(l === "en" ? "english" : "urdu")}</Btn>
            ))}
          </div>
          <Btn variant="soft" onClick={editName} className="px-3 lg:hidden" aria-label={t("changeName")}><Pencil aria-hidden className="size-5" /></Btn>
          <Btn onClick={onHelp} className="px-3 text-base"><LifeBuoy aria-hidden className="size-5" /><span className="hidden sm:inline">{t("needGuidance")}</span><span className="sr-only sm:hidden">{t("needGuidance")}</span></Btn>
        </div>
      </div>
    </header>
  );
}
