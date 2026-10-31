import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { practiceModules } from "@/lib/playground";
import welcomeImage from "@/assets/playground-welcome.jpg";

export function Dashboard() {
  const { t } = useT();
  const { name } = useProfile();
  return (
    <div>
      <section className="relative mb-9 min-h-72 overflow-hidden border-b pb-8 pe-0 md:pe-64">
        <p className="mb-3 text-base font-bold text-primary">{t("playground")}</p>
        <h1 className="relative z-10 max-w-2xl break-words text-4xl font-extrabold leading-tight md:text-5xl">{name ? t("welcomeName").replace("{name}", name) : t("welcomeGuest")}</h1>
        <p className="relative z-10 mt-4 max-w-xl text-xl text-muted-foreground">{t("welcomeSub")}</p>
        <p className="relative z-10 mt-6 inline-flex items-center gap-2 text-base font-bold text-success"><ShieldCheck aria-hidden className="size-5 shrink-0" />{t("safeBadge")}</p>
        <img src={welcomeImage} alt={t("nameImage")} width={992} height={672} className="mt-5 w-64 max-w-full object-contain md:absolute md:bottom-8 md:end-0 md:mt-0" />
      </section>
      <h2 className="mb-5 text-2xl font-bold">{t("choosePractice")}</h2>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {practiceModules.map((m) => (
          <li key={m.to}>
            <Link to={m.to} className={`activity-card ${m.tone} group flex h-full flex-col items-start rounded-lg border p-5 shadow-card transition hover:shadow-lift`}>
              <span className="mb-5 grid size-14 shrink-0 place-items-center rounded-lg bg-activity text-primary-foreground"><m.icon aria-hidden className="size-7" /></span>
              <span className="mb-2 text-sm font-bold text-activity">{t(m.tag)}</span>
              <h3 className="text-xl font-bold leading-snug">{t(m.title)}</h3>
              <p className="mb-5 mt-3 text-base text-muted-foreground">{t(m.sub)}</p>
              <span className="mt-auto flex min-h-12 w-full items-center justify-between border-t border-activity-border pt-3 text-base font-bold text-activity">{t("start")}<ArrowRight aria-hidden className="size-5 transition group-hover:translate-x-1 rtl:rotate-180" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
