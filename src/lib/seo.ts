import siteConfig from "../../site.config.json";

export type SeoPage = {
  title: string;
  description: string;
  path: string;
};

export const SEO_PAGES = {
  home: {
    title: "Dariyapur Shiv Mandir Kanti | Official Temple Website",
    description:
      "Official website of Dariyapur Shiv Mandir Kanti. Explore temple history, festivals, devotional music, gallery, seva opportunities, visitor information, temple location, and community updates.",
    path: "/",
  },
  about: {
    title: "About Dariyapur Shiv Mandir Kanti",
    description:
      "Learn about the history, spiritual significance, traditions, and community activities of Dariyapur Shiv Mandir Kanti.",
    path: "/about",
  },
  gallery: {
    title: "Temple Gallery | Dariyapur Shiv Mandir Kanti",
    description:
      "Explore photos of temple festivals, celebrations, rituals, and sacred moments from Dariyapur Shiv Mandir Kanti.",
    path: "/gallery",
  },
  sangeet: {
    title: "Shiv Bhajans & Sangeet | Dariyapur Shiv Mandir Kanti",
    description:
      "Listen to devotional Shiv bhajans, temple sangeet, and spiritual music shared by Dariyapur Shiv Mandir Kanti.",
    path: "/sangeet",
  },
  seva: {
    title: "Temple Seva | Dariyapur Shiv Mandir Kanti",
    description:
      "Learn about seva opportunities and ways to contribute to temple activities and community service.",
    path: "/seva",
  },
  visitorInformation: {
    title: "Visitor Information | Dariyapur Shiv Mandir Kanti",
    description:
      "Plan your visit to Dariyapur Shiv Mandir Kanti with temple information, guidelines, and visitor details.",
    path: "/visitor-information",
  },
  location: {
    title: "Temple Location | Dariyapur Shiv Mandir Kanti",
    description:
      "Find the location of Dariyapur Shiv Mandir Kanti and get directions for your temple visit.",
    path: "/location",
  },
  contact: {
    title: "Contact Us | Dariyapur Shiv Mandir Kanti",
    description:
      "Contact Dariyapur Shiv Mandir Kanti for temple inquiries, events, seva information, and community support.",
    path: "/contact",
  },
} satisfies Record<string, SeoPage>;

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl() {
  return normalizeSiteUrl(siteConfig.url);
}

export function absoluteUrl(path: string) {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function createSeoHead(page: SeoPage) {
  const canonicalUrl = absoluteUrl(page.path);
  const imageUrl = absoluteUrl(siteConfig.image);

  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:image", content: imageUrl },
      { property: "og:image:alt", content: "Dariyapur Shiv Mandir Kanti" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteConfig.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: page.description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: "Dariyapur Shiv Mandir Kanti" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(createStructuredData(page, canonicalUrl, imageUrl)),
      },
    ],
  };
}

function createStructuredData(page: SeoPage, canonicalUrl: string, imageUrl: string) {
  const siteUrl = getSiteUrl();
  const organizationId = `${siteUrl}/#organization`;
  const templeId = `${siteUrl}/#temple`;
  const address = {
    "@type": "PostalAddress",
    ...siteConfig.address,
  };
  const geo = {
    "@type": "GeoCoordinates",
    ...siteConfig.geo,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        url: siteUrl,
        logo: absoluteUrl(siteConfig.logo),
        email: siteConfig.email,
        sameAs: siteConfig.social,
        location: { "@id": templeId },
      },
      {
        "@type": ["HinduTemple", "Place"],
        "@id": templeId,
        name: siteConfig.name,
        alternateName: [siteConfig.alternateName, "Shiv Mandir Kanti", "Shiv Temple Kanti"],
        description: siteConfig.description,
        url: siteUrl,
        image: imageUrl,
        address,
        geo,
        email: siteConfig.email,
        openingHours: "Mo-Su 07:00-20:00",
        sameAs: siteConfig.social,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": templeId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
        },
      },
    ],
  };
}
