import { createFileRoute } from "@tanstack/react-router";
import { getCmsContent } from "@/lib/api/cms.functions";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { HomePage } from "./index";

export const Route = createFileRoute("/contact")({
  loader: () => getCmsContent(),
  head: () => createSeoHead(SEO_PAGES.contact),
  component: ContactPage,
});

function ContactPage() {
  return <HomePage initialCms={Route.useLoaderData()} sectionId="contact" />;
}
