import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Hand, MousePointerClick, Timer, MoveRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Key } from "@/lib/translations";
import { Btn, SpeakButton } from "@/components/kit";
import { cn } from "@/lib/utils";

type G = "tap" | "dbl" | "hold" | "swipe";
const items: { id: G; icon: typeof Hand; title: Key; how: Key; why: Key }[] = [
  { id: "tap", icon: MousePointerClick, title: "gTapTitle", how: "gTapHow", why: "gTapWhy" },
  { id: "dbl", icon: Hand, title: "gDblTitle", how: "gDblHow", why: "gDblWhy" },
  { id: "hold", icon: Timer, title: "gHoldTitle", how: "gHoldHow", why: "gHoldWhy" },
  { id: "swipe", icon: MoveRight, title: "gSwipeTitle", how: "gSwipeHow", why: "gSwipeWhy" },
];

export function GestureGym() {
  const { t } = useT();
  const [done, setDone] = useState<Record<G, boolean>>({ tap: false, dbl: false, hold: false, swipe: false });
  const count = Object.values(done).filter(Boolean).length;
  const mark = (g: G, v = true) => setDone((d) => ({ ...d, [g]: v }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-card p-5 shadow-card">
        <div className="mb-2 flex justify-between text-lg font-bold">
          <span>{count} / 4 {t("gProgress")}</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full bg-success" animate={{ width: `${count * 25}%` }} />
        </div>
        {count === 4 && <p className="mt-3 text-xl font-bold text-success">{t("gDoneAll")}</p>}
      </div>
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((it) => (
          <li key={it.id} className={cn("flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-card", done[it.id] && "border-success")}>
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground"><it.icon aria-hidden /></span>
              <h2 className="text-2xl font-extrabold">{t(it.title)}</h2>
              {done[it.id] && <CheckCircle2 aria-hidden className="ms-auto size-8 text-success" />}
            </div>
            <p className="text-xl">{t(it.how)}</p>
            <div className="grid min-h-48 place-items-center rounded-2xl bg-muted p-4">
              {done[it.id] ? (
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{t("gGreat")}</p>
                  <Btn variant="outline" className="mt-3" onClick={() => mark(it.id, false)}>
                    <RotateCcw aria-hidden /> {t("gAgain")}
                  </Btn>
                </div>
              ) : (
                <Pad g={it.id} onDone={() => mark(it.id)} label={t(it.title)} />
              )}
            </div>
            <p className="text-lg text-muted-foreground"><b className="text-foreground">{t("gWhy")}:</b> {t(it.why)}</p>
            <SpeakButton text={`${t(it.how)} ${t("gWhy")}: ${t(it.why)}`} className="w-fit" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pad({ g, onDone, label }: { g: G; onDone: () => void; label: string }) {
  const lastTap = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hold, setHold] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  if (g === "swipe") {
    return (
      <div ref={track} className="relative h-20 w-full max-w-sm rounded-full border-2 border-dashed border-input bg-card" dir="ltr">
        <span className="absolute end-6 top-1/2 -translate-y-1/2 text-muted-foreground"><MoveRight aria-hidden className="size-8" /></span>
        <motion.button
          aria-label={label}
          drag="x"
          dragConstraints={track}
          dragElastic={0}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            const w = track.current?.offsetWidth ?? 300;
            if (info.offset.x > w * 0.6) onDone();
          }}
          className="glow absolute start-1 top-1 size-[4.5rem] touch-none rounded-full bg-primary"
        />
      </div>
    );
  }

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setHold(0);
  };

  return (
    <button
      aria-label={label}
      className="glow relative grid size-32 touch-none select-none place-items-center overflow-hidden rounded-full bg-primary text-primary-foreground"
      onClick={() => {
        if (g === "tap") onDone();
        if (g === "dbl") {
          const now = Date.now();
          if (now - lastTap.current < 450) onDone();
          lastTap.current = now;
        }
      }}
      onPointerDown={() => {
        if (g !== "hold") return;
        let v = 0;
        timer.current = setInterval(() => {
          v += 5;
          setHold(v);
          if (v >= 100) { stop(); onDone(); }
        }, 75);
      }}
      onPointerUp={g === "hold" ? stop : undefined}
      onPointerLeave={g === "hold" ? stop : undefined}
      onContextMenu={(e) => e.preventDefault()}
    >
      {g === "hold" && <span aria-hidden className="absolute inset-x-0 bottom-0 bg-success" style={{ height: `${hold}%` }} />}
      <Hand aria-hidden className="relative size-12" />
    </button>
  );
}
