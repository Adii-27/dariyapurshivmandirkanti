import { createFileRoute } from "@tanstack/react-router";
import { getCmsContent } from "@/lib/api/cms.functions";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { HomePage } from "./index";

export const Route = createFileRoute("/visitor-information")({
  loader: () => getCmsContent(),
  head: () => createSeoHead(SEO_PAGES.visitorInformation),
  component: VisitorInformationPage,
});

function VisitorInformationPage() {
  return <HomePage initialCms={Route.useLoaderData()} sectionId="visit" />;
}
