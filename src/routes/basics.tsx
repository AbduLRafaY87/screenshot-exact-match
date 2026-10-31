import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { GestureGym } from "@/components/GestureGym";
import { PageTitle } from "@/components/kit";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/basics")({
  head: () => ({
    meta: [
      { title: "Phone Basics — ClickWise" },
      { name: "description", content: "Practice tapping, holding and swiping on a phone in a safe space." },
      { property: "og:title", content: "Phone Basics — ClickWise" },
      { property: "og:description", content: "Practice tapping, holding and swiping on a phone in a safe space." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useT();
  return (
    <>
      <Link to="/" className="tap mb-6 inline-flex items-center gap-2 rounded-full border bg-card shadow-card hover:bg-muted text-lg font-bold">
        <ArrowLeft aria-hidden className="rtl:rotate-180" /> {t("back")}
      </Link>
      <PageTitle tag={t("m5Tag")} title={t("m5Title")} />
      <GestureGym />
    </>
  );
}
