import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MessageSquare, CheckCircle2, ShieldAlert, Landmark, Wallet } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Key } from "@/lib/translations";
import { Btn, GuidePanel } from "./kit";

type Stage = "home" | "expired" | "phone" | "otp" | "done";
const order: Stage[] = ["home", "expired", "phone", "otp", "done"];
const guideKey: Record<Stage, Key> = { home: "bankG1", expired: "bankG2", phone: "bankG3", otp: "bankG4", done: "goldenRule" };
const CODE = "582910";

function Confetti() {
  const colors = ["bg-primary", "bg-success", "bg-warn", "bg-destructive"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 36 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ x: "50%", y: "40%", opacity: 1, scale: 1 }}
          animate={{
            x: `${8 + Math.random() * 84}%`,
            y: `${60 + Math.random() * 60}%`,
            opacity: 0,
            rotate: Math.random() * 720 - 360,
          }}
          transition={{ duration: 1.6 + Math.random(), ease: "easeOut" }}
          className={`absolute size-3 rounded-sm ${colors[i % 4]}`}
          style={{ left: 0, top: 0 }}
        />
      ))}
    </div>
  );
}

export function BankingSandbox() {
  const { t } = useT();
  const [stage, setStage] = useState<Stage>("home");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [wrong, setWrong] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const boxRefs = useRef<(HTMLInputElement | null)[]>([]);
  const idx = order.indexOf(stage) + 1;

  // Step 1: the bank logs you out on its own after 3 seconds.
  useEffect(() => {
    if (stage !== "home") return;
    const id = setTimeout(() => setStage("expired"), 3000);
    return () => clearTimeout(id);
  }, [stage]);

  const reset = () => { setStage("home"); setDigits(["", "", "", "", "", ""]); setPhone(""); setWrong(false); setConfetti(false); };

  const goNext = () => {
    if (stage === "home") setStage("expired");
    else if (stage === "expired") setStage("phone");
    else if (stage === "phone" && phone.trim()) setStage("otp");
  };
  const goPrev = () => {
    if (stage === "expired") setStage("home");
    else if (stage === "phone") setStage("expired");
    else if (stage === "otp") setStage("phone");
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => prev.map((x, k) => (k === i ? d : x)));
    setWrong(false);
    if (d && i < 5) boxRefs.current[i + 1]?.focus();
  };

  const verify = () => {
    if (digits.join("") === CODE) {
      setStage("done");
      setConfetti(true);
    } else setWrong(true);
  };

  const filled = digits.every((d) => d !== "");
  const msg: Key = wrong && stage === "otp" ? "otpWrong" : guideKey[stage];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <GuidePanel
        message={t(msg)}
        tone={stage === "done" ? "success" : wrong ? "warn" : "info"}
        stepLabel={`${t("step")} ${Math.min(idx, 4)} ${t("of")} 4`}
        onPrev={stage === "expired" || stage === "phone" || stage === "otp" ? goPrev : undefined}
        onNext={stage === "home" || stage === "expired" || stage === "phone" ? goNext : undefined}
        nextDisabled={stage === "phone" && !phone.trim()}
      >
        {stage !== "home" && <Btn variant="outline" onClick={reset}>{t("tryAgain")}</Btn>}
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
              <div className="flex items-center gap-4 rounded-2xl bg-secondary p-5">
                <Wallet aria-hidden className="size-10 text-primary" />
                <div>
                  <p className="text-muted-foreground">Current Account</p>
                  <p className="text-3xl font-bold" dir="ltr">Rs. 125,400</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 opacity-70" aria-hidden>
                {["Transfer", "Bills", "Cards", "History"].map((x) => <div key={x} className="rounded-xl bg-muted p-5 font-bold">{x}</div>)}
              </div>
              <Btn variant="outline" className="w-full" onClick={() => setStage("expired")}><Clock aria-hidden /> {t("simulateIdle")}</Btn>
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
              <Btn type="submit" className="glow w-full" disabled={!phone.trim()}>{t("sendOtp")}</Btn>
            </form>
          )}

          {stage === "otp" && (
            <form className="mt-24 space-y-4" onSubmit={(e) => { e.preventDefault(); verify(); }}>
              <label htmlFor="otp-0" className="block text-xl font-bold">{t("otpLabel")}</label>
              <div className="flex justify-center gap-2" dir="ltr">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    ref={(el) => { boxRefs.current[i] = el; }}
                    autoFocus={i === 0}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`${t("otpLabel")} ${i + 1}`}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) boxRefs.current[i - 1]?.focus(); }}
                    className="glow h-16 w-12 rounded-xl border-2 border-primary bg-card text-center text-3xl font-bold sm:h-20 sm:w-14"
                  />
                ))}
              </div>
              <p className="flex gap-2 rounded-xl bg-danger-soft p-4 text-lg font-bold text-destructive">
                <ShieldAlert aria-hidden className="shrink-0" /> {t("otpNotice")}
              </p>
              <Btn type="submit" className="w-full" disabled={!filled}>{t("verify")}</Btn>
            </form>
          )}

          {stage === "done" && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative space-y-4 py-10 text-center">
              {confetti && <Confetti />}
              <CheckCircle2 aria-hidden className="mx-auto size-24 text-success" />
              <p className="text-3xl font-bold text-success">{t("bankDone")}</p>
              <p className="mx-auto max-w-md rounded-xl bg-success-soft p-4 text-lg font-bold text-success">{t("goldenRule")}</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
