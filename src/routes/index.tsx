import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/home-page";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: pageMeta.home.title },
      { name: "description", content: pageMeta.home.description },
    ],
  }),
  component: HomePage,
});
