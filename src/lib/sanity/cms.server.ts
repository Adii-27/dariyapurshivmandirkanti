import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { getServerConfig } from "@/lib/config.server";
import { generateHinduFestivals } from "@/lib/hindu-festivals";
import type { GalleryCategory, TemplePhoto, TempleVideo, VideoCategory } from "@/lib/media";
import type { FestivalUpdate, TempleUpdate, TempleUpdateCategory } from "@/lib/updates";
import type { CmsContent } from "./types";

const API_VERSION = "2025-02-19";
const QUERY_TIMEOUT_MS = 8_000;
const CMS_CACHE_TTL_MS = 10_000;

type SanityImage = {
  asset?: { _ref?: string };
  crop?: Record<string, number>;
  hotspot?: Record<string, number>;
  alt?: string;
};

type RawGalleryItem = {
  _id: string;
  title?: string;
  image?: SanityImage;
  categories?: string[];
  description?: string;
  date?: string;
  featured?: boolean;
};

type RawTempleVideo = {
  _id: string;
  title?: string;
  videoUrl?: string;
  thumbnail?: SanityImage;
  category?: string;
  description?: string;
  date?: string;
  featured?: boolean;
};

type RawCommunityPost = {
  _id: string;
  title?: string;
  featuredImage?: SanityImage;
  summary?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  featured?: boolean;
  _updatedAt: string;
};

type RawTempleNotice = {
  _id: string;
  title?: string;
  noticeContent?: string;
  date?: string;
  featured?: boolean;
  _updatedAt: string;
};

type RawCmsResponse = {
  gallery: RawGalleryItem[];
  videos: RawTempleVideo[];
  communityPosts: RawCommunityPost[];
  notices: RawTempleNotice[];
};

const CMS_QUERY = `{
  "gallery": *[_type == "galleryItem"] | order(featured desc, date desc)[0...100] {
    _id,
    "title": coalesce(title, image.alt, image.asset->originalFilename, "Temple Photo"),
    image,
    "categories": coalesce(categories, [category]),
    description,
    "date": coalesce(date, _createdAt),
    featured
  },
  "videos": *[_type == "templeVideo"] | order(featured desc, date desc)[0...60] {
    _id, title, videoUrl, thumbnail, category,
    "description": coalesce(description, title),
    "date": coalesce(date, _createdAt),
    featured
  },
  "communityPosts": *[
    _type == "communityPost" &&
    coalesce(published, true) == true &&
    coalesce(date, _createdAt) <= now()
  ] | order(date desc)[0...40] {
    _id, _updatedAt, title, featuredImage, "summary": pt::text(content),
    "date": coalesce(date, _createdAt),
    startDate, endDate,
    featured
  },
  "notices": *[
    _type == "templeNotice" &&
    coalesce(published, true) == true &&
    coalesce(date, _createdAt) <= now()
  ] | order(date desc)[0...40] {
    _id, _updatedAt, title, noticeContent,
    "date": coalesce(date, _createdAt),
    featured
  }
}`;

const galleryCategoryMap: Record<string, GalleryCategory> = {
  day: "Day",
  evening: "Evening",
  night: "Night",
  exterior: "Exterior",
  interior: "Interior",
  festivals: "Festivals",
};

const videoCategoryMap: Record<string, VideoCategory> = {
  introduction: "Temple Introduction",
  highlights: "Highlights",
  "festivals-events": "Festivals & Events Activities",
};

let cachedCmsContent: CmsContent | null = null;
let cmsCacheExpiresAt = 0;
let pendingCmsRequest: Promise<CmsContent | null> | undefined;

function getYouTubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    let videoId = "";

    if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1).split("/")[0] ?? "";
    } else if (url.hostname.endsWith("youtube.com")) {
      videoId =
        url.searchParams.get("v") ??
        (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")
          ? (url.pathname.split("/")[2] ?? "")
          : "");
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : undefined;
  } catch {
    return undefined;
  }
}

function normalizeSummary(value?: string, fallback = "") {
  const summary = normalizeContent(value, fallback);
  return summary.length > 240 ? `${summary.slice(0, 237).trimEnd()}...` : summary;
}

function normalizeContent(value?: string, fallback = "") {
  return value?.replace(/\s+/g, " ").trim() || fallback;
}

function sortUpdates(updates: TempleUpdate[]) {
  return updates.sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

function toUpdate({
  id,
  title,
  publishedAt,
  changedAt,
  summary,
  category,
  featured,
  image,
  startDate,
  endDate,
}: {
  id: string;
  title?: string;
  publishedAt?: string;
  changedAt: string;
  summary?: string;
  category: TempleUpdateCategory;
  featured?: boolean;
  image?: string;
  startDate?: string;
  endDate?: string;
}): TempleUpdate | null {
  if (!title || !publishedAt) return null;
  return {
    id,
    title,
    publishedAt,
    changedAt,
    summary: normalizeSummary(summary),
    content: normalizeContent(summary),
    category,
    featured: Boolean(featured),
    image,
    startDate,
    endDate,
  };
}

async function fetchCmsContentFromSanity(): Promise<CmsContent | null> {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID?.trim();
  const dataset = import.meta.env.VITE_SANITY_DATASET?.trim() || "production";

  const festivals = generateHinduFestivals();
  if (!projectId) return { gallery: [], videos: [], festivals, updates: [] };

  const serverConfig = getServerConfig();
  const token = serverConfig.sanityReadToken;
  const client = createClient({
    projectId,
    dataset,
    apiVersion: API_VERSION,
    perspective: "published",
    useCdn: false,
    token,
  });
  const imageBuilder = createImageUrlBuilder(client);
  const imageUrl = (image?: SanityImage, width = 1600) =>
    image?.asset?._ref
      ? imageBuilder.image(image).width(width).fit("max").auto("format").url()
      : undefined;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Sanity query timed out")), QUERY_TIMEOUT_MS);
  });

  try {
    const raw = await Promise.race([client.fetch<RawCmsResponse>(CMS_QUERY), timeout]);

    const gallery = raw.gallery
      .map((item): TemplePhoto | null => {
        const src = imageUrl(item.image);
        const categories = (item.categories ?? [])
          .map((category) => galleryCategoryMap[category])
          .filter((category): category is GalleryCategory => Boolean(category));
        if (!src || categories.length === 0) return null;

        return {
          id: item._id,
          src,
          caption: item.title || "Temple Photo",
          hindi: "",
          categories,
          description: item.description,
          date: item.date,
          featured: Boolean(item.featured),
        };
      })
      .filter((item): item is TemplePhoto => Boolean(item));

    const videos = raw.videos
      .map((item): TempleVideo | null => {
        const category = item.category ? videoCategoryMap[item.category] : undefined;
        if (!item.title || !item.videoUrl || !category) return null;

        return {
          id: item._id,
          src: item.videoUrl,
          embedUrl: getYouTubeEmbedUrl(item.videoUrl),
          poster: imageUrl(item.thumbnail, 1200),
          title: item.title,
          hindi: "",
          description: item.description || item.title,
          category,
          date: item.date,
          featured: Boolean(item.featured),
        };
      })
      .filter((item): item is TempleVideo => Boolean(item));

    const updates = sortUpdates([
      ...raw.communityPosts
        .map((post) =>
          toUpdate({
            id: post._id,
            title: post.title,
            publishedAt: post.date,
            changedAt: post._updatedAt,
            summary: post.summary,
            category: "Community Post",
            featured: post.featured,
            image: imageUrl(post.featuredImage, 1200),
            startDate: post.startDate,
            endDate: post.endDate,
          }),
        )
        .filter((update): update is TempleUpdate => Boolean(update)),
      ...raw.notices
        .map((notice) =>
          toUpdate({
            id: notice._id,
            title: notice.title,
            publishedAt: notice.date,
            changedAt: notice._updatedAt,
            summary: notice.noticeContent,
            category: "Temple Notice",
            featured: notice.featured,
          }),
        )
        .filter((update): update is TempleUpdate => Boolean(update)),
    ]);

    return { gallery, videos, festivals, updates };
  } catch {
    return null;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function getCmsContentFromSanity(): Promise<CmsContent | null> {
  const now = Date.now();
  if (cachedCmsContent && now < cmsCacheExpiresAt) return cachedCmsContent;

  if (!pendingCmsRequest) {
    pendingCmsRequest = fetchCmsContentFromSanity();
  }
  const request = pendingCmsRequest;

  try {
    const content = await request;
    if (content) {
      cachedCmsContent = content;
      cmsCacheExpiresAt = Date.now() + CMS_CACHE_TTL_MS;
    }
    return content ?? cachedCmsContent;
  } finally {
    if (pendingCmsRequest === request) pendingCmsRequest = undefined;
  }
}
