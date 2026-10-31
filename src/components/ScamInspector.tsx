import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Key } from "@/lib/translations";
import { Btn, GuidePanel } from "./kit";
import { cn } from "@/lib/utils";

type Kind = "scam" | "safe" | "upload";

export function ScamInspector() {
  const { t } = useT();
  const [kind, setKind] = useState<Kind | null>(null);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  const [active, setActive] = useState<Key | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = (k: Kind) => {
    setKind(null); setActive(null); setChecks({}); setLoading(true);
    setTimeout(() => { setKind(k); setLoading(false); }, 1200);
  };
  const onFile = (f?: File) => {
    if (!f || !f.type.startsWith("image/")) return;
    setImg(URL.createObjectURL(f));
    run("upload");
  };

  const flagsChecked = Object.values(checks).filter(Boolean).length;
  const score = kind === "scam" ? 92 : kind === "safe" ? 8 : Math.min(95, 15 + flagsChecked * 22);
  const riskLabel = score >= 60 ? t("highRisk") : score >= 30 ? t("medRisk") : t("lowRisk");
  const barCls = score >= 60 ? "bg-destructive" : score >= 30 ? "bg-warn" : "bg-success";
  const steps = kind === "scam" ? t("scamSteps") : kind === "safe" ? t("safeSteps") : t("uploadSteps");

  const guide = loading ? t("analyzing") : active ? t(active) : kind === "upload" ? t("uploadInfo") : kind ? steps : t("sG1");

  const Hot = ({ k, ok, children, className }: { k: Key; ok?: boolean; children: React.ReactNode; className?: string }) => (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      onClick={() => setActive(k)} aria-label={t(k)}
      className={cn("relative rounded-md px-1", ok ? "outline-4 outline-success outline" : "glow-danger", className)}
    >{children}</motion.button>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <GuidePanel message={guide} tone={kind === "scam" ? "warn" : kind === "safe" ? "success" : "info"} />

      <section className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Btn variant="danger" onClick={() => { setImg(null); run("scam"); }}>{t("sample1")}</Btn>
          <Btn variant="success" onClick={() => { setImg(null); run("safe"); }}>{t("sample2")}</Btn>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
          className={cn("flex w-full flex-col items-center gap-2 rounded-2xl border-4 border-dashed bg-card p-8 text-xl font-bold", drag ? "border-primary bg-secondary" : "border-input")}
        >
          <Upload aria-hidden className="size-10 text-primary" />
          {t("dropHere")}
          <span className="text-base font-normal text-muted-foreground">{t("uploadNote")}</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} aria-label={t("dropHere")} />

        {loading && <p className="flex items-center gap-2 text-xl" role="status"><Loader2 className="animate-spin" aria-hidden /> {t("analyzing")}</p>}

        {kind && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 rounded-2xl border-2 bg-card p-5 shadow-card">
            {kind !== "upload" ? (
              <div className="rounded-2xl bg-muted p-5" dir="ltr">
                <p className="mb-2 text-base text-muted-foreground">
                  {kind === "scam" ? <Hot k="flag3Body">+92 301 4455667</Hot> : <Hot k="ok1Body" ok>LESCO</Hot>}
                </p>
                <div className="rounded-2xl rounded-tl-none bg-card p-4 text-xl leading-relaxed">
                  {kind === "scam" ? (
                    <>
                      <Hot k="flag1Body">URGENT:</Hot> Your account is suspended! Click{" "}
                      <Hot k="flag2Body" className="text-primary underline">bank-login-verify.net</Hot>{" "}
                      <Hot k="flag1Body">immediately</Hot> to restore access.
                    </>
                  ) : (
                    <>Your bill for Oct is Rs. 3,420, due 15 Nov. <Hot k="ok2Body" ok>Pay at any branch or in the official LESCO app.</Hot></>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {img && <img src={img} alt="" className="max-h-80 w-full rounded-xl object-contain bg-muted" />}
                <fieldset className="space-y-2">
                  {(["chkUrgent", "chkLink", "chkCode", "chkPrize"] as Key[]).map((c) => (
                    <label key={c} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-lg has-[:checked]:border-destructive has-[:checked]:bg-danger-soft">
                      <input type="checkbox" className="size-7 accent-[var(--color-destructive)]" checked={!!checks[c]} onChange={(e) => setChecks({ ...checks, [c]: e.target.checked })} />
                      {t(c)}
                    </label>
                  ))}
                </fieldset>
              </div>
            )}

            {kind === "scam" && (
              <ul className="space-y-2">
                {(["flag1", "flag2", "flag3"] as const).map((f) => (
                  <li key={f} className="flex gap-2 rounded-xl bg-danger-soft p-3 text-lg"><AlertTriangle aria-hidden className="shrink-0 text-destructive" /><span><b>{t(f)}:</b> {t(`${f}Body` as Key)}</span></li>
                ))}
              </ul>
            )}
            {kind === "safe" && (
              <ul className="space-y-2">
                {(["ok1", "ok2"] as const).map((f) => (
                  <li key={f} className="flex gap-2 rounded-xl bg-success-soft p-3 text-lg"><CheckCircle2 aria-hidden className="shrink-0 text-success" /><span><b>{t(f)}:</b> {t(`${f}Body` as Key)}</span></li>
                ))}
              </ul>
            )}

            <div>
              <p className="text-2xl font-bold" id="risk">{score}% {riskLabel}</p>
              <div role="meter" aria-labelledby="risk" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-6 overflow-hidden rounded-full bg-muted">
                <motion.div className={`h-full ${barCls}`} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="font-bold text-lg">{t("nextSteps")}</p>
              <p className="text-xl">{steps}</p>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
