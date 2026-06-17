import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { NetworkStatusNotifier } from "@/components/site/NetworkStatusNotifier";
import { Toaster } from "@/components/ui/sonner";
import { getGoogleAnalyticsHeadScripts, trackGoogleAnalyticsPageView } from "@/lib/analytics";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-saffron">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">पृष्ठ नहीं मिला</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md gradient-saffron px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sacred"
          >
            मंदिर वापस जाएं
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Please try refreshing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md gradient-saffron px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-input bg-background px-4 py-2 text-sm">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Dariyapur Shiv Mandir Kanti" },
      { name: "theme-color", content: "#c2410c" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Tiro+Devanagari+Hindi&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: getGoogleAnalyticsHeadScripts(),
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleAnalyticsRouteTracker />
      <NetworkStatusNotifier />
      <main>
        <Outlet />
      </main>
      <Toaster position="top-right" gap={10} offset={16} mobileOffset={12} visibleToasts={2} />
    </QueryClientProvider>
  );
}

function GoogleAnalyticsRouteTracker() {
  const href = useRouterState({ select: (state) => state.location.href });
  const previousHref = useRef(href);

  useEffect(() => {
    if (previousHref.current === href) {
      return;
    }

    previousHref.current = href;
    trackGoogleAnalyticsPageView(href);
  }, [href]);

  return null;
}
