import { createFileRoute } from "@tanstack/react-router";
import { getCmsContent } from "@/lib/api/cms.functions";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { HomePage } from "./index";

export const Route = createFileRoute("/seva")({
  loader: () => getCmsContent(),
  head: () => createSeoHead(SEO_PAGES.seva),
  component: SevaPage,
});

function SevaPage() {
  return <HomePage initialCms={Route.useLoaderData()} sectionId="seva" />;
}
