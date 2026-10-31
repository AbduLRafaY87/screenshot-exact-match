import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Sparkles, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { speak, useT } from "@/lib/i18n";
import { useLocation } from "@tanstack/react-router";
import { practiceModules } from "@/lib/playground";

const variants = {
  primary: "bg-primary text-primary-foreground hover:brightness-110",
  success: "bg-success text-success-foreground hover:brightness-110",
  danger: "bg-destructive text-destructive-foreground hover:brightness-110",
  outline: "border-2 border-input bg-card text-foreground hover:bg-muted",
  ink: "bg-ink text-ink-foreground hover:brightness-125",
  soft: "bg-secondary text-secondary-foreground hover:brightness-95",
};

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants };
export const Btn = forwardRef<HTMLButtonElement, BtnProps>(({ variant = "primary", className, ...p }, ref) => (
  <button
    ref={ref}
    className={cn(
      "tap inline-flex items-center justify-center gap-2 rounded-full text-lg font-bold shadow-sm transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      className,
    )}
    {...p}
  />
));
Btn.displayName = "Btn";

export function SpeakButton({ text, className, label }: { text: string; className?: string; label?: string | undefined }) {
  const { t, lang } = useT();
  return (
    <Btn variant="soft" className={cn("text-base", className)} onClick={() => speak(text, lang) || alert(t("noVoice"))}>
      <Volume2 aria-hidden className="size-6" /> {label ?? t("readAloud")}
    </Btn>
  );
}

/** Left-side instructor panel with animated message, safety badge, and self-paced nav. */
export function GuidePanel({
  message,
  tone = "info",
  stepLabel,
  onPrev,
  onNext,
  nextDisabled,
  children,
}: {
  message: string;
  tone?: "info" | "success" | "warn";
  stepLabel?: string | undefined;
  onPrev?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  nextDisabled?: boolean | undefined;
  children?: ReactNode;
}) {
  const { t } = useT();
  const toneCls = tone === "success" ? "bg-success-soft border-success" : tone === "warn" ? "bg-warn-soft border-warn" : "bg-card border-primary";
  return (
    <aside aria-label={t("guide")} className="lg:sticky lg:top-28 space-y-4">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles aria-hidden /></span>
        <div>
          <p className="font-bold text-xl">{t("guide")}</p>
          {stepLabel && <p className="text-muted-foreground">{stepLabel}</p>}
        </div>
      </div>
      <p className="flex items-center gap-2 rounded-xl bg-success-soft px-4 py-2.5 text-base font-bold text-success">
        <ShieldCheck aria-hidden className="size-5 shrink-0" /> {t("instructorBadge")}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
          className={cn("rounded-3xl border border-s-8 p-6 text-xl leading-relaxed shadow-card", toneCls)}
        >
          {message}
        </motion.div>
      </AnimatePresence>
      <SpeakButton text={message} label={t("listen")} />
      {(onPrev || onNext) && (
        <div className="flex gap-3">
          {onPrev && (
            <Btn variant="outline" onClick={onPrev} className="flex-1">
              <ArrowLeft aria-hidden className="rtl:rotate-180" /> {t("previous")}
            </Btn>
          )}
          {onNext && (
            <Btn onClick={onNext} disabled={nextDisabled} className="flex-1">
              {t("next")} <ArrowRight aria-hidden className="rtl:rotate-180" />
            </Btn>
          )}
        </div>
      )}
      {children}
    </aside>
  );
}

export function PageTitle({ tag, title }: { tag: string; title: string }) {
  const { pathname } = useLocation();
  const activity = practiceModules.find((module) => module.to === pathname);
  return (
    <div className={cn("mb-8 space-y-2", activity?.tone)}>
      <p className="inline-flex items-center gap-2 rounded-lg border border-activity-border bg-activity-soft px-4 py-2 text-base font-bold text-activity">{activity && <activity.icon aria-hidden className="size-5 shrink-0" />}{tag}</p>
      <h1 className="text-4xl md:text-5xl font-extrabold">{title}</h1>
    </div>
  );
}
