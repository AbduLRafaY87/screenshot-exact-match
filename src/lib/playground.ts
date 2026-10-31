import { Hand, Landmark, Video, FileText, ShieldAlert, BookOpen } from "lucide-react";

export const practiceModules = [
  { to: "/basics", icon: Hand, tag: "m5Tag", title: "m5Title", sub: "m5Sub", tone: "bg-secondary text-secondary-foreground" },
  { to: "/banking", icon: Landmark, tag: "m1Tag", title: "m1Title", sub: "m1Sub", tone: "bg-primary text-primary-foreground" },
  { to: "/video-check", icon: Video, tag: "m2Tag", title: "m2Title", sub: "m2Sub", tone: "bg-success-soft text-success" },
  { to: "/forms", icon: FileText, tag: "m3Tag", title: "m3Title", sub: "m3Sub", tone: "bg-warn-soft text-warn" },
  { to: "/scam-shield", icon: ShieldAlert, tag: "m4Tag", title: "m4Title", sub: "m4Sub", tone: "bg-danger-soft text-destructive" },
  { to: "/words", icon: BookOpen, tag: "m6Tag", title: "m6Title", sub: "m6Sub", tone: "bg-secondary text-secondary-foreground" },
] as const;

export const PROFILE_KEY = "cw-profile";
export type PlaygroundProfile = { name: string };
export function readProfile(storage: Pick<Storage, "getItem">): PlaygroundProfile | null {
  try {
    const raw = storage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (typeof value === "object" && value !== null && "name" in value && typeof value.name === "string") return { name: value.name.trim() };
  } catch { /* Unavailable storage should not stop practice. */ }
  return null;
}
export function saveProfile(storage: Pick<Storage, "setItem">, name: string): PlaygroundProfile {
  const profile = { name: name.trim() };
  try { storage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* Keep the current session usable. */ }
  return profile;
}