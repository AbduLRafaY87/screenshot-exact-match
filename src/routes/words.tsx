import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { WordHelper } from "@/components/WordHelper";
import { PageTitle } from "@/components/kit";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/words")({
  head: () => ({
    meta: [
      { title: "Tech Words Made Simple — ClickWise" },
      { name: "description", content: "Plain-language meanings of confusing tech words, with everyday comparisons." },
      { property: "og:title", content: "Tech Words Made Simple — ClickWise" },
      { property: "og:description", content: "Plain-language meanings of confusing tech words, with everyday comparisons." },
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
      <PageTitle tag={t("m6Tag")} title={t("m6Title")} />
      <WordHelper />
    </>
  );
}
