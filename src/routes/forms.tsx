import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { GovFormSandbox } from "@/components/GovFormSandbox";
import { PageTitle } from "@/components/kit";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/forms")({
  head: () => ({
    meta: [
      { title: "Government Form Practice — ClickWise" },
      { name: "description", content: "Practice official forms with every confusing term explained in plain English and Urdu." },
      { property: "og:title", content: "Government Form Practice — ClickWise" },
      { property: "og:description", content: "Practice official forms with every confusing term explained in plain English and Urdu." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useT();
  return (
    <>
      <Link to="/" className="tap mb-6 inline-flex items-center gap-2 rounded-xl border-2 border-input bg-card text-lg font-bold">
        <ArrowLeft aria-hidden className="rtl:rotate-180" /> {t("back")}
      </Link>
      <PageTitle tag={t("m3Tag")} title={t("m3Title")} />
      <GovFormSandbox />
    </>
  );
}
