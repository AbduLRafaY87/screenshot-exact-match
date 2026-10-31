import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ScamInspector } from "@/components/ScamInspector";
import { PageTitle } from "@/components/kit";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/scam-shield")({
  head: () => ({
    meta: [
      { title: "Scam Shield — ClickWise" },
      { name: "description", content: "Check suspicious SMS and email screenshots for fake links and urgency red flags." },
      { property: "og:title", content: "Scam Shield — ClickWise" },
      { property: "og:description", content: "Check suspicious SMS and email screenshots for fake links and urgency red flags." },
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
      <PageTitle tag={t("m4Tag")} title={t("m4Title")} />
      <ScamInspector />
    </>
  );
}
