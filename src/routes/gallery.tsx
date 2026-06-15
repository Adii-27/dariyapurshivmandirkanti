import { createFileRoute } from "@tanstack/react-router";
import { getCmsContent } from "@/lib/api/cms.functions";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { HomePage } from "./index";

export const Route = createFileRoute("/gallery")({
  loader: () => getCmsContent(),
  head: () => createSeoHead(SEO_PAGES.gallery),
  component: GalleryPage,
});

function GalleryPage() {
  return <HomePage initialCms={Route.useLoaderData()} sectionId="gallery" />;
}
