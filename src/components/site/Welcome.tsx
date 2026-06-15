import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Play } from "lucide-react";
import type { TempleVideo } from "@/lib/media";
import { getInitialVideoAspectRatio, isPortraitRatio } from "@/lib/video-presentation";
import { Section, SectionHeading } from "./Section";

export function Welcome({ introductionVideo }: { introductionVideo?: TempleVideo }) {
  const [playing, setPlaying] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(
    introductionVideo ? getInitialVideoAspectRatio(introductionVideo) : 16 / 9,
  );

  useEffect(() => {
    if (!introductionVideo) return;
    setVideoAspectRatio(getInitialVideoAspectRatio(introductionVideo));
    setPlaying(false);
  }, [introductionVideo?.id, introductionVideo?.src]);

  return (
    <Section id="welcome" className="!pt-20 sm:!pt-28">
      <SectionHeading
        eyebrow="स्वागतम्"
        title="Welcome to Dariyapur Shiv Mandir"
        hindi="हर हर महादेव"
      >
        A place of devotion, daily darshan and quiet reflection — where every visitor is greeted as
        family and every prayer carries the blessings of Bhagwan Shiv.
      </SectionHeading>

      <div className="mt-12 grid min-w-0 items-center gap-10 sm:mt-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ aspectRatio: videoAspectRatio }}
          data-orientation={isPortraitRatio(videoAspectRatio) ? "portrait" : "landscape"}
          className={`relative w-full overflow-hidden rounded-3xl border border-gold/40 bg-black shadow-sacred ${
            isPortraitRatio(videoAspectRatio) ? "mx-auto max-w-sm" : ""
          }`}
        >
          <AnimatePresence mode="wait">
            {playing && introductionVideo ? (
              introductionVideo.embedUrl ? (
                <motion.iframe
                  key="introduction-player"
                  src={`${introductionVideo.embedUrl}?autoplay=1&rel=0`}
                  title={introductionVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full border-0 bg-black"
                />
              ) : (
                <motion.video
                  key="introduction-player"
                  src={introductionVideo.src}
                  poster={introductionVideo.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-label={introductionVideo.title}
                  onLoadedMetadata={(event) => {
                    const { videoWidth, videoHeight } = event.currentTarget;
                    if (videoWidth > 0 && videoHeight > 0) {
                      setVideoAspectRatio(videoWidth / videoHeight);
                    }
                  }}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full bg-black object-contain"
                />
              )
            ) : introductionVideo ? (
              <motion.button
                key="introduction-preview"
                type="button"
                onClick={() => setPlaying(true)}
                whileTap={{ scale: 0.985 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group relative h-full w-full cursor-pointer bg-ink text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-inset"
                aria-label={`Play ${introductionVideo.title}`}
              >
                {introductionVideo.poster && (
                  <img
                    src={introductionVideo.poster}
                    alt=""
                    decoding="async"
                    className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-cream/95 text-saffron-deep shadow-glow ring-4 ring-cream/25 transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
                    <Play className="ml-1 h-8 w-8 fill-current" />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 p-5 text-cream sm:p-6">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
                    Featured
                  </span>
                  <span className="mt-1 block font-display text-2xl font-semibold">
                    {introductionVideo.title}
                  </span>
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="introduction-empty"
                role="status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid h-full w-full place-items-center bg-ink p-6 text-center text-sm text-cream/70"
              >
                Introduction video is not available right now.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
            “Where centuries of devotion meet a living, breathing community of faith.”
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            For generations the Dariyapur Shiv Mandir has been a quiet anchor for the people of
            Kanti — a place to bow your head, light a diya, and feel a stillness that the world
            outside rarely offers. Whether you arrive for daily darshan, a special festival, or
            simply to walk through the temple garden, you are welcome here.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { k: <CountUp value={60} suffix="+" />, v: "Years of Seva" },
              { k: <CountUp value={365} />, v: "Days of Darshan" },
              { k: "∞", v: "Blessings Given" },
            ].map((s) => (
              <div
                key={s.v}
                className="min-w-0 rounded-2xl border border-border bg-card/70 px-2 py-4 text-center backdrop-blur sm:p-4"
              >
                <div className="font-display text-3xl font-semibold text-gradient-saffron">
                  {s.k}
                </div>
                <div className="mt-1 break-words text-[9px] uppercase leading-tight tracking-wide text-muted-foreground sm:text-[11px] sm:tracking-wider">
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          <a
            href="#about"
            className="interactive-surface mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full gradient-saffron px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sacred"
          >
            <BookOpen className="h-4 w-4" />
            Read About Temple
          </a>
        </motion.div>
      </div>
    </Section>
  );
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(1);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(value);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.max(1, Math.round(value * eased)));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <span ref={ref} className="inline-block min-w-[3ch] tabular-nums">
      {count}
      {suffix}
    </span>
  );
}
