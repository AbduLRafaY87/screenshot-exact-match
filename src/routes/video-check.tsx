import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { VideoSandbox } from "@/components/VideoSandbox";
import { PageTitle } from "@/components/kit";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/video-check")({
  head: () => ({
    meta: [
      { title: "Camera & Mic Check — ClickWise" },
      { name: "description", content: "Test your camera and microphone and learn to allow browser permissions before family calls." },
      { property: "og:title", content: "Camera & Mic Check — ClickWise" },
      { property: "og:description", content: "Test your camera and microphone and learn to allow browser permissions before family calls." },
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
      <PageTitle tag={t("m2Tag")} title={t("m2Title")} />
      <VideoSandbox />
    </>
  );
}
