import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { speak, useT } from "@/lib/i18n";

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
      "tap inline-flex items-center justify-center gap-2 rounded-xl text-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      className,
    )}
    {...p}
  />
));
Btn.displayName = "Btn";

export function SpeakButton({ text, className }: { text: string; className?: string }) {
  const { t, lang } = useT();
  return (
    <Btn variant="soft" className={cn("text-base", className)} onClick={() => speak(text, lang) || alert(t("noVoice"))}>
      <Volume2 aria-hidden className="size-6" /> {t("readAloud")}
    </Btn>
  );
}

/** Left-side guide panel with animated message. */
export function GuidePanel({ message, tone = "info", stepLabel, children }: { message: string; tone?: "info" | "success" | "warn"; stepLabel?: string | undefined; children?: ReactNode }) {
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
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
          className={cn("rounded-2xl border-l-8 p-5 text-xl shadow-card", toneCls)}
        >
          {message}
        </motion.div>
      </AnimatePresence>
      <SpeakButton text={message} />
      {children}
    </aside>
  );
}

export function PageTitle({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="mb-8 space-y-2">
      <p className="text-lg font-bold text-primary">{tag}</p>
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
    </div>
  );
}
