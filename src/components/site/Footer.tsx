import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BellOff,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Download,
  Info,
  Link2,
  Loader2,
  MapPin,
  Play,
  Smartphone,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { TEMPLE_LOGO } from "@/lib/media";
import {
  base64UrlToUint8Array,
  canUseWebPush,
  dispatchNotificationStateChange,
  isStandalonePwa,
  NOTIFICATION_STATE_CHANGED_EVENT,
  REQUEST_INSTALL_EVENT,
} from "@/lib/push";

const VISITOR_COUNTER_URL = "/api/visitors";
const VISITOR_SESSION_KEY = "dsmk-visitor-counted";
const VISITOR_CACHE_KEY = "dsmk-visitor-count-cache";
const VISITOR_CACHE_TTL_MS = 30 * 60 * 1000;
const VISITOR_FETCH_TIMEOUT_MS = 8000;
const VISITOR_RETRY_DELAY_MS = 700;

let visitorCountRequest: Promise<number> | null = null;

type CachedVisitorCount = {
  count: number;
  savedAt: number;
};

function extractCounterValue(payload: unknown): number | null {
  if (typeof payload === "number" && Number.isFinite(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  for (const key of ["value", "count", "up_count"]) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }

  return extractCounterValue(record.data);
}

function getCachedVisitorCount(): CachedVisitorCount | null {
  try {
    const raw = window.localStorage.getItem(VISITOR_CACHE_KEY);
    if (!raw) return null;

    const cache = JSON.parse(raw) as Partial<CachedVisitorCount>;
    if (
      typeof cache.count !== "number" ||
      !Number.isFinite(cache.count) ||
      typeof cache.savedAt !== "number" ||
      !Number.isFinite(cache.savedAt)
    ) {
      return null;
    }

    return { count: cache.count, savedAt: cache.savedAt };
  } catch {
    return null;
  }
}

function cacheVisitorCount(count: number) {
  const cache: CachedVisitorCount = { count, savedAt: Date.now() };

  try {
    window.localStorage.setItem(VISITOR_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // A blocked storage write should not make the visible counter fail.
  }
}

function hasCountedThisSession() {
  try {
    return window.sessionStorage.getItem(VISITOR_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function markCountedThisSession() {
  try {
    window.sessionStorage.setItem(VISITOR_SESSION_KEY, "true");
  } catch {
    // The remote count still succeeded even if session storage is blocked.
  }
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function fetchCounterValue(url: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), VISITOR_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) throw new Error("Visitor counter request failed");

    const count = extractCounterValue((await response.json()) as unknown);
    if (count === null) throw new Error("Visitor counter returned an invalid value");

    return count;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function fetchCounterValueWithRetry(url: string) {
  try {
    return await fetchCounterValue(url);
  } catch (error) {
    await wait(VISITOR_RETRY_DELAY_MS);
    return fetchCounterValue(url).catch(() => {
      throw error;
    });
  }
}

function loadVisitorCount() {
  if (visitorCountRequest) return visitorCountRequest;

  visitorCountRequest = (async () => {
    const cached = getCachedVisitorCount();
    const shouldIncrement = !hasCountedThisSession();
    const hasFreshCache = cached !== null && Date.now() - cached.savedAt < VISITOR_CACHE_TTL_MS;

    if (!shouldIncrement && hasFreshCache) {
      return cached.count;
    }

    try {
      const count = await fetchCounterValueWithRetry(
        shouldIncrement ? `${VISITOR_COUNTER_URL}?inc=1` : VISITOR_COUNTER_URL,
      );
      cacheVisitorCount(count);
      if (shouldIncrement) markCountedThisSession();
      return count;
    } catch (error) {
      if (cached !== null) return cached.count;
      throw error;
    }
  })().catch((error: unknown) => {
    visitorCountRequest = null;
    throw error;
  });

  return visitorCountRequest;
}

const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YouTubeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

const LotusIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M32 6 C28 16 26 28 32 40 C38 28 36 16 32 6 Z" />
    <path d="M32 18 C22 22 14 30 18 40 C24 38 29 34 32 28" />
    <path d="M32 18 C42 22 50 30 46 40 C40 38 35 34 32 28" />
    <path d="M22 26 C12 28 4 34 8 42 C16 42 24 38 28 34" />
    <path d="M42 26 C52 28 60 34 56 42 C48 42 40 38 36 34" />
    <path d="M12 42 C24 46 40 46 52 42" />
  </svg>
);

const quickLinks = [
  ["/#home", "Home"],
  ["/#about", "About"],
  ["/heritage", "Heritage"],
  ["/#gallery", "Gallery"],
  ["/sangeet", "Sangeet"],
  ["/#seva", "Seva"],
  ["/#visit", "Visitor Information"],
  ["/#location", "Location"],
  ["/faq", "FAQ"],
  ["/#contact", "Contact Us"],
  ["/#updates", "Updates"],
] as const;

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-[#18110b] text-cream/85 border-t border-gold-soft/25">
      {/* Subtle sacred ambient light */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-soft/50 to-transparent" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-saffron/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold-soft/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1fr_1.15fr] lg:gap-12">
          {/* COLUMN 1: Temple Identity & Action Cards */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={TEMPLE_LOGO}
                  alt="Dariyapur Shiv Mandir Kanti logo"
                  className="h-14 w-14 rounded-full ring-1 ring-gold-soft/30 object-cover shrink-0"
                />
                <div>
                  <div className="font-display text-xl font-semibold text-cream">
                    Dariyapur Shiv Mandir
                  </div>
                  <div className="font-hindi text-sm text-gold-soft">दरियापुर शिव मंदिर कांटी</div>
                </div>
              </div>

              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-soft/90">
                ESTABLISHED • 1962
              </p>

              <p className="mt-3 max-w-sm text-xs sm:text-sm leading-relaxed text-cream/75">
                A sacred centre of Lord Shiva devotion in Kanti, serving devotees with faith,
                compassion and community for over six decades.
              </p>

              <p className="font-hindi mt-3 text-base font-semibold text-gold-soft">
                ॐ नमः शिवाय
              </p>

              {/* Clean Subtle Horizontal Divider */}
              <div className="my-4 max-w-sm h-px bg-gold-soft/20" />
            </div>

            {/* TEMPLE NOTIFICATIONS PREFERENCE CARD */}
            <NotificationPreferenceCard />

            {/* INSTALL APP CARD */}
            <InstallAppCard />
          </div>

          {/* COLUMN 2: Quick Links */}
          <div>
            <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gold-soft">
              <Link2 className="h-3.5 w-3.5 text-gold-soft" />
              QUICK LINKS
            </h4>
            <ul className="mt-5 space-y-0 text-sm">
              {quickLinks.map(([href, label]) => (
                <li key={href} className="border-b border-cream/10 last:border-b-0">
                  <a
                    href={href}
                    className="group flex items-center justify-between py-2.5 text-xs sm:text-sm text-cream/75 transition-colors duration-200 hover:text-gold-soft"
                  >
                    <span>{label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gold-soft/70 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gold-soft" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Visit Information */}
          <div className="space-y-6">
            <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gold-soft">
              <MapPin className="h-3.5 w-3.5 text-gold-soft" />
              VISIT
            </h4>

            {/* Opening Hours */}
            <div>
              <div className="text-xs text-cream/70">Open Daily</div>
              <div className="mt-0.5 text-base font-semibold text-gold-soft">
                7:00 AM – 8:00 PM
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              <address className="not-italic text-xs sm:text-sm leading-relaxed text-cream/75">
                <span className="block font-medium text-cream/90">Dariyapur Shiv Mandir Kanti</span>
                <span className="block">Near Paswan Chowk</span>
                <span className="block">Dariyapur, Kanti</span>
                <span className="block">Muzaffarpur, Bihar</span>
                <span className="block">India - 843113</span>
              </address>
            </div>

            {/* Google Maps Button */}
            <div>
              <a
                href="https://maps.app.goo.gl/AwKW2occqHKrJVA9A"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-soft/40 bg-[#221811]/90 px-4 py-2 text-xs font-semibold text-gold-soft shadow-sm transition-all hover:border-gold-soft hover:bg-gold-soft/15 hover:scale-[1.02]"
              >
                <MapPin className="h-3.5 w-3.5 text-gold-soft" />
                View on Google Maps →
              </a>
            </div>

            {/* Daily Darshan */}
            <div className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              <div>
                <div className="text-xs sm:text-sm font-semibold text-cream/90">Daily Darshan</div>
                <div className="mt-0.5 text-xs sm:text-sm text-gold-soft">7:00 AM – 8:00 PM</div>
              </div>
            </div>

            {/* Special Aarti */}
            <div className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              <div>
                <div className="text-xs sm:text-sm font-semibold text-cream/90">Special Aarti</div>
                <div className="mt-0.5 text-xs sm:text-sm text-gold-soft">7:00 AM &amp; 7:00 PM</div>
              </div>
            </div>
          </div>

          {/* COLUMN 4: Connect With Us, Social, Visitor Counter & Benediction */}
          <div className="space-y-5">
            <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gold-soft">
              <Users className="h-4 w-4 text-gold-soft" />
              CONNECT WITH US
            </h4>

            {/* Social Icons Row (Instagram, Facebook, YouTube only) */}
            <div className="flex items-center gap-3.5">
              <motion.a
                href="https://www.instagram.com/dariyapurshivmandirkanti"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-gold-soft"
              >
                <InstagramIcon className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/share/1PK9TGw3UY/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#1877f2] text-white shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-gold-soft"
              >
                <FacebookIcon className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://youtube.com/@dariyapurshivmandirkanti"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#ff0000] text-white shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-gold-soft"
              >
                <YouTubeIcon className="h-4 w-4" />
              </motion.a>
            </div>

            {/* YouTube CTA */}
            <div>
              <a
                href="https://youtube.com/@dariyapurshivmandirkanti"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cream/90 transition-colors hover:text-gold-soft"
              >
                <Play className="h-3 w-3 fill-gold-soft text-gold-soft" />
                <span>Visit Our YouTube Channel</span>
              </a>
            </div>

            {/* Live Visitor Counter */}
            <VisitorCounter />

            {/* Devotional Lotus & Benediction Note */}
            <div className="pt-2 text-center">
              <div className="flex justify-center text-gold-soft/80">
                <LotusIcon className="h-10 w-14" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-cream/70 max-w-[260px] mx-auto">
                Thank you for visiting our official website. May Lord Shiva bless you and your family
                with peace, health and prosperity.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT ROW */}
        <div className="mt-14 border-t border-gold-soft/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-cream/60 sm:flex-row sm:text-left">
            <div>
              <p>© Dariyapur Shiv Mandir Kanti. All Rights Reserved.</p>
              <p className="mt-0.5 text-cream/50">Established 1962.</p>
            </div>

            <div className="font-hindi text-sm sm:text-base font-semibold text-gold-soft">
              ॐ नमः पार्वती पतये हर हर महादेव
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * TEMPLE NOTIFICATIONS PREFERENCE CARD
 * Fully synchronized with browser push status and PushSubscription
 */
function NotificationPreferenceCard() {
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canUseWebPush()) {
      setSupported(false);
      return;
    }

    let isMounted = true;

    const syncSubscriptionState = () => {
      if (!canUseWebPush()) {
        if (isMounted) setSupported(false);
        return;
      }

      if (typeof Notification !== "undefined") {
        if (isMounted) setPermission(Notification.permission);
      }

      if (typeof navigator !== "undefined" && "serviceWorker" in navigator && navigator.serviceWorker) {
        navigator.serviceWorker.ready
          .then((reg) => reg.pushManager.getSubscription())
          .then((sub) => {
            if (isMounted) {
              setSubscribed(Boolean(sub) && Notification.permission === "granted");
            }
          })
          .catch(() => {
            if (isMounted) setSubscribed(false);
          });
      }
    };

    // Initial check on mount
    syncSubscriptionState();

    // Listen for shared state changes across components
    const onStateChange = () => {
      syncSubscriptionState();
    };

    const onVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        syncSubscriptionState();
      }
    };

    window.addEventListener(NOTIFICATION_STATE_CHANGED_EVENT, onStateChange);
    window.addEventListener("focus", onVisibilityOrFocus);
    document.addEventListener("visibilitychange", onVisibilityOrFocus);

    return () => {
      isMounted = false;
      window.removeEventListener(NOTIFICATION_STATE_CHANGED_EVENT, onStateChange);
      window.removeEventListener("focus", onVisibilityOrFocus);
      document.removeEventListener("visibilitychange", onVisibilityOrFocus);
    };
  }, []);

  const toggleSubscription = async () => {
    if (!supported || loading) return;

    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const existingSub = await reg.pushManager.getSubscription();

      if (subscribed && existingSub) {
        // Unsubscribe flow
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: existingSub.endpoint }),
        }).catch(() => null);

        await existingSub.unsubscribe().catch(() => null);
        setSubscribed(false);
        dispatchNotificationStateChange(false);
        toast.info("Notifications turned off");
      } else {
        // Subscribe flow
        const perm = await Notification.requestPermission();
        setPermission(perm);

        if (perm === "granted") {
          let newSub = existingSub;
          if (!newSub) {
            newSub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: base64UrlToUint8Array(
                import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY,
              ),
            });
          }

          const res = await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSub.toJSON()),
          });

          if (!res.ok) throw new Error("Failed to register subscription");

          setSubscribed(true);
          dispatchNotificationStateChange(true);
          toast.success("🕉️ Subscribed to Temple Notifications");
        } else if (perm === "denied") {
          toast.error("Notifications are blocked in your browser settings.");
        }
      }
    } catch {
      toast.error("Could not update notification settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gold-soft/30 bg-[#221811]/90 p-4 shadow-sm backdrop-blur-md">
      {/* Card Header: Bell Icon & Text */}
      <div className="flex items-start gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-sm transition-all duration-200 ${
            subscribed
              ? "bg-gradient-to-br from-amber-500/25 to-amber-700/35 text-gold-soft ring-1 ring-gold-soft/40"
              : permission === "denied"
                ? "bg-rose-950/40 text-rose-400 ring-1 ring-rose-500/40"
                : "bg-cream/10 text-cream/60 ring-1 ring-cream/20"
          }`}
        >
          {subscribed ? (
            <Bell className="h-5 w-5 text-gold-soft transition-transform duration-200" />
          ) : (
            <BellOff
              className={`h-5 w-5 transition-transform duration-200 ${
                permission === "denied" ? "text-rose-400" : "text-cream/60"
              }`}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h5 className="font-display text-xs font-bold uppercase tracking-wider text-gold-soft">
            TEMPLE NOTIFICATIONS
          </h5>
          <p className="mt-1 text-[11px] leading-relaxed text-cream/70">
            Stay updated with important temple notices, festival reminders and special
            announcements.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-cream/10" />

      {/* Preference Control Row */}
      {!supported ? (
        <div className="text-[11px] text-cream/50">
          Notifications unavailable on this device/browser.
        </div>
      ) : permission === "denied" ? (
        <div className="space-y-1.5 text-[11px] text-rose-300">
          <div className="flex items-center gap-1.5 font-semibold">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Notifications Blocked
          </div>
          <p className="text-[10.5px] text-cream/60">
            Please enable notifications in your browser's site settings to receive temple alerts.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-cream">Notifications</span>

            {/* Accessible Toggle Button matching mockup */}
            <button
              type="button"
              role="switch"
              aria-checked={subscribed}
              aria-label="Toggle Temple Notifications"
              disabled={loading}
              onClick={toggleSubscription}
              className={`interactive-surface relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold-soft disabled:opacity-60 ${
                subscribed
                  ? "bg-[#e65c00] justify-end shadow-sacred"
                  : "bg-cream/20 justify-start"
              }`}
            >
              {/* Knob */}
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full bg-cream text-[10px] font-bold shadow-md transition-transform duration-200 ${
                  subscribed ? "text-[#e65c00]" : "text-ink/60"
                }`}
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-[#e65c00]" />
                ) : subscribed ? (
                  "ON"
                ) : (
                  "OFF"
                )}
              </span>
            </button>
          </div>

          {/* Subscribed Status confirmation */}
          {subscribed && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[2.5]" />
              <span>You are subscribed to notifications</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * INSTALL APP CARD
 * Reuses existing PWA installation state and beforeinstallprompt mechanism
 */
function InstallAppCard() {
  const [installed, setInstalled] = useState(false);
  const [working, setWorking] = useState(false);
  const deferredPromptRef = useRef<{ prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null>(null);

  useEffect(() => {
    setInstalled(isStandalonePwa());

    const onAppInstalled = () => {
      setInstalled(true);
    };

    const onBeforeInstallPrompt = (event: Event) => {
      deferredPromptRef.current = event as unknown as { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
    };

    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (installed) return;

    if (deferredPromptRef.current) {
      setWorking(true);
      try {
        await deferredPromptRef.current.prompt();
        const choice = await deferredPromptRef.current.userChoice;
        if (choice.outcome === "accepted") {
          setInstalled(true);
          toast.success("Temple app installation started");
        }
      } catch {
        // Handled gracefully
      } finally {
        setWorking(false);
      }
      return;
    }

    // Trigger standard global install request event for PWA prompt
    window.dispatchEvent(new Event(REQUEST_INSTALL_EVENT));

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    if (isIos) {
      toast.info("To install: tap the Share button in Safari and select 'Add to Home Screen'.");
    } else {
      toast.info("Follow your browser's prompt to install the temple app.");
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gold-soft/30 bg-[#221811]/90 p-4 shadow-sm backdrop-blur-md">
      {/* Top row: Phone icon & Text */}
      <div className="flex items-start gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-sm transition-all duration-200 ${
            installed
              ? "bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/40"
              : "bg-gradient-to-br from-amber-500/25 to-amber-700/35 text-gold-soft ring-1 ring-gold-soft/40"
          }`}
        >
          {installed ? (
            <Check className="h-5 w-5 text-emerald-400 stroke-[2.5]" />
          ) : (
            <Smartphone className="h-5 w-5 text-gold-soft" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h5 className="font-display text-xs font-bold uppercase tracking-wider text-gold-soft">
            {installed ? "✓ APP INSTALLED" : "INSTALL APP"}
          </h5>
          <p className="mt-1 text-[11px] leading-relaxed text-cream/70">
            {installed
              ? "Dariyapur Shiv Mandir is installed on your device."
              : "Install Dariyapur Shiv Mandir for a faster app-like experience."}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        disabled={installed || working}
        onClick={handleInstall}
        className={`mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${
          installed
            ? "cursor-default bg-cream/15 text-cream/70 border border-cream/20"
            : "bg-gradient-to-r from-gold-soft/90 via-gold to-gold-soft/90 text-ink shadow-md hover:brightness-105 active:scale-[0.98]"
        }`}
      >
        {installed ? (
          <>
            <Check className="h-4 w-4 text-emerald-400 stroke-[2.5]" />
            <span>✓ App Installed</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>Install App</span>
          </>
        )}
      </button>

      {/* Supporting text / Confirmation */}
      <AnimatePresence mode="wait">
        {installed ? (
          <motion.div
            key="installed-confirm"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 py-1.5 px-2.5 text-[11px] font-medium text-emerald-300"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 stroke-[2.5]" />
            <span>Dariyapur Shiv Mandir has been added to your device</span>
          </motion.div>
        ) : (
          <motion.div
            key="install-perks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-cream/60"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[2.5]" />
            <span>Secure • Fast • Always Updated</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VisitorCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const displayCountRef = useRef(0);
  const [count, setCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const start = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;
      const cached = getCachedVisitorCount();
      if (cached !== null) setCount(cached.count);

      void loadVisitorCount()
        .then(setCount)
        .catch(() => {
          if (getCachedVisitorCount() === null) setUnavailable(true);
        });
    };

    const element = containerRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        start();
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (count === null) return;
    const from = displayCountRef.current;
    const difference = count - from;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      displayCountRef.current = count;
      setDisplayCount(count);
      return;
    }
    if (difference === 0) return;

    const duration = 900;
    const startedAt = performance.now();
    let frame = 0;

    const animateCount = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextCount = Math.round(from + difference * eased);
      displayCountRef.current = nextCount;
      setDisplayCount(nextCount);
      if (progress < 1) frame = window.requestAnimationFrame(animateCount);
    };

    frame = window.requestAnimationFrame(animateCount);
    return () => window.cancelAnimationFrame(frame);
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-between gap-3 border-y border-cream/10 py-3 text-xs sm:text-sm text-cream/75"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 font-medium text-cream/80 text-xs sm:text-sm">
        <Users className="h-4 w-4 text-[#a855f7]" />
        <span>Temple Website Visitors</span>
      </div>
      <span className="shrink-0 font-bold tabular-nums text-sm sm:text-base text-gold-soft">
        {count !== null
          ? displayCount.toLocaleString("en-IN")
          : unavailable
            ? "Unavailable"
            : "Loading…"}
      </span>
    </div>
  );
}
