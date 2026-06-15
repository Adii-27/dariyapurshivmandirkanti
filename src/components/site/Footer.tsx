import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TEMPLE_LOGO } from "@/lib/media";

const VISITOR_COUNTER_URL =
  "https://api.counterapi.dev/v1/dariyapur-shiv-mandir-kanti/website-visitors";
const VISITOR_SESSION_KEY = "dsmk-visitor-counted";

let visitorCountRequest: Promise<number> | null = null;

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

function loadVisitorCount() {
  if (visitorCountRequest) return visitorCountRequest;

  visitorCountRequest = (async () => {
    let shouldIncrement = true;

    try {
      shouldIncrement = window.sessionStorage.getItem(VISITOR_SESSION_KEY) !== "true";
    } catch {
      // Continue without session deduplication when storage is unavailable.
    }

    const response = await fetch(
      shouldIncrement ? `${VISITOR_COUNTER_URL}/up` : VISITOR_COUNTER_URL,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("Visitor counter request failed");

    const count = extractCounterValue((await response.json()) as unknown);
    if (count === null) throw new Error("Visitor counter returned an invalid value");

    if (shouldIncrement) {
      try {
        window.sessionStorage.setItem(VISITOR_SESSION_KEY, "true");
      } catch {
        // The remote count still succeeded even if session storage is blocked.
      }
    }

    return count;
  })().catch((error: unknown) => {
    visitorCountRequest = null;
    throw error;
  });

  return visitorCountRequest;
}

const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const YouTubeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

const quickLinks = [
  ["/#home", "Home"],
  ["/#about", "About"],
  ["/#gallery", "Gallery"],
  ["/#seva", "Seva"],
  ["/#visit", "Visitor Information"],
  ["/#location", "Location"],
  ["/#contact", "Contact Us"],
  ["/#updates", "Updates"],
] as const;

export function Footer() {
  return (
    <footer className="relative mt-12 overflow-hidden bg-ink text-cream/85">
      <div className="absolute inset-x-0 top-0 h-1 gradient-saffron" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-saffron/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={TEMPLE_LOGO}
                alt=""
                className="h-14 w-14 rounded-full ring-1 ring-gold/40"
              />
              <div>
                <div className="font-display text-xl font-semibold text-cream">
                  Dariyapur Shiv Mandir
                </div>
                <div className="font-hindi text-sm text-gold-soft">दरियापुर शिव मंदिर काँटी</div>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-cream/65">
              Established • 1962
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/65">
              A sacred centre of Lord Shiva devotion in Kanti, serving devotees with faith,
              compassion and community for over six decades.
            </p>
            <p className="font-hindi mt-5 text-base text-gold-soft">ॐ नमः शिवाय</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map(([h, l]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="inline-flex min-h-11 items-center rounded-md text-cream/70 transition-colors duration-300 hover:text-gold-soft"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
              Visit
            </h4>
            <ul className="mt-4 text-sm">
              <li className="font-semibold text-cream/85">Open Daily</li>
              <li className="mt-1 text-base font-semibold text-gold-soft">7:00 AM – 8:00 PM</li>
              <li className="mt-4">
                <address className="max-w-48 not-italic leading-relaxed text-cream/55">
                  <span className="block">Dariyapur Shiv Mandir Kanti</span>
                  <span className="block">Near Paswan Chowk</span>
                  <span className="block">Dariyapur, Kanti</span>
                  <span className="block">Muzaffarpur, Bihar</span>
                  <span className="block">India</span>
                </address>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
              Connect
            </h4>
            <div className="mt-4 flex gap-3">
              <motion.a
                href="https://www.instagram.com/dariyapurshivmandirkanti"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="grid h-11 w-11 place-items-center rounded-lg bg-cream/10 text-cream transition-shadow duration-300 hover:gradient-saffron hover:shadow-glow"
              >
                <InstagramIcon className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/share/1PK9TGw3UY/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="grid h-11 w-11 place-items-center rounded-lg bg-cream/10 text-cream transition-shadow duration-300 hover:gradient-saffron hover:shadow-glow"
              >
                <FacebookIcon className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://youtube.com/@dariyapurshivmandirkanti"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="grid h-11 w-11 place-items-center rounded-lg bg-cream/10 text-cream transition-shadow duration-300 hover:gradient-saffron hover:shadow-glow"
              >
                <YouTubeIcon className="h-4 w-4" />
              </motion.a>
            </div>
            <motion.a
              href="https://youtube.com/@dariyapurshivmandirkanti"
              target="_blank"
              rel="noreferrer"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-gold-soft underline-offset-4 hover:underline"
            >
              <span aria-hidden="true">▶</span>
              Visit Our YouTube Channel
            </motion.a>
            <VisitorCounter />
            <a
              href="https://maps.app.goo.gl/AwKW2occqHKrJVA9A"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-11 items-center rounded-md text-sm text-gold-soft underline-offset-4 hover:underline"
            >
              View on Google Maps →
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 text-center text-xs text-cream/55 sm:flex-row sm:text-left">
          <p>
            © Dariyapur Shiv Mandir Kanti. All Rights Reserved.{" "}
            <span className="whitespace-nowrap">Established 1962.</span>
          </p>
          <p className="font-hindi">ॐ नमः पार्वती पतये हर हर महादेव</p>
        </div>
      </div>
    </footer>
  );
}

function VisitorCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const [count, setCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const start = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;
      void loadVisitorCount()
        .then(setCount)
        .catch(() => setUnavailable(true));
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayCount(count);
      return;
    }

    const duration = 900;
    const startedAt = performance.now();
    let frame = 0;

    const animateCount = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(count * eased));
      if (progress < 1) frame = window.requestAnimationFrame(animateCount);
    };

    frame = window.requestAnimationFrame(animateCount);
    return () => window.cancelAnimationFrame(frame);
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="mt-4 border-y border-cream/10 py-3 text-sm text-cream/70"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">
          <span aria-hidden="true">👥</span> Temple Website Visitors
        </span>
        <span className="shrink-0 font-semibold tabular-nums text-gold-soft">
          {count !== null
            ? displayCount.toLocaleString("en-IN")
            : unavailable
              ? "Unavailable"
              : "Loading…"}
        </span>
      </div>
    </div>
  );
}
