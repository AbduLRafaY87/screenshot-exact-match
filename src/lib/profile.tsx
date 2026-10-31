import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Hand, Pencil } from "lucide-react";
import { Btn } from "@/components/kit";
import { useT } from "@/lib/i18n";
import { readProfile, saveProfile } from "./playground";

const ProfileContext = createContext<{ name: string; editName: () => void } | null>(null);
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { t, dir } = useT();
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  useEffect(() => {
    const profile = readProfile(localStorage);
    if (profile) { setName(profile.name); setFirstVisit(false); }
    else setOpen(true);
  }, []);
  const editName = () => { setDraft(name); setFirstVisit(false); setOpen(true); };
  const finish = (value: string) => {
    setName(saveProfile(localStorage, value).name);
    setOpen(false);
    setFirstVisit(false);
  };
  const dismiss = () => { if (firstVisit) finish(""); else setOpen(false); };
  return <ProfileContext.Provider value={{ name, editName }}>
    {children}
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) dismiss(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" />
        <Dialog.Content dir={dir} className="fixed start-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-7 shadow-lift rtl:translate-x-1/2">
          <span className="mb-5 grid size-16 place-items-center rounded-full bg-success-soft text-success">{firstVisit ? <Hand aria-hidden className="size-8" /> : <Pencil aria-hidden className="size-8" />}</span>
          <Dialog.Title className="text-3xl font-bold">{t(firstVisit ? "nameTitle" : "changeName")}</Dialog.Title>
          <Dialog.Description className="mt-3 text-lg text-muted-foreground">{t("nameQuestion")}</Dialog.Description>
          <form className="mt-6 space-y-5" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) finish(draft); }}>
            <div><label htmlFor="preferred-name" className="mb-2 block text-lg font-bold">{t("nameLabel")}</label>
              <input id="preferred-name" autoComplete="given-name" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t("namePlaceholder")} className="min-h-14 w-full rounded-lg border-2 border-input bg-background px-4 text-xl" />
            </div>
            <Btn type="submit" disabled={!draft.trim()} className="w-full">{t(firstVisit ? "nameSave" : "saveName")}</Btn>
            <Btn type="button" variant="soft" className="w-full" onClick={dismiss}>{t(firstVisit ? "nameLater" : "cancel")}</Btn>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </ProfileContext.Provider>;
}
export function useProfile() {
  const profile = useContext(ProfileContext);
  if (!profile) throw new Error("ProfileProvider is required");
  return profile;
}