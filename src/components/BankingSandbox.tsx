import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MessageSquare, CheckCircle2, ShieldAlert, Landmark } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Btn, GuidePanel } from "./kit";

type Stage = "home" | "expired" | "phone" | "otp" | "done";
const order: Stage[] = ["home", "expired", "phone", "otp", "done"];
const guideKey = { home: "bankG1", expired: "bankG2", phone: "bankG3", otp: "bankG4", done: "bankG5" } as const;

export function BankingSandbox() {
  const { t } = useT();
  const [stage, setStage] = useState<Stage>("home");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [wrong, setWrong] = useState(false);
  const idx = order.indexOf(stage) + 1;

  const verify = () => {
    if (otp.replace(/\D/g, "") === "582910") setStage("done");
    else setWrong(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <GuidePanel
        message={wrong && stage === "otp" ? t("otpWrong") : t(guideKey[stage])}
        tone={stage === "done" ? "success" : wrong ? "warn" : "info"}
        stepLabel={`${t("step")} ${idx} ${t("of")} 5`}
      >
        {stage !== "home" && <Btn variant="outline" onClick={() => { setStage("home"); setOtp(""); setPhone(""); setWrong(false); }}>{t("tryAgain")}</Btn>}
      </GuidePanel>

      <section aria-label={t("bankName")} className="relative overflow-hidden rounded-2xl border-2 bg-card shadow-card">
        <div className="flex items-center gap-2 bg-ink p-4 text-ink-foreground font-bold text-xl">
          <Landmark aria-hidden /> {t("bankName")}
        </div>

        <AnimatePresence>
          {stage === "otp" && (
            <motion.div
              role="alert"
              initial={{ y: -120 }} animate={{ y: 0 }} exit={{ y: -120 }}
              transition={{ type: "spring", damping: 18 }}
              className="absolute inset-x-3 top-3 z-10 flex gap-3 rounded-2xl bg-ink p-4 text-ink-foreground shadow-card"
            >
              <MessageSquare aria-hidden className="mt-1 shrink-0" />
              <div><p className="font-bold">{t("smsFrom")}</p><p className="text-lg">{t("smsBody")}</p></div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-h-[26rem] p-6">
          {stage === "home" && (
            <div className="space-y-6">
              <p className="text-2xl font-bold">{t("bankWelcome")}</p>
              <div className="grid grid-cols-2 gap-3 opacity-70" aria-hidden>
                {["Transfer", "Bills", "Cards", "History"].map((x) => <div key={x} className="rounded-xl bg-muted p-5 font-bold">{x}</div>)}
              </div>
              <Btn className="w-full" onClick={() => setStage("expired")}><Clock aria-hidden /> {t("simulateIdle")}</Btn>
            </div>
          )}

          {stage === "expired" && (
            <motion.div role="alertdialog" aria-labelledby="exp-t" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto max-w-sm space-y-4 rounded-2xl border-4 border-warn bg-warn-soft p-6 text-center">
              <Clock aria-hidden className="mx-auto size-14 text-warn" />
              <h2 id="exp-t" className="text-2xl font-bold">{t("sessionExpired")}</h2>
              <p className="text-lg">{t("sessionExpiredBody")}</p>
              <Btn className="w-full" onClick={() => setStage("phone")}>{t("loginAgain")}</Btn>
            </motion.div>
          )}

          {stage === "phone" && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (phone.trim()) setStage("otp"); }}>
              <label htmlFor="ph" className="block text-xl font-bold">{t("phoneLabel")}</label>
              <p id="ph-h" className="text-muted-foreground">{t("phoneHint")}</p>
              <input id="ph" aria-describedby="ph-h" inputMode="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="h-16 w-full rounded-xl border-2 border-input bg-card px-4 text-2xl" />
              <Btn type="submit" className="w-full" disabled={!phone.trim()}>{t("sendOtp")}</Btn>
            </form>
          )}

          {stage === "otp" && (
            <form className="mt-28 space-y-4" onSubmit={(e) => { e.preventDefault(); verify(); }}>
              <label htmlFor="otp" className="block text-xl font-bold">{t("otpLabel")}</label>
              <input id="otp" autoFocus inputMode="numeric" maxLength={7} dir="ltr" value={otp} onChange={(e) => { setOtp(e.target.value); setWrong(false); }}
                className="glow h-20 w-full rounded-xl border-2 border-primary bg-card px-4 text-center text-4xl tracking-[0.4em]" aria-describedby="otp-n" />
              <p id="otp-n" className="flex gap-2 rounded-xl bg-danger-soft p-4 text-lg font-bold text-destructive">
                <ShieldAlert aria-hidden className="shrink-0" /> {t("otpNotice")}
              </p>
              <Btn type="submit" className="w-full">{t("verify")}</Btn>
            </form>
          )}

          {stage === "done" && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-4 py-10 text-center">
              <CheckCircle2 aria-hidden className="mx-auto size-24 text-success" />
              <p className="text-3xl font-bold text-success">{t("bankDone")}</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
