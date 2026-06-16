export const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-SMNNW60YXK";

export const isGoogleAnalyticsEnabled = import.meta.env.PROD;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGoogleAnalyticsHeadScripts() {
  if (!isGoogleAnalyticsEnabled) {
    return [];
  }

  return [
    {
      async: true,
      src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`,
    },
    {
      // Initialize GA4 in the document head so the production page load records
      // the first page view before TanStack Router handles client navigation.
      children: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_MEASUREMENT_ID}');
      `.trim(),
    },
  ];
}

export function trackGoogleAnalyticsPageView(path: string) {
  if (!isGoogleAnalyticsEnabled || typeof window === "undefined" || !window.gtag) {
    return;
  }

  // TanStack Router performs client-side navigation, so send GA4 page_view
  // events manually after the initial gtag config page view has loaded.
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
