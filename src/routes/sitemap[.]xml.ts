import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { absoluteUrl, SEO_PAGES } from "@/lib/seo";

const sitemapPages = Object.values(SEO_PAGES);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...sitemapPages.map((page) => `  <url><loc>${absoluteUrl(page.path)}</loc></url>`),
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
