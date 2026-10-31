import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion, X } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Btn, SpeakButton } from "./kit";
import type { Key } from "@/lib/translations";

const chips: [Key, Key][] = [["chip1", "chip1A"], ["chip2", "chip2A"], ["chip3", "chip3A"]];

export function CompanionBar({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const { t } = useT();
  const [answer, setAnswer] = useState<Key | null>(null);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
      <div className="mx-auto max-w-4xl rounded-2xl border-2 border-ink bg-card shadow-card">
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-3 border-b-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">{t("helpTitle")}</h2>
                    <p className="text-muted-foreground">{t("helpBody")}</p>
                  </div>
                  <Btn variant="outline" aria-label={t("close")} onClick={() => setOpen(false)} className="px-4"><X aria-hidden /></Btn>
                </div>
                {answer && (
                  <div role="status" aria-live="polite" className="rounded-xl bg-success-soft p-4 text-xl">
                    <p>{t(answer)}</p>
                    <SpeakButton text={t(answer)} className="mt-3" />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-wrap items-center gap-2 p-3">
          <span className="flex items-center gap-2 font-bold text-lg pe-2">
            <MessageCircleQuestion aria-hidden className="text-primary" /> {t("companion")}
          </span>
          {chips.map(([q, a]) => (
            <button
              key={q}
              onClick={() => { setAnswer(a); setOpen(true); }}
              className="min-h-14 rounded-full border-2 border-primary bg-secondary px-4 text-base font-bold text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            >
              {t(q)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
