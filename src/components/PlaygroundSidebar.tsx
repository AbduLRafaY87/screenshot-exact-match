import { Link } from "@tanstack/react-router";
import { House, MousePointerClick, Pencil, ShieldCheck, X } from "lucide-react";
import { practiceModules } from "@/lib/playground";
import { useProfile } from "@/lib/profile";
import { useT } from "@/lib/i18n";
import { Btn } from "./kit";

export function PlaygroundSidebar({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
  const { t } = useT();
  const { name, editName } = useProfile();
  return <aside className="flex h-full flex-col bg-card p-5">
    <div className="mb-9 flex items-center gap-2">
      <Link to="/" onClick={onNavigate} className="flex min-w-0 items-center gap-2 text-2xl font-display font-bold"><MousePointerClick className="size-8 shrink-0 text-primary" aria-hidden />{t("appName")}</Link>
      {mobile && <Btn variant="soft" className="ms-auto px-3" aria-label={t("close")} onClick={onNavigate}><X aria-hidden /></Btn>}
    </div>
    <nav aria-label={t("practiceMenu")} className="space-y-2">
      <Link to="/" onClick={onNavigate} activeOptions={{ exact: true }} className="flex min-h-14 items-center gap-3 rounded-lg px-3 text-lg font-bold text-muted-foreground hover:bg-muted" activeProps={{ className: "bg-secondary text-secondary-foreground", "aria-current": "page" }}><House aria-hidden className="size-6 shrink-0" />{t("playground")}</Link>
      <p className="px-3 pb-2 pt-5 text-sm font-bold text-muted-foreground">{t("choosePractice")}</p>
      {practiceModules.map((m) => <Link key={m.to} to={m.to} onClick={onNavigate} className="flex min-h-14 items-center gap-3 rounded-lg px-3 text-base font-bold text-muted-foreground hover:bg-muted" activeProps={{ className: "bg-secondary text-secondary-foreground", "aria-current": "page" }}><m.icon aria-hidden className="size-6 shrink-0" /><span>{t(m.tag)}</span></Link>)}
    </nav>
    <div className="mt-auto border-t pt-5">
      <div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-xl font-bold text-secondary-foreground">{name ? Array.from(name)[0] : <HandIcon />}</span><p className="min-w-0 break-words text-lg font-bold">{name || t("yourSpace")}</p></div>
      <Btn variant="soft" onClick={() => { onNavigate?.(); editName(); }} className="mt-3 w-full text-base"><Pencil aria-hidden className="size-4" />{t("changeName")}</Btn>
      <p className="mt-5 flex items-center gap-2 text-sm font-bold text-success"><ShieldCheck aria-hidden className="size-5 shrink-0" />{t("safeBadge")}</p>
    </div>
  </aside>;
}
function HandIcon() { return <MousePointerClick aria-hidden className="size-5" />; }