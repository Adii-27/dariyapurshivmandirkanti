import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, MapPin, Clock, HeartHandshake } from "lucide-react";
import { Section } from "./Section";
import { ABOUT_SLIDES, TEMPLE_LOGO } from "@/lib/media";
import { useLanguage } from "@/lib/i18n";

const slides = ABOUT_SLIDES;

export function About() {
  const { t } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const slideshowRef = useRef<HTMLDivElement>(null);

  const paragraphs = [t.about.p1, t.about.p2, t.about.p3, t.about.p4, t.about.p5];

  const infoCards = [
    { icon: Landmark, label: t.about.templeNameLabel, value: t.about.templeNameValue },
    { icon: MapPin, label: t.about.locationLabel, value: t.about.locationValue },
    { icon: Clock, label: t.about.timingsLabel, value: t.about.timingsValue },
    { icon: HeartHandshake, label: t.about.coreValueLabel, value: t.about.coreValueValue },
  ];

  useEffect(() => {
    const el = slideshowRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, [isVisible, paused]);

  return (
    <Section id="about" className="bg-secondary/40">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        {/* Left: text */}
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-cream/70 px-4 py-2 shadow-sm backdrop-blur">
            <span className="text-saffron-deep">✦</span>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-saffron-deep">
              {t.about.eyebrow}
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-6xl"
          >
            {t.about.title}
          </motion.h2>

          <div className="mt-6 flex items-center gap-2" aria-hidden>
            <span className="h-[3px] w-20 rounded-full bg-saffron-deep" />
            <span className="h-2 w-2 rounded-full bg-saffron" />
            <span className="h-[3px] w-32 rounded-full bg-gold" />
          </div>

          <div className="mt-8 space-y-5 text-[15.5px] leading-[1.85] text-ink/85 sm:text-base">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <blockquote className="mt-8 rounded-r-xl border-l-4 border-saffron-deep bg-gold-soft/40 px-6 py-5 font-display text-xl font-semibold italic text-saffron-deep sm:text-2xl">
            {t.about.quote}
          </blockquote>
        </div>

        {/* Right: slideshow + info cards */}
        <div>
          <motion.div
            ref={slideshowRef}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerCancel={() => setPaused(false)}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/40 bg-card shadow-sacred"
          >
            <AnimatePresence mode="sync">
              <motion.img
                key={slides[idx].id}
                src={slides[idx].src}
                alt={slides[idx].caption}
                decoding="async"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3 sm:bottom-5 sm:left-5 sm:right-5 sm:gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream/95 p-1 shadow-sacred ring-1 ring-gold/60 sm:h-16 sm:w-16">
                <img
                  src={TEMPLE_LOGO}
                  alt="Temple logo"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="font-display text-base font-bold leading-tight text-cream sm:text-2xl">
                  {t.about.templeNameValue}
                </div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gold sm:text-xs sm:tracking-widest">
                  {t.about.officialWebsite}
                </div>
              </div>
            </div>

            {/* Slide dots */}
            <div className="absolute right-4 top-4 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`min-h-11 min-w-6 rounded-full p-2 transition-colors duration-300 after:block after:h-1.5 after:rounded-full ${
                    i === idx
                      ? "after:w-6 after:bg-cream"
                      : "after:w-1.5 after:bg-cream/50 hover:after:bg-cream/80"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
            {infoCards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="interactive-surface flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold-soft/30 p-4 backdrop-blur hover:border-gold/60 hover:bg-gold-soft/50 hover:shadow-sm"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-saffron-deep shadow-sm ring-1 ring-gold/40">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="mt-0.5 font-display text-base font-semibold leading-tight text-ink">
                    {c.value}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
