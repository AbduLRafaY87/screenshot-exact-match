import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BankingSandbox } from "@/components/BankingSandbox";
import { PageTitle } from "@/components/kit";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/banking")({
  head: () => ({
    meta: [
      { title: "Banking Practice — ClickWise" },
      { name: "description", content: "Practice bank logouts and entering OTP codes safely in a pretend bank." },
      { property: "og:title", content: "Banking Practice — ClickWise" },
      { property: "og:description", content: "Practice bank logouts and entering OTP codes safely in a pretend bank." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      <PageTitle tag={t("m1Tag")} title={t("m1Title")} />
      <BankingSandbox />
    </>
  );
}
