import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Hand, BookOpen, Landmark, Video, FileText, ShieldAlert, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Key } from "@/lib/translations";

const modules = [
  { to: "/basics", icon: Hand, tag: "m5Tag", title: "m5Title", sub: "m5Sub", tone: "bg-ink text-ink-foreground" },
  { to: "/banking", icon: Landmark, tag: "m1Tag", title: "m1Title", sub: "m1Sub", tone: "bg-primary text-primary-foreground" },
  { to: "/video-check", icon: Video, tag: "m2Tag", title: "m2Title", sub: "m2Sub", tone: "bg-success text-success-foreground" },
  { to: "/forms", icon: FileText, tag: "m3Tag", title: "m3Title", sub: "m3Sub", tone: "bg-warn text-primary-foreground" },
  { to: "/scam-shield", icon: ShieldAlert, tag: "m4Tag", title: "m4Title", sub: "m4Sub", tone: "bg-destructive text-destructive-foreground" },
  { to: "/words", icon: BookOpen, tag: "m6Tag", title: "m6Title", sub: "m6Sub", tone: "bg-warn text-primary-foreground" },
] as const;

export function Dashboard() {
  const { t } = useT();
  return (
    <div>
      <section className="relative mb-12 overflow-hidden rounded-[2rem] bg-hero p-8 text-ink-foreground shadow-lift md:p-14">
        <div aria-hidden className="pointer-events-none absolute -end-16 -top-16 size-72 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 end-24 size-56 rounded-full bg-success/30 blur-3xl" />
        <div className="relative max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-5 text-xl text-ink-foreground/85 md:text-2xl">{t("heroSub")}</p>
        </div>
      </section>
      <ul className="grid gap-6 md:grid-cols-2">
        {modules.map((m, i) => (
          <motion.li key={m.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link
              to={m.to}
              className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl border bg-card p-7 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 ${m.tone}`} />
              <div className="flex items-center gap-4">
                <span className={`grid size-16 shrink-0 place-items-center rounded-2xl shadow-card transition group-hover:scale-105 ${m.tone}`}><m.icon aria-hidden className="size-8" /></span>
                <span className="rounded-full bg-muted px-3 py-1 text-base font-bold text-muted-foreground">{t(m.tag as Key)}</span>
              </div>
              <span className="mt-2 font-display text-3xl font-extrabold">{t(m.title as Key)}</span>
              <span className="text-lg text-muted-foreground">{t(m.sub as Key)}</span>
              <span className="tap mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-primary text-lg font-bold text-primary-foreground transition group-hover:gap-4">
                {t("start")} <ArrowRight aria-hidden className="rtl:rotate-180" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
