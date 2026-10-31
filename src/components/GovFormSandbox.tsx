import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Key } from "@/lib/translations";
import { Btn, GuidePanel } from "./kit";

const fields: { term: Key; plain: Key; label?: Key; ph: Key }[] = [
  { term: "f1", plain: "f1Plain", ph: "f1Ph" },
  { term: "f2", plain: "f2Plain", label: "f2Q", ph: "f2Ph" },
  { term: "f3", plain: "f3Plain", ph: "f3Ph" },
  { term: "f4", plain: "f4Plain", ph: "f4Ph" },
];

export function GovFormSandbox() {
  const { t } = useT();
  const [i, setI] = useState(0);
  const [vals, setVals] = useState<string[]>(["", "", "", ""]);
  const [showPlain, setShowPlain] = useState(false);
  const [mode, setMode] = useState<"fill" | "review" | "done">("fill");
  const f = fields[i];

  const guide = mode === "done" ? t("formDone") : mode === "review" ? t("notSubmitted") : showPlain ? `${t(f.term)} = ${t(f.plain)}` : t("fG1");

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <GuidePanel message={guide} tone={mode === "fill" ? "info" : "success"} stepLabel={mode === "fill" ? `${t("step")} ${i + 1} ${t("of")} ${fields.length}` : undefined} />

      <section className="rounded-2xl border-2 bg-card p-6 shadow-card">
        <h2 className="mb-2 text-2xl font-bold">{t("formTitle")}</h2>
        <div className="mb-6 flex gap-1.5" aria-hidden>
          {fields.map((_, k) => <span key={k} className={`h-2.5 flex-1 rounded-full ${k <= i || mode !== "fill" ? "bg-primary" : "bg-muted"}`} />)}
        </div>

        <AnimatePresence mode="wait">
          {mode === "fill" && (
            <motion.form key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              onSubmit={(e) => { e.preventDefault(); setShowPlain(false); i < fields.length - 1 ? setI(i + 1) : setMode("review"); }} className="space-y-4">
              <label htmlFor={`f-${i}`} className="block text-xl font-bold">
                {f.label ? <>{t(f.label)} — </> : null}
                <button type="button" onClick={() => setShowPlain((s) => !s)} aria-expanded={showPlain}
                  className="inline-flex items-center gap-1 underline decoration-dotted decoration-2 underline-offset-4 text-primary">
                  {t(f.term)} <HelpCircle aria-hidden className="size-5" />
                </button>
              </label>
              {showPlain && (
                <div role="note" className="rounded-xl border-2 border-primary bg-secondary p-4 text-lg">
                  <p className="font-bold">{t("whatMeans")}</p>
                  <p>{t(f.plain)}</p>
                </div>
              )}
              <input id={`f-${i}`} autoFocus value={vals[i]} placeholder={t(f.ph)}
                onChange={(e) => setVals(vals.map((v, k) => (k === i ? e.target.value : v)))}
                className="h-16 w-full rounded-xl border-2 border-input bg-card px-4 text-xl placeholder:text-muted-foreground" />
              <div className="flex gap-3">
                {i > 0 && <Btn type="button" variant="outline" onClick={() => { setI(i - 1); setShowPlain(false); }}>{t("previous")}</Btn>}
                <Btn type="submit" className="flex-1">{i < fields.length - 1 ? t("next") : t("review")}</Btn>
              </div>
            </motion.form>
          )}

          {mode === "review" && (
            <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xl font-bold">{t("reviewTitle")}</h3>
              <dl className="divide-y rounded-xl border-2">
                {fields.map((x, k) => (
                  <div key={k} className="p-4">
                    <dt className="text-muted-foreground">{t(x.term)}</dt>
                    <dd className="text-xl font-bold">{vals[k] || t("empty")}</dd>
                  </div>
                ))}
              </dl>
              <p className="flex gap-2 rounded-xl bg-success-soft p-4 text-lg font-bold text-success">
                <ShieldCheck aria-hidden className="shrink-0" /> {t("notSubmitted")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Btn variant="outline" onClick={() => { setMode("fill"); setI(0); }}>{t("edit")}</Btn>
                <Btn variant="success" className="flex-1" onClick={() => setMode("done")}>{t("finish")}</Btn>
              </div>
            </motion.div>
          )}

          {mode === "done" && (
            <motion.div key="d" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-4 py-8 text-center">
              <CheckCircle2 aria-hidden className="mx-auto size-24 text-success" />
              <p className="text-2xl font-bold text-success">{t("formDone")}</p>
              <Btn variant="outline" onClick={() => { setMode("fill"); setI(0); setVals(["", "", "", ""]); }}>{t("tryAgain")}</Btn>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
