import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Route,
  Send,
  Sparkles,
  TrainFront,
} from "lucide-react";
import { TEMPLE_EMAIL } from "@/lib/contact";
import { TEMPLE_GLIMPSES } from "@/lib/media";
import { useLanguage } from "@/lib/i18n";
import { AutoScrollCarousel } from "./AutoScrollCarousel";
import { Section, SectionHeading } from "./Section";

const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YouTubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

const TEMPLE_LAT = 26.1581116;
const TEMPLE_LNG = 85.3053131;
const MAPS_URL = "https://maps.app.goo.gl/AwKW2occqHKrJVA9A";
const YOUTUBE_URL = "https://youtube.com/@dariyapurshivmandirkanti";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${TEMPLE_LAT},${TEMPLE_LNG}`;
const MAP_EMBED_URL = `https://www.google.com/maps?q=${TEMPLE_LAT},${TEMPLE_LNG}&z=16&output=embed`;
const MAP_LOAD_TIMEOUT_MS = 15000;
const MAP_INTERSECTION_ROOT_MARGIN = "300px 0px";
const IN_APP_BROWSER_PATTERN =
  /Instagram|FBAN|FBAV|FB_IAB|FBIOS|FB4A|Messenger|Line\/|Twitter|MicroMessenger|LinkedInApp|WhatsApp/i;
const DEVOTIONAL_QUOTES = [
  "ॐ नमः शिवाय",
  "हर हर महादेव",
  "ॐ नमः पार्वती पतये हर हर महादेव",
  "शिवोऽहम्",
  "शिव ही सत्य हैं, शिव ही सुंदर हैं",
] as const;

type MapEmbedState = "loading" | "loaded" | "fallback";

function isKnownInAppBrowser(userAgent: string) {
  return IN_APP_BROWSER_PATTERN.test(userAgent);
}

export function Location() {
  const { t } = useLanguage();

  const landmarks = [
    {
      name: t.location.landmarkRailway,
      distance: "~2.8 km",
      icon: TrainFront,
    },
    {
      name: t.location.landmarkThermal,
      distance: "~3.5 km",
      icon: Building2,
    },
    {
      name: t.location.landmarkNh27,
      distance: "~1.5 km",
      icon: Route,
    },
    {
      name: t.location.landmarkBlock,
      distance: "~4 km",
      icon: Building2,
    },
  ];

  return (
    <Section id="location" className="bg-cream/55">
      <SectionHeading
        eyebrow={t.location.eyebrow}
        title={t.location.title}
        hindi={t.location.hindi}
      >
        {t.location.subtitle}
      </SectionHeading>

      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.4fr_1fr] lg:grid-rows-[auto_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sacred sm:min-h-[560px] lg:row-span-2 lg:min-h-[760px]"
        >
          <div className="flex flex-col gap-5 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/50 bg-cream text-saffron-deep">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-2xl font-bold leading-tight text-ink">
                  {t.location.templeName}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  {t.location.addressText}
                </p>
              </div>
            </div>
            <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="interactive-surface inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl gradient-saffron px-5 text-sm font-semibold text-primary-foreground shadow-sacred sm:flex-none"
              >
                {t.location.openMapsBtn}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Get directions to Dariyapur Shiv Mandir"
                className="interactive-surface grid h-11 w-11 place-items-center rounded-xl border border-gold/60 bg-cream text-saffron-deep hover:bg-gold-soft"
              >
                <Navigation className="h-4 w-4" />
              </a>
            </div>
          </div>
          <GoogleMapEmbed />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sacred sm:p-7"
        >
          <div className="flex items-start gap-3">
            <Navigation className="mt-1 h-6 w-6 shrink-0 text-saffron-deep" />
            <div>
              <h3 className="font-display text-2xl font-bold text-ink">
                {t.location.landmarksTitle}
              </h3>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink/75 sm:text-base">
                <p>
                  <strong className="font-semibold text-ink">{t.location.travelRoadTitle}:</strong>{" "}
                  {t.location.travelRoadDesc}
                </p>
                <p>
                  <strong className="font-semibold text-ink">{t.location.travelTrainTitle}:</strong>{" "}
                  {t.location.travelTrainDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 min-[430px]:grid-cols-2">
            {landmarks.map((landmark) => (
              <div
                key={landmark.name}
                className="interactive-surface min-h-28 rounded-xl border border-border bg-cream/35 p-4 hover:border-gold/50 hover:bg-gold-soft/30 sm:min-h-32"
              >
                <landmark.icon className="h-5 w-5 text-saffron-deep" />
                <p className="mt-3 font-display text-base font-bold leading-tight text-ink sm:text-lg">
                  {landmark.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{landmark.distance}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.14 }}
          className="overflow-hidden rounded-2xl bg-[#0d0b0a] p-6 text-cream shadow-sacred sm:p-7"
        >
          <h3 className="font-display text-2xl font-bold text-cream">Official Social Media</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <motion.a
              href="https://www.instagram.com/dariyapurshivmandirkanti"
              target="_blank"
              rel="noreferrer"
              aria-label="Official Instagram page"
              whileHover={{
                scale: 1.025,
                y: -2,
                boxShadow: "0 0 24px rgba(225,48,139,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex min-h-16 items-center gap-3 rounded-xl border border-[#e1308b] bg-white/5 px-4 font-display text-base font-bold transition-[background-color,box-shadow] duration-300 hover:bg-[#e1308b]/10 hover:shadow-[0_0_24px_rgba(225,48,139,0.25)] focus-visible:ring-[#e1308b]"
            >
              <InstagramIcon className="h-5 w-5 text-[#e1308b]" />
              Instagram
            </motion.a>
            <motion.a
              href="https://www.facebook.com/share/1PK9TGw3UY/"
              target="_blank"
              rel="noreferrer"
              aria-label="Official Facebook page"
              whileHover={{
                scale: 1.025,
                y: -2,
                boxShadow: "0 0 24px rgba(24,119,242,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex min-h-16 items-center gap-3 rounded-xl border border-[#1877f2] bg-white/5 px-4 font-display text-base font-bold transition-[background-color,box-shadow] duration-300 hover:bg-[#1877f2]/10 hover:shadow-[0_0_24px_rgba(24,119,242,0.25)] focus-visible:ring-[#1877f2]"
            >
              <FacebookIcon className="h-5 w-5 text-[#1877f2]" />
              Facebook
            </motion.a>
            <motion.a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Official YouTube channel"
              whileHover={{
                scale: 1.025,
                y: -2,
                boxShadow: "0 0 24px rgba(255,0,51,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex min-h-16 items-center gap-3 rounded-xl border border-[#ff0033] bg-white/5 px-4 font-display text-base font-bold transition-[background-color,box-shadow] duration-300 hover:bg-[#ff0033]/10 hover:shadow-[0_0_24px_rgba(255,0,51,0.25)] focus-visible:ring-[#ff0033]"
            >
              <YouTubeIcon className="h-5 w-5 text-[#ff0033]" />
              YouTube
            </motion.a>
          </div>

          <div className="my-6 h-px bg-white/10" />

          <div>
            <p className="font-display text-base font-bold text-gold">Temple Glimpses</p>
            <AutoScrollCarousel
              label="Temple glimpses photo carousel"
              speed={0.16}
              className="mt-3 border border-white/10 bg-black/20 px-2"
            >
              {TEMPLE_GLIMPSES.map((photo) => (
                <figure
                  key={photo.id}
                  className="group h-24 w-28 overflow-hidden rounded-lg border border-white/10 bg-white/5 sm:w-32 lg:w-28 xl:w-32"
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </figure>
              ))}
            </AutoScrollCarousel>
          </div>
        </motion.div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span>{t.location.addressText}</span>
        <span className="hidden h-1 w-1 rounded-full bg-saffron-deep/60 sm:block" />
        <span className="tabular-nums">
          {TEMPLE_LAT.toFixed(6)}°N, {TEMPLE_LNG.toFixed(6)}°E
        </span>
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-saffron-deep hover:underline"
        >
          {t.location.directionsBtn}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Section>
  );
}

function GoogleMapEmbed() {
  const [mapState, setMapState] = useState<MapEmbedState>("loading");
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hasResolved = useRef(false);
  const hasStartedRendering = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const clearLoadTimeout = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const resolveAsFallback = () => {
      if (hasResolved.current) return;
      hasResolved.current = true;
      clearLoadTimeout();
      setShouldRenderMap(false);
      setMapState("fallback");
    };

    const startLoadTimeout = () => {
      clearLoadTimeout();
      timeoutRef.current = window.setTimeout(resolveAsFallback, MAP_LOAD_TIMEOUT_MS);
    };

    const renderMap = () => {
      if (hasStartedRendering.current) return;
      hasStartedRendering.current = true;

      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
      if (isKnownInAppBrowser(userAgent)) {
        resolveAsFallback();
        return;
      }

      setShouldRenderMap(true);
      startLoadTimeout();
    };

    const container = mapContainerRef.current;
    if (!container || !("IntersectionObserver" in window)) {
      renderMap();
      return () => {
        clearLoadTimeout();
      };
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          renderMap();
          observerRef.current?.disconnect();
          observerRef.current = null;
        }
      },
      { rootMargin: MAP_INTERSECTION_ROOT_MARGIN },
    );

    observerRef.current.observe(container);

    return () => {
      clearLoadTimeout();
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const handleMapLoad = () => {
    if (hasResolved.current) return;
    hasResolved.current = true;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMapState("loaded");
  };

  const handleMapError = () => {
    if (hasResolved.current) return;
    hasResolved.current = true;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShouldRenderMap(false);
    setMapState("fallback");
  };

  return (
    <div
      ref={mapContainerRef}
      className="relative min-h-[360px] w-full flex-1 overflow-hidden bg-cream/45 sm:min-h-[450px]"
    >
      {shouldRenderMap && (
        <iframe
          src={MAP_EMBED_URL}
          title="Google Map showing Dariyapur Shiv Mandir Kanti"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={handleMapLoad}
          onError={handleMapError}
          aria-label="Interactive Google Map for Dariyapur Shiv Mandir Kanti"
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${
            mapState === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {mapState === "loading" && <MapLoadingState />}
      {mapState === "fallback" && <MapFallbackCard />}
    </div>
  );
}

function MapLoadingState() {
  const { t } = useLanguage();

  return (
    <div
      className="absolute inset-0 grid place-items-center px-5 py-8 text-center sm:px-8"
      role="status"
      aria-live="polite"
      aria-label="Loading Google Map"
    >
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-gold/30 bg-card/80 p-6 shadow-sacred backdrop-blur sm:p-8">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/50 bg-cream text-saffron-deep">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-saffron-deep/25 border-t-saffron-deep" />
        </div>
        <p className="mt-5 font-display text-xl font-bold text-ink sm:text-2xl">
          {t.location.mapLoadingTitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.location.mapLoadingDesc}
        </p>
      </div>
    </div>
  );
}

function MapFallbackCard() {
  const { t } = useLanguage();

  return (
    <div
      className="absolute inset-0 grid place-items-center px-4 py-6 text-center sm:px-8"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-md rounded-2xl border border-gold/40 bg-card/95 p-5 shadow-sacred backdrop-blur sm:p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-gold/50 bg-cream text-saffron-deep">
          <MapPin className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-ink sm:text-2xl">
          {t.location.mapFallbackTitle}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.location.mapFallbackDesc}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.location.mapFallbackNote}
        </p>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Dariyapur Shiv Mandir Kanti in Google Maps"
          className="interactive-surface mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl gradient-saffron px-5 text-sm font-semibold text-primary-foreground shadow-sacred sm:w-auto"
        >
          {t.location.openMapsBtn}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
        <address className="mt-5 break-words not-italic text-sm leading-relaxed text-ink/75 sm:text-base">
          <span className="block font-semibold text-ink">{t.location.templeName}</span>
          <span className="block">{t.location.addressText}</span>
        </address>
      </div>
    </div>
  );
}

export function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotePaused, setQuotePaused] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const submittingRef = useRef(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emailCopied) return;
    const timeout = window.setTimeout(() => setEmailCopied(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [emailCopied]);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setQuoteVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setQuoteVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      !quoteVisible ||
      quotePaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const interval = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % DEVOTIONAL_QUOTES.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [quotePaused, quoteVisible]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (submittingRef.current || !form.reportValidity()) return;

    const formData = new FormData(form);
    if (String(formData.get("website") ?? "").trim()) {
      form.reset();
      setSent(false);
      setSubmissionError(null);
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setSent(false);
      setSubmissionError(t.contact.errorMessage);
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setSent(false);
    setSubmissionError(null);

    try {
      const { send } = await import("@emailjs/browser");
      await send(
        serviceId,
        templateId,
        {
          name: String(formData.get("name") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim(),
          phone: String(formData.get("phone") ?? "").trim(),
          subject: String(formData.get("subject") ?? "").trim(),
          message: String(formData.get("message") ?? "").trim(),
          timestamp: new Date().toISOString(),
        },
        { publicKey },
      );

      form.reset();
      setSent(true);
    } catch (error) {
      console.error("EmailJS contact form submission failed.", error);
      setSubmissionError(t.contact.errorMessage);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const copyEmail = async () => {
    let copied = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(TEMPLE_EMAIL);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = TEMPLE_EMAIL;
        textArea.readOnly = true;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.setSelectionRange(0, textArea.value.length);
        copied = document.execCommand("copy");
        textArea.remove();
      } catch {
        copied = false;
      }
    }

    setEmailCopied(copied);
  };

  return (
    <Section id="contact" className="bg-gradient-to-b from-cream via-secondary/40 to-cream">
      <SectionHeading
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        hindi={t.contact.hindi}
      >
        {t.contact.subtitle}
      </SectionHeading>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="min-w-0 space-y-4">
          <div className="mb-6">
            <h3 className="font-display text-3xl font-semibold text-ink">
              {t.contact.getInTouchTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t.contact.getInTouchDesc}
            </p>
          </div>
          <div>
            <motion.div
              whileHover={{
                scale: 1.015,
                y: -2,
                boxShadow: "0 0 28px rgba(245,158,11,0.2)",
              }}
              whileTap={{ scale: 0.985, opacity: 0.92 }}
              className="relative flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 pr-16 backdrop-blur transition-colors hover:border-gold/60"
            >
              <a
                href={`mailto:${TEMPLE_EMAIL}`}
                aria-label={`Email the temple at ${TEMPLE_EMAIL}`}
                className="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2"
              />
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-saffron/15 text-saffron-deep">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t.contact.emailLabel}
                </div>
                <div className="break-words font-medium text-ink [overflow-wrap:anywhere]">
                  {TEMPLE_EMAIL}
                </div>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy temple email address"
                className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-cream text-saffron-deep transition-[border-color,box-shadow] duration-300 hover:border-gold hover:shadow-sacred focus-visible:ring-saffron sm:right-4"
              >
                {emailCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </motion.div>
            <AnimatePresence>
              {emailCopied && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  role="status"
                  aria-live="polite"
                  className="mt-2 px-2 text-xs font-medium text-saffron-deep"
                >
                  {t.contact.emailCopiedToast}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <ContactCard
            icon={MapPin}
            label={t.contact.addressLabel}
            value={t.contact.addressValue}
            href={MAPS_URL}
            external
          />
          <motion.div
            ref={quoteRef}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.015,
              y: -2,
              boxShadow: "0 0 30px rgba(245,158,11,0.22)",
            }}
            whileTap={{ scale: 0.985, opacity: 0.92 }}
            onMouseEnter={() => setQuotePaused(true)}
            onMouseLeave={() => setQuotePaused(false)}
            onFocus={() => setQuotePaused(true)}
            onBlur={() => setQuotePaused(false)}
            tabIndex={0}
            aria-label="Rotating devotional quote"
            className="flex min-h-32 items-center gap-4 overflow-hidden rounded-2xl border border-gold/40 bg-card/80 p-5 backdrop-blur transition-colors hover:border-gold/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-saffron/15 text-saffron-deep">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t.contact.reflectionLabel}
              </div>
              <div className="mt-1 min-h-12">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="font-hindi text-xl leading-relaxed text-ink"
                  >
                    {DEVOTIONAL_QUOTES[quoteIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <form
          onSubmit={handleSubmit}
          onChange={() => {
            setSent(false);
            setSubmissionError(null);
          }}
          className="min-w-0 rounded-3xl border border-gold/40 bg-card/85 p-5 shadow-sacred backdrop-blur sm:p-9"
        >
          <h3 className="font-display text-2xl font-semibold text-ink">
            {t.contact.formTitle}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.contact.formSubtitle}
          </p>

          <div className="mt-6 space-y-4">
            <Field label={t.contact.nameLabel} id="name">
              <input
                required
                minLength={2}
                maxLength={100}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={t.contact.namePlaceholder}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              />
            </Field>
            <Field label={t.contact.emailLabelForm} id="email">
              <input
                required
                maxLength={120}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t.contact.emailPlaceholder}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              />
            </Field>
            <Field label={t.contact.phoneLabel} id="phone">
              <input
                maxLength={30}
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                pattern="(?:\+91|91|0)?(?:\s|-)?[6-9](?:(?:\s|-)?[0-9]){9}"
                placeholder={t.contact.phonePlaceholder}
                title="Enter a valid Indian phone number"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              />
            </Field>
            <Field label={t.contact.subjectLabel} id="subject">
              <select
                required
                id="subject"
                name="subject"
                defaultValue=""
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="" disabled>
                  {t.contact.subjectPlaceholder}
                </option>
                <option value="General Inquiry">{t.contact.purposeGeneral}</option>
                <option value="Festival Information">{t.contact.purposeFestival}</option>
                <option value="Temple Timings">{t.contact.purposeTimings}</option>
                <option value="Volunteer Service">{t.contact.purposeVolunteer}</option>
                <option value="Feedback">{t.contact.purposeFeedback}</option>
              </select>
            </Field>
            <Field label={t.contact.messageLabel} id="message">
              <textarea
                required
                minLength={10}
                maxLength={1500}
                id="message"
                name="message"
                rows={4}
                placeholder={t.contact.messagePlaceholder}
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              />
            </Field>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
            >
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-saffron px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sacred transition-transform hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? t.contact.sendingBtn : t.contact.sendBtn}
            </button>
            <AnimatePresence>
              {sent && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  role="status"
                  aria-live="polite"
                  className="rounded-xl border border-gold/40 bg-saffron/10 px-4 py-3 text-center text-sm font-medium text-ink"
                >
                  {t.contact.successMessage}
                </motion.p>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {submissionError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  role="alert"
                  className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-ink"
                >
                  {submissionError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </Section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href: string | null;
  external?: boolean;
}) {
  const content = (
    <>
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-saffron/15 text-saffron-deep">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="break-words font-medium text-ink [overflow-wrap:anywhere]">{value}</div>
      </div>
    </>
  );

  if (!href) {
    return (
      <div
        className="flex items-center gap-4 rounded-2xl border border-border bg-card/65 p-5 backdrop-blur"
        aria-label={`${label}: official number to be announced`}
      >
        {content}
      </div>
    );
  }

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      whileHover={{
        scale: 1.015,
        y: -2,
        boxShadow: "0 0 28px rgba(245,158,11,0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-5 backdrop-blur transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-gold/60 focus-visible:ring-offset-2"
    >
      {content}
    </motion.a>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
