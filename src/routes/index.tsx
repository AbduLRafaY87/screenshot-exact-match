import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClickWise — Safe tech practice for parents & grandparents" },
      { name: "description", content: "Practice banking, video calls, forms and spotting scams in a 100% safe sandbox, in English or Urdu." },
      { property: "og:title", content: "ClickWise — Safe tech practice" },
      { property: "og:description", content: "Build digital confidence in a 100% safe sandbox, in English or Urdu." },
    ],
  }),
  component: Dashboard,
});
