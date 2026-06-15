import { createFileRoute } from "@tanstack/react-router";
import { getCmsContent } from "@/lib/api/cms.functions";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { HomePage } from "./index";

export const Route = createFileRoute("/about")({
  loader: () => getCmsContent(),
  head: () => createSeoHead(SEO_PAGES.about),
  component: AboutPage,
});

function AboutPage() {
  return <HomePage initialCms={Route.useLoaderData()} sectionId="about" />;
}
