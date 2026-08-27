import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCmsContent } from "@/lib/api/cms.functions";
import type { CmsContent } from "@/lib/sanity/types";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { fetchWikimediaCollection, type WikimediaFile } from "@/lib/wikimedia/commons";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { HeritageHero } from "@/components/site/heritage/HeritageHero";
import { TempleFacts } from "@/components/site/heritage/TempleFacts";
import { WikimediaSection } from "@/components/site/heritage/WikimediaSection";

const CMS_STALE_TIME_MS = 5 * 60_000;
const WIKIMEDIA_STALE_TIME_MS = 5 * 60_000;

async function fetchLatestCmsContent(): Promise<CmsContent> {
  const content = await getCmsContent();
  if (!content) throw new Error("CMS content is temporarily unavailable");
  return content;
}

export const Route = createFileRoute("/heritage")({
  loader: () => getCmsContent(),
  head: () => createSeoHead(SEO_PAGES.heritage),
  component: HeritagePage,
});

function HeritagePage() {
  const initialCms = Route.useLoaderData();

  const { data: refreshedCms } = useQuery({
    queryKey: ["cms-content"],
    queryFn: fetchLatestCmsContent,
    initialData: initialCms ?? undefined,
    staleTime: CMS_STALE_TIME_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });

  const cms = refreshedCms ?? initialCms;
  const updates = cms?.updates ?? [];

  const {
    data: files = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<WikimediaFile[]>({
    queryKey: ["wikimedia-collection"],
    queryFn: ({ signal }) => fetchWikimediaCollection({ signal }),
    staleTime: WIKIMEDIA_STALE_TIME_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });

  return (
    <div className="min-h-dvh bg-background">
      <Navbar updateChanges={updates.map((u) => u.changedAt)} />
      <main>
        <HeritageHero />
        <TempleFacts />
        <WikimediaSection
          files={files}
          isLoading={isLoading}
          isError={isError}
          refetch={() => void refetch()}
        />
      </main>
      <Footer />
    </div>
  );
}
