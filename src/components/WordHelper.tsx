import { useState } from "react";
import { Search, Lightbulb } from "lucide-react";
import { useT } from "@/lib/i18n";
import { techWords } from "@/lib/translations";
import { SpeakButton } from "@/components/kit";

export function WordHelper() {
  const { t, lang } = useT();
  const [q, setQ] = useState("");
  const list = techWords.filter((w) => {
    const s = q.trim().toLowerCase();
    return !s || w.term.toLowerCase().includes(s) || w[lang].means.toLowerCase().includes(s);
  });
  return (
    <div className="space-y-6">
      <label className="flex items-center gap-3 rounded-full border-2 border-input bg-card px-5 shadow-card focus-within:border-primary">
        <Search aria-hidden className="size-6 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("wSearch")}
          aria-label={t("wSearch")}
          className="min-h-16 w-full bg-transparent text-xl outline-none"
        />
      </label>
      {list.length === 0 && <p className="text-xl text-muted-foreground">{t("wNone")}</p>}
      <ul className="grid gap-5 md:grid-cols-2">
        {list.map((w) => (
          <li key={w.term} className="flex flex-col gap-3 rounded-3xl border bg-card p-6 shadow-card">
            <h2 className="text-3xl font-extrabold" dir="ltr">{w.term}</h2>
            <div>
              <p className="text-base font-bold text-muted-foreground">{t("wMeans")}</p>
              <p className="text-xl">{w[lang].means}</p>
            </div>
            <p className="flex gap-3 rounded-2xl bg-warn-soft p-4 text-lg">
              <Lightbulb aria-hidden className="size-6 shrink-0 text-warn" />
              <span><b>{t("wLike")}:</b> {w[lang].like}</span>
            </p>
            <SpeakButton text={`${w.term}. ${w[lang].means} ${t("wLike")}: ${w[lang].like}`} className="mt-auto w-fit" />
          </li>
        ))}
      </ul>
    </div>
  );
}
