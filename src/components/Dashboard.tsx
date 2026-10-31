import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Landmark, Video, FileText, ShieldAlert, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Key } from "@/lib/translations";

const modules = [
  { to: "/banking", icon: Landmark, tag: "m1Tag", title: "m1Title", sub: "m1Sub", tone: "bg-primary text-primary-foreground" },
  { to: "/video-check", icon: Video, tag: "m2Tag", title: "m2Title", sub: "m2Sub", tone: "bg-success text-success-foreground" },
  { to: "/forms", icon: FileText, tag: "m3Tag", title: "m3Title", sub: "m3Sub", tone: "bg-warn text-primary-foreground" },
  { to: "/scam-shield", icon: ShieldAlert, tag: "m4Tag", title: "m4Title", sub: "m4Sub", tone: "bg-destructive text-destructive-foreground" },
] as const;

export function Dashboard() {
  const { t } = useT();
  return (
    <div>
      <section className="mb-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{t("heroTitle")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("heroSub")}</p>
      </section>
      <ul className="grid gap-6 md:grid-cols-2">
        {modules.map((m, i) => (
          <motion.li key={m.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link
              to={m.to}
              className="group flex h-full flex-col gap-4 rounded-2xl border-2 bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-primary"
            >
              <span className={`grid size-16 place-items-center rounded-2xl ${m.tone}`}><m.icon aria-hidden className="size-8" /></span>
              <span className="text-lg font-bold text-muted-foreground">{t(m.tag as Key)}</span>
              <span className="text-2xl font-bold">{t(m.title as Key)}</span>
              <span className="text-lg text-muted-foreground">{t(m.sub as Key)}</span>
              <span className="tap mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                {t("start")} <ArrowRight aria-hidden className="rtl:rotate-180" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
