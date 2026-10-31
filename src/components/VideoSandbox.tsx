import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, ArrowUp, Lock } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Key } from "@/lib/translations";
import { Btn, GuidePanel } from "./kit";

export function VideoSandbox() {
  const { t } = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [level, setLevel] = useState(0);
  const [msg, setMsg] = useState<Key>("vG1");
  const [denied, setDenied] = useState(false);

  useEffect(() => () => streamRef.current?.getTracks().forEach((x) => x.stop()), []);

  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = s;
      setActive(true);
      if (videoRef.current) videoRef.current.srcObject = s;
      const ctx = new AudioContext();
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      ctx.createMediaStreamSource(s).connect(an);
      const data = new Uint8Array(an.frequencyBinCount);
      const tick = () => {
        if (!streamRef.current) return;
        an.getByteFrequencyData(data);
        setLevel(Math.min(100, (data.reduce((a, b) => a + b, 0) / data.length) * 2));
        requestAnimationFrame(tick);
      };
      tick();
      setMsg("vGood");
    } catch (e) {
      const name = (e as Error).name;
      if (name === "NotFoundError") setMsg("noDevice");
      else { setMsg("deniedReal"); setDenied(true); }
    }
  };

  useEffect(() => { if (active && videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current; }, [active, camOn]);

  const toggleMic = () => {
    const n = !micOn; setMicOn(n);
    streamRef.current?.getAudioTracks().forEach((x) => (x.enabled = n));
    setMsg(n ? "vGood" : "vMuted");
  };
  const toggleCam = () => {
    const n = !camOn; setCamOn(n);
    streamRef.current?.getVideoTracks().forEach((x) => (x.enabled = n));
    setMsg(n ? "vCamGood" : "vCamHidden");
  };

  const good = msg === "vGood" || msg === "vCamGood";
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <GuidePanel message={t(msg)} tone={good ? "success" : msg === "vG1" ? "info" : "warn"}>
        <Btn variant="outline" className="w-full" onClick={() => setDenied(true)}>{t("simulateDenied")}</Btn>
      </GuidePanel>

      <section className="space-y-5 rounded-2xl border-2 bg-card p-5 shadow-card">
        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-xl bg-ink text-ink-foreground">
          {active && camOn ? (
            <video ref={videoRef} autoPlay muted playsInline className="size-full object-cover -scale-x-100" />
          ) : (
            <div className="text-center"><VideoOff aria-hidden className="mx-auto size-14" /><p className="mt-2 text-xl">{t("camOff")}</p></div>
          )}
        </div>
        {!active ? (
          <Btn className="w-full" onClick={start}><Video aria-hidden /> {t("startCheck")}</Btn>
        ) : (
          <>
            <div>
              <p className="text-lg font-bold" id="lvl">{t("micLevel")}</p>
              <p className="text-muted-foreground">{t("speakNow")}</p>
              <div role="meter" aria-labelledby="lvl" aria-valuenow={Math.round(micOn ? level : 0)} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-8 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-success transition-[width] duration-75" style={{ width: `${micOn ? level : 0}%` }} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Btn variant={micOn ? "ink" : "danger"} onClick={toggleMic} aria-pressed={!micOn} className="min-h-20 text-xl">
                {micOn ? <Mic aria-hidden /> : <MicOff aria-hidden />} {micOn ? t("muteMic") : t("unmuteMic")}
              </Btn>
              <Btn variant={camOn ? "ink" : "danger"} onClick={toggleCam} aria-pressed={!camOn} className="min-h-20 text-xl">
                {camOn ? <Video aria-hidden /> : <VideoOff aria-hidden />} {camOn ? t("camTurnOff") : t("camTurnOn")}
              </Btn>
            </div>
          </>
        )}
      </section>

      <AnimatePresence>
        {denied && (
          <motion.div className="fixed inset-0 z-50 bg-ink/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div role="dialog" aria-modal="true" aria-labelledby="dn-t" className="mx-auto mt-4 max-w-xl px-4">
              <div className="flex items-center gap-2 rounded-xl bg-card p-3 text-lg" dir="ltr">
                <span className="glow grid size-12 place-items-center rounded-lg bg-secondary"><Lock aria-hidden /></span>
                <span className="text-muted-foreground">clickwise.app/video-check</span>
              </div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="ms-3 w-fit text-primary-foreground" dir="ltr">
                <ArrowUp aria-hidden className="size-14" />
              </motion.div>
              <div className="space-y-4 rounded-2xl bg-card p-6">
                <h2 id="dn-t" className="text-2xl font-bold">{t("deniedTitle")}</h2>
                <p className="text-xl">{t("deniedBody")}</p>
                <Btn autoFocus className="w-full" onClick={() => setDenied(false)}>{t("gotIt")}</Btn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
