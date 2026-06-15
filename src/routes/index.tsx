import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCmsContent } from "@/lib/api/cms.functions";
import type { CmsContent } from "@/lib/sanity/types";
import { TEMPLE_PHOTOS } from "@/lib/media";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Welcome } from "@/components/site/Welcome";
import { About } from "@/components/site/About";
import { Updates } from "@/components/site/Updates";
import { Festivals } from "@/components/site/Festivals";
import { Gallery } from "@/components/site/Gallery";
import { Videos } from "@/components/site/Videos";
import { VirtualDarshan } from "@/components/site/VirtualDarshan";
import { Seva } from "@/components/site/Seva";
import { Visit } from "@/components/site/Visit";
import { Contact, Location } from "@/components/site/Location";
import { Footer } from "@/components/site/Footer";

const CMS_STALE_TIME_MS = 10_000;
const CMS_REFETCH_INTERVAL_MS = 20_000;

async function fetchLatestCmsContent(): Promise<CmsContent> {
  const content = await getCmsContent();
  if (!content) throw new Error("CMS content is temporarily unavailable");
  return content;
}

export const Route = createFileRoute("/")({
  loader: () => getCmsContent(),
  head: () => createSeoHead(SEO_PAGES.home),
  component: Home,
});

function Home() {
  return <HomePage initialCms={Route.useLoaderData()} />;
}

export function HomePage({
  initialCms,
  sectionId,
}: {
  initialCms: CmsContent | null;
  sectionId?: string;
}) {
  const { data: refreshedCms } = useQuery({
    queryKey: ["cms-content"],
    queryFn: fetchLatestCmsContent,
    initialData: initialCms ?? undefined,
    staleTime: CMS_STALE_TIME_MS,
    refetchInterval: CMS_REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
  const cms = refreshedCms ?? initialCms;
  const gallery = mergeContent(cms?.gallery, TEMPLE_PHOTOS, (photo) => photo.src);
  const videos = cms?.videos ?? [];
  const introductionVideo =
    videos.find((video) => video.category === "Temple Introduction" && video.featured) ??
    videos.find((video) => video.category === "Temple Introduction");
  const festivals = cms?.festivals ?? [];
  const updates = cms?.updates ?? [];

  useEffect(() => {
    if (!sectionId) return;
    document.getElementById(sectionId)?.scrollIntoView();
  }, [sectionId]);

  return (
    <div className="min-h-dvh">
      <Navbar updateChanges={updates.map((update) => update.changedAt)} />
      <Hero />
      <Welcome introductionVideo={introductionVideo} />
      <About />
      <Updates updates={updates} />
      <Festivals festivals={festivals} />
      <Gallery photos={gallery} />
      <Videos videos={videos} />
      <VirtualDarshan />
      <Seva />
      <Visit />
      <Location />
      <Contact />
      <Footer />
    </div>
  );
}

function mergeContent<T>(cmsItems: T[] | undefined, localItems: T[], getKey: (item: T) => string) {
  if (!cmsItems?.length) return localItems;

  const keys = new Set(cmsItems.map(getKey));
  return [...cmsItems, ...localItems.filter((item) => !keys.has(getKey(item)))];
}
