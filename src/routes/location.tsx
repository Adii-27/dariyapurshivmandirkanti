import { createFileRoute } from "@tanstack/react-router";
import { getCmsContent } from "@/lib/api/cms.functions";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { HomePage } from "./index";

export const Route = createFileRoute("/location")({
  loader: () => getCmsContent(),
  head: () => createSeoHead(SEO_PAGES.location),
  component: LocationPage,
});

function LocationPage() {
  return <HomePage initialCms={Route.useLoaderData()} sectionId="location" />;
}
